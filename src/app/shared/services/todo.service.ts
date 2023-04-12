import {TodoItemRepository} from 'src/app/shared/repositories/TodoItemRepository';
import {TodoItem} from '../models/TodoItem';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {ToastrService} from "ngx-toastr";
import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TodoService extends BaseService<TodoItem> {
  private updating = false;
  private pendingActions: Array<() => void> = [];
  public override loadingCompleted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private todoItemRepository: TodoItemRepository,
    protected override authService: AuthService,
    private toastr: ToastrService
  ) {
    super(true, authService);
    this.refreshItems();
  }

  private refreshItems(): void {
    this.loadingCompleted.next(false);
    this.todoItemRepository
      .find({})
      .pipe(
        tap((items) => {
          this.updateItems(items);
          this.updating = false;
          this.loadingCompleted.next(true);
          this.processNextAction();
        }),
        catchError((error) => {
          console.error('Error fetching todo items:', error);
          this.loadingCompleted.next(true);
          return throwError(error);
        })
      )
      .subscribe();
  }

  private processNextAction(): void {
    if (this.updating || this.pendingActions.length === 0) {
      return;
    }

    this.updating = true;
    const nextAction = this.pendingActions.shift();
    if (nextAction) {
      nextAction();
    }
    this.updating = false;
  }

  getAll(): Observable<TodoItem[]> {
    return this.itemsSubject.asObservable();
  }

  addItem(text: string): void {
    this.pendingActions.push(() => {
      const item = new TodoItem(text, this.authService.getUserId());
      const index = this.items.findIndex(i => i._id === item._id);
      if (index !== -1) {
        this.items[index] = item;
      } else {
        this.items.push(item);
      }
      this.itemsSubject.next(this.items);
      this.todoItemRepository.add(item).pipe(
        tap(() => {
          localStorage.setItem('items', JSON.stringify(this.items));
          this.toastr.success('Todo item added successfully', 'Success');
        }),
        catchError((error) => {
          console.error('Error adding todo item:', error);
          this.toastr.error('Failed to add todo item', 'Error');
          return throwError(error);
        }),
        finalize(() => {
          this.updating = false;
          this.processNextAction();
        })
      ).subscribe();
    });
    this.processNextAction();
  }


  updateItem(item: TodoItem): void {
    if (this.updating) {
      return;
    }
    this.updating = true;
    const index = this.items.findIndex(i => i._id === item._id);
    if (index !== -1) {
      this.items[index] = item;
      this.itemsSubject.next(this.items);
      this.todoItemRepository.update(item).subscribe(() => {
        localStorage.setItem('items', JSON.stringify(this.items));
        this.updating = false;
      });
    }
  }

  deleteItem(id: string): void {
    this.pendingActions.push(() => {
      const index = this.items.findIndex(item => item._id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.itemsSubject.next(this.items);
        localStorage.setItem('items', JSON.stringify(this.items));
        this.todoItemRepository.delete(id).subscribe(() => {
          this.updating = false;
          this.processNextAction();
        });
      } else {
        this.updating = false;
        this.processNextAction();
      }
    });
    this.processNextAction();
  }

  protected getCacheKey(): string {
    return 'todoItems';
  }

}

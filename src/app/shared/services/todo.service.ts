import {Injectable} from '@angular/core';
import {TodoItemRepository} from 'src/app/shared/repositories/TodoItemRepository';
import {TodoItem} from '../models/TodoItem';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private updating = false;
  public todoItems: TodoItem[] = [];
  public todoItemsSubject = new BehaviorSubject<TodoItem[]>([]);
  private pendingActions: Array<() => void> = [];
  public loadingCompleted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private todoItemRepository: TodoItemRepository,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.refreshTodoItems();
  }

  private refreshTodoItems(): void {
    this.loadingCompleted.next(false); // Add this line
    this.todoItemRepository
      .find({})
      .pipe(
        tap((items) => {
          this.todoItems = items;
          this.todoItemsSubject.next(this.todoItems);
          localStorage.setItem('todoItems', JSON.stringify(items));
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
    return this.todoItemsSubject.asObservable();
  }

  addItem(text: string): void {
    this.pendingActions.push(() => {
      const item = new TodoItem(text, this.authService.getUserId());
      const index = this.todoItems.findIndex(i => i._id === item._id);
      if (index !== -1) {
        this.todoItems[index] = item;
      } else {
        this.todoItems.push(item);
      }
      this.todoItemsSubject.next(this.todoItems);
      this.todoItemRepository.add(item).pipe(
        tap(() => {
          localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
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
    const index = this.todoItems.findIndex(i => i._id === item._id);
    if (index !== -1) {
      this.todoItems[index] = item;
      this.todoItemsSubject.next(this.todoItems);
      this.todoItemRepository.update(item).subscribe(() => {
        localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
        this.updating = false;
      });
    }
  }

  deleteItem(id: string): void {
    this.pendingActions.push(() => {
      const index = this.todoItems.findIndex(item => item._id === id);
      if (index !== -1) {
        this.todoItems.splice(index, 1);
        this.todoItemsSubject.next(this.todoItems);
        localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
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


}

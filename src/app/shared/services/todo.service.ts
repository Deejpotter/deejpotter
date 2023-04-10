import {Injectable} from '@angular/core';
import {TodoItemRepository} from 'src/app/shared/repositories/TodoItemRepository';
import {TodoItem} from '../models/TodoItem';
import {map, Observable, tap, BehaviorSubject} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private userId: string;
  todoItems: TodoItem[] = [];
  todoItemsSubject = new BehaviorSubject<TodoItem[]>([]);

  constructor(
    private todoItemRepository: TodoItemRepository,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId();
    this.todoItemRepository.find({}).subscribe(items => {
      this.todoItems = items;
      this.todoItemsSubject.next(this.todoItems);
    });
  }

  getAll(): Observable<TodoItem[]> {
    return this.todoItemRepository.find({}).pipe(
      tap((items: TodoItem[]) => {
        this.todoItems = items;
        this.todoItemsSubject.next(this.todoItems);
      }),
      map((items: TodoItem[]) => {
        return this.todoItems;
      })
    );
  }

  createItem(text: string): TodoItem {
    const item = new TodoItem(text, this.userId);
    this.todoItems.push(item);
    this.todoItemsSubject.next(this.todoItems);
    return item;
  }

  addItem(text: string): void {
    let item = this.createItem(text)
    const index = this.todoItems.findIndex(i => i._id === item._id);
    if (index !== -1) {
      this.todoItems[index] = item;
    } else {
      this.todoItems.push(item);
    }
    this.todoItemsSubject.next(this.todoItems);
    this.todoItemRepository.add(item).subscribe();
  }

  updateItem(item: TodoItem): void {
    const index = this.todoItems.findIndex(i => i._id === item._id);
    if (index !== -1) {
      this.todoItems[index] = item;
      this.todoItemsSubject.next(this.todoItems);
    }
    this.todoItemRepository.update(item);
  }

  deleteItem(id: string): void {
    const index = this.todoItems.findIndex(item => item._id === id);
    this.todoItems.splice(index, 1);
    this.todoItemRepository.delete(id).subscribe();
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TodoItem} from '../models/TodoItem';
import {BaseRepository} from './BaseRepository';

@Injectable({
  providedIn: 'root',
})
export class TodoItemRepository extends BaseRepository<TodoItem> {
  constructor(http: HttpClient) {
    super(http, 'todoItems');
  }
}

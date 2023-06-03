import {TestBed} from '@angular/core/testing';
import {TodoService} from './todo.service';
import {TodoItemRepository} from '../repositories/TodoItemRepository';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoItemRepository,
        AuthService,
        ToastrService
      ]
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

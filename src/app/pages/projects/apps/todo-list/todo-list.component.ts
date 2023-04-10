import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {TodoItem} from 'src/app/shared/models/TodoItem';
import {TodoService} from 'src/app/shared/services/todo.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit, AfterViewInit {
  @ViewChild('newTodoInput') newTodoInput!: any;

  todoItems: TodoItem[] = [];
  newTodoText = '';
  todoItemsSub!: Subscription;

  constructor(
    public todoService: TodoService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.todoItemsSub = this.todoService.todoItemsSubject.subscribe((todoItems) => {
      this.todoItems = todoItems;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.newTodoInput.nativeElement.focus();
    }, 0);
  }

  addTodo(): void {
    if (!this.newTodoText.trim()) {
      return;
    }
    this.todoService.addItem(this.newTodoText.trim());
    this.newTodoText = '';
  }

  deleteTodoItem(id: string): void {
    this.todoService.deleteItem(id);
  }

  updateTodoItem(item: TodoItem): void {
    this.todoService.updateItem(item);
  }

  ngOnDestroy(): void {
    this.todoItemsSub.unsubscribe();
  }
}

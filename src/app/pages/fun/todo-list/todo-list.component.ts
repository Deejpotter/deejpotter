import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TodoItem} from 'src/app/shared/models/TodoItem';
import {TodoService} from 'src/app/shared/services/todo.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {basicFadeAnimation} from "../../../shared/utils/animations";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [basicFadeAnimation()],
})
export class TodoListComponent implements OnInit, AfterViewInit {
  @ViewChild('newTodoInput', {static: false}) newTodoInput!: ElementRef;

  todoItems: TodoItem[] = [];
  newTodoText = '';
  todoItemsSub!: Subscription;
  loading: boolean = true;

  constructor(
    public todoService: TodoService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.todoItemsSub = this.todoService.itemsSubject.subscribe((items) => {
      this.todoItems = items;
    });
    this.todoService.loadingCompleted.subscribe((loadingCompleted) => {
      this.loading = !loadingCompleted;
      setTimeout(() => {
        this.newTodoInput.nativeElement.focus();
      }, 1000);
    });
  }

  ngAfterViewInit(): void {

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

/*
 Angular class code:
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

 Angular template code:
 <div class="container">
 <div class="row justify-content-center">
 <div class="col-md-8">
 <div class="card mt-5">
 <div class="card-header bg-primary text-white">
 <h2 class="mb-0">Todo List</h2>
 </div>
 <div class="card-body shadow">
 <ng-container *ngIf="!loading; else loadingTemplate">
 <ul class="list-group">
 <ng-container *ngIf="todoService.items.length > 0; else noItems">
 <app-TodoItem *ngFor="let item of todoService.items"
 [item]="item"
 (delete)="deleteTodoItem($event)"
 (update)="updateTodoItem(item)">
 </app-TodoItem>
 </ng-container>

 <ng-template #noItems>
 <div class="text-muted text-center my-3">
 No items found. Add a new todo item.
 </div>
 </ng-template>
 </ul>
 </ng-container>

 <form class="mt-3" (submit)="addTodo(); todoInput.focus()">
 <div class="input-group">
 <input #todoInput class="form-control" [(ngModel)]="newTodoText" name="newTodoText" placeholder="Enter a new todo item"/>
 <div class="input-group-append">
 <button class="btn btn-success" type="submit">Add</button>
 </div>
 </div>
 </form>
 <ng-template #loadingTemplate>
 <app-loading-spinner [isLoading]="loading"></app-loading-spinner>
 </ng-template>
 </div>
 </div>
 </div>
 </div>
 </div>

 Nextjs code:
 */

import { ReactElement } from "react";
import { TodoItemModel } from "@/components/TodoList/TodoItem/TodoItem";

//
export type TodoListModel = {
  _id: string;
  name: string;
  items: TodoItemModel[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Handles the rendering of the todo list mini app. This component is responsible for rendering the todo list and its items.
 * Uses the TodoItem component to render each todo item.
 * Can add new todo items, delete existing todo items, and update existing todo items.
 * Todo: Need to finish the implementation of this component.
 * Todo: Should only be accessed by authenticated users and should only display the todo list items for the currently authenticated user.
 * Todo: Also needs to handle loading states and display a loading spinner while the todo list items are being fetched.
 * Todo: Needs to handle errors and display an error message if the todo list items fail to load.
 * Todo: Needs to handle empty states and display a message if there are no todo list items to display or if the user is not authenticated.
 * Todo: Should have some kind of middle service to make the updates fast then sync with the server.
 */
export default function TodoList(): ReactElement | null {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Todo List</h2>
            </div>
            <div className="card-body shadow">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center py-1 mb-1">
                  <span>Item 1</span>
                  <div>
                    <button className="btn btn-warning me-1">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

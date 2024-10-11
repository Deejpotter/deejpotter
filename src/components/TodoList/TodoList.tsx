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

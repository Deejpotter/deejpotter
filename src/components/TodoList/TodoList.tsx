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

"use client";

import React, { useState, useEffect, useRef, ReactElement } from "react";
import TodoItem, {
  TodoItemModel,
} from "@/components/TodoList/TodoItem/TodoItem";
import { useTodo } from "@/contexts/TodoContext";

/**
 * TodoList Component
 *
 * This component is responsible for rendering the todo list and managing todo items.
 * It uses the TodoContext to access and manipulate todo data.
 */
export default function TodoList(): ReactElement {
  // State for the new todo text input
  // This is similar to the 'newTodoText' property in the Angular component
  const [newTodoText, setNewTodoText] = useState<string>("");

  // Reference to the new todo input element
  // This is similar to the @ViewChild('newTodoInput') in the Angular component
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Use the todo context to access todo-related data and functions
  // This replaces the injected TodoService in the Angular component
  const { todos, isLoading, addTodo, updateTodo, deleteTodo, fetchTodos } =
    useTodo();

  /**
   * useEffect hook to fetch todos when the component mounts.
   */
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * useEffect hook to focus the new todo input when loading is completed.
   */
  useEffect(() => {
    if (!isLoading && newTodoInputRef.current) {
      newTodoInputRef.current?.focus();
    }
  }, [isLoading]);

  /**
   * Function to add a new todo
   * This is similar to the addTodo method in the Angular component
   *
   * @param {React.FormEvent} e - The form submit event
   */
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) {
      return;
    }
    addTodo(newTodoText.trim());
    setNewTodoText("");
  };

  /**
   * Function to delete a todo item
   * This is similar to the deleteTodoItem method in the Angular component
   *
   * @param {string} id - The id of the todo item to delete
   */
  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  /**
   * Function to update a todo item
   * This is similar to the updateTodoItem method in the Angular component
   *
   * @param {TodoItemModel} item - The updated todo item
   */
  const handleUpdateTodo = (item: TodoItemModel) => {
    updateTodo(item);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Todo List</h2>
            </div>
            <div className="card-body shadow">
              {/* 
                Conditional rendering based on loading state
                This replaces the *ngIf="!loading; else loadingTemplate" in the Angular template
              */}
              {!isLoading ? (
                <>
                  <ul className="list-group">
                    {/* 
                      Conditional rendering based on the presence of todo items
                      This replaces the *ngIf="todoService.items.length > 0; else noItems" in the Angular template
                    */}
                    {todos.length > 0 ? (
                      todos.map((item) => (
                        <TodoItem
                          key={item._id.toString()}
                          item={item}
                          delete={() => handleDeleteTodo(item._id.toString())}
                          update={handleUpdateTodo}
                        />
                      ))
                    ) : (
                      <div className="text-muted text-center my-3">
                        No items found. Add a new todo item.
                      </div>
                    )}
                  </ul>

                  {/* 
                    Form for adding new todo items
                    This replaces the form in the Angular template
                  */}
                  <form className="mt-3" onSubmit={handleAddTodo}>
                    <div className="input-group">
                      <input
                        ref={newTodoInputRef}
                        className="form-control"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        placeholder="Enter a new todo item"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-success" type="submit">
                          Add
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                // Loading spinner
                // This replaces the <app-loading-spinner> in the Angular template
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 angular code:
 <li class="list-group-item d-flex justify-content-between align-items-center py-1 mb-1" (click)="startEditing()">
 <span *ngIf="!editing">{{ item.text }}</span>
 <ng-container *ngIf="editing">
 <input #editInput *ngIf="editing" class="form-control" [(ngModel)]="updatedText" (blur)="finishEditing()" (keyup.enter)="finishEditing()" />
 <button class="btn btn-primary ml-2" (click)="finishEditing()">
 Save
 </button>
 </ng-container>
 <div>
 <button class="btn btn-warning me-1" (click)="startEditing()" *ngIf="!editing">
 <i class="bi bi-pencil"></i>
 </button>
 <button class="btn btn-danger" (click)="delete.emit(item._id)">
 <i class="bi bi-trash"></i>
 </button>
 </div>
 </li>

 nextjs code:
 */

import {ReactElement} from "react";

export default function TodoItem(props: any): ReactElement | null {

  /*
   Angular code:
   @Input() item!: TodoItem;
   @Output() delete: EventEmitter<string> = new EventEmitter();
   @Output() update: EventEmitter<TodoItem> = new EventEmitter();
   @ViewChildren('editInput') editInputs!: QueryList<ElementRef>;

   editing = false;
   updatedText!: string;

   constructor() {
   }

   ngAfterViewChecked(): void {
   if (this.editing) {
   setTimeout(() => {
   this.focusUpdateInput();
   }, 0);
   }
   }

   startEditing(): void {
   this.editing = true;
   this.updatedText = this.item.text;
   }

   finishEditing(): void {
   this.editing = false;
   if (this.updatedText.trim() !== this.item.text.trim()) {
   this.item.text = this.updatedText;
   this.update.emit(this.item);
   }
   }

   private focusUpdateInput(): void {
   const inputElement = this.editInputs.first;
   if (inputElement) {
   inputElement.nativeElement.focus();
   }
   }

   Nextjs code:
   */

  // Check that the item property exists.
  if (!props.item) {
    return null;
  }

  // Create a function to handle the click event on the edit button.
  const startEditing = () => {
    // Set the editing property to true.
    // Set the updatedText property to the text of the item.
  }

  // Create a function to handle the click event on the save button.
  const finishEditing = () => {
    // Set the editing property to false.
    // If the updatedText property is not the same as the text of the item, set the text of the item to the updatedText property.
  }

  // Create a function to handle the click event on the delete button.
  const deleteItem = () => {
    // Emit the delete event with the id of the item.
  }

  // Create a function to handle the change event on the input.
  const updateText = () => {
    // Set the updatedText property to the value of the input.
  }

  return (// Each item will be a list item with a button to edit and a button to delete. The text of the item will be displayed in a span. When the edit button is
    // clicked, the span will be replaced with an input and a save button. When the save button is clicked, the input will be replaced with a span.
    <li className="list-group-item d-flex justify-content-between align-items-center py-1 mb-1">
      <span>{props.item.text}</span>
      <div>
        <button className="btn btn-warning me-1">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-danger">
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>)
}

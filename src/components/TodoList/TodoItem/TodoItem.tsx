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

 nextjs code:
 */

import React, { useState, useRef, useEffect, ReactElement } from "react";

export type TodoItemModel = {
  _id: string;
  text: string;
  listId: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TodoItemProps = {
  item: { id: string; text: string };
  update: (item: { id: string; text: string }) => void;
  delete: (id: string) => void;
};

export default function TodoItem(props: TodoItemProps): ReactElement | null {
  const [editing, setEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(props.item.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the input element when editing starts.
  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  // Check that the item property exists.
  if (!props.item) {
    return null;
  }

  // Create a function to handle the click event on the edit button.
  const startEditing = () => {
    // Set the editing property to true.
    setEditing(true);
    // Set the updatedText property to the text of the item.
    setUpdatedText(props.item.text);
  };

  // Create a function to handle the click event on the save button.
  const finishEditing = () => {
    // Set the editing property to false.
    setEditing(false);
    // If the updatedText property is not the same as the text of the item, set the text of the item to the updatedText property.
    if (updatedText.trim() !== props.item.text.trim()) {
      props.update({ ...props.item, text: updatedText });
    }
  };

  // Create a function to handle the click event on the delete button.
  const deleteItem = () => {
    // Emit the delete event with the id of the item.
    props.delete(props.item.id);
  };

  // Create a function to handle the change event on the input.
  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Set the updatedText property to the value of the input.
    setUpdatedText(e.target.value);
  };

  return (
    // Each item will be a list item with a button to edit and a button to delete. The text of the item will be displayed in a span. When the edit button is
    // clicked, the span will be replaced with an input and a save button. When the save button is clicked, the input will be replaced with a span.
    <li className="flex justify-between items-center py-1 mb-1 border-b border-gray-200">
      {editing ? (
        <input
          ref={editInputRef}
          value={updatedText}
          onChange={updateText}
          className="form-control mr-2"
        />
      ) : (
        <span>{props.item.text}</span>
      )}
      <div className="flex items-center">
        {editing ? (
          <button className="btn btn-sm btn-success mr-1" onClick={finishEditing}>
            <i className="bi bi-check"></i>
          </button>
        ) : (
          <button className="btn btn-sm btn-warning mr-1" onClick={startEditing}>
            <i className="bi bi-pencil"></i>
          </button>
        )}
        <button className="btn btn-sm btn-danger" onClick={deleteItem}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>
  );
}

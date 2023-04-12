import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {TodoItem} from 'src/app/shared/models/TodoItem';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements AfterViewChecked {
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
}

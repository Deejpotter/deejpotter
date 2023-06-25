import {TodoItemModel} from "@/partials/TodoItem/TodoItemModel";

export interface TodoListModel {
  _id: string;
  name: string;
  items: TodoItemModel[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

import {TodoItemModel} from "@/components/TodoList/TodoItem/TodoItemModel";

export interface TodoListModel {
  _id: string;
  name: string;
  items: TodoItemModel[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

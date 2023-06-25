export interface TodoItemModel {
  _id: string;
  text: string;
  listId: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

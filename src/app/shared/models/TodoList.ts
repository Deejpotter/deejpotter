import {TodoItem} from './TodoItem';
import {RepoObject} from "./RepoObject";

export class TodoList extends RepoObject {
  name: string;
  items: TodoItem[];

  constructor(name: string, userId: string, items?: TodoItem[]) {
    super(userId);
    this._id = userId;
    this.name = name;
    this.items = items ?? [];
  }
}

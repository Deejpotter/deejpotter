import {RepoObject} from "./RepoObject";

export class TodoItem extends RepoObject {
  text: string;
  listId: string;
  completed: boolean;

  constructor(text: string, userId:string) {
    super(userId);
    this.text = text;
    this.listId = userId;
    this.completed = false;
  }
}

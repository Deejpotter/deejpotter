import ObjectId from "bson-objectid";

export abstract class RepoObject {
  _id: string = new ObjectId().toHexString();
  userId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  protected constructor(userId: string) {
    this.userId = userId;
  }

}

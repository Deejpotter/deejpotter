import { ReactElement } from "react";
import { TodoItemModel } from "@/components/TodoList/TodoItem/TodoItem";

export type TodoListModel = {
  _id: string;
  name: string;
  items: TodoItemModel[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function TodoList(): ReactElement | null {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 bg-primary px-6 py-5 text-white dark:border-gray-800">
          <h2 className="text-2xl font-bold">Todo List</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            <li className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950/30">
              <span className="text-gray-800 dark:text-gray-200">Item 1</span>
              <div className="flex gap-2">
                <button className="inline-flex items-center rounded-full bg-amber-500 px-3 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]">
                  Edit
                </button>
                <button className="inline-flex items-center rounded-full bg-red-600 px-3 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]">
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

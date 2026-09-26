import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Todo App",
  "A simple todo list app built with React and Next.js.",
  "/projects/apps/todo-app"
);

import { ReactElement } from "react";
import TodoList from "@/components/TodoList/TodoList";

export default function TodoApp(): ReactElement {
  return <TodoList />;
}

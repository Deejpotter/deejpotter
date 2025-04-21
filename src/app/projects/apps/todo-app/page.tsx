import { ReactElement } from "react";
import TodoList from "@/components/TodoList/TodoList";
import { TodoProvider } from "@/contexts/TodoContext";

export default function TodoApp(): {
  return (
    < TodoProvider >
  <TodoList />
  </TodoProvider>
  );

}

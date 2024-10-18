"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TodoItemModel } from "@/components/TodoList/TodoItem/TodoItem";
import bson from "bson";
import TodoItem from "@/components/TodoList/TodoItem/TodoItem";

// The model for the todo list.
export type TodoListModel = {
  _id: bson.ObjectId;
  name: string;
  items: TodoItemModel[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Simulated API functions - replace these with actual API calls
const api = {
  fetchTodos: async (): Promise<TodoItemModel[]> => {
    // Fetch todos from MongoDB
    return [];
  },
  addTodo: async (todo: TodoItemModel): Promise<void> => {
    // Add todo to MongoDB
  },
  updateTodo: async (todo: TodoItemModel): Promise<void> => {
    // Update todo in MongoDB
  },
  deleteTodo: async (id: string): Promise<void> => {
    // Delete todo from MongoDB
  },
};

type QueueItem = {
  action: "add" | "update" | "delete";
  todo: TodoItemModel;
};

/**
 * Handles the rendering of the todo list mini app. This component is responsible for rendering the todo list and its items.
 * Uses the TodoItem component to render each todo item.
 * Can add new todo items, delete existing todo items, and update existing todo items.
 * Implements local state management with optimistic updates and background syncing with MongoDB.
 */
export default function TodoList(): React.ReactElement {
  const [todos, setTodos] = useState<TodoItemModel[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await api.fetchTodos();
        setTodos(fetchedTodos);
        setLoading(false);
      } catch (err) {
        setError("Failed to load todo items. Please try again later.");
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Process queue
  useEffect(() => {
    const processQueue = async () => {
      if (queue.length > 0 && !syncing) {
        setSyncing(true);
        const item = queue[0];
        try {
          switch (item.action) {
            case "add":
              await api.addTodo(item.todo);
              break;
            case "update":
              await api.updateTodo(item.todo);
              break;
            case "delete":
              await api.deleteTodo(item.todo._id);
              break;
          }
          setQueue(queue.slice(1));
        } catch (error) {
          console.error("Sync failed:", error);
          // Implement retry logic here
        }
        setSyncing(false);
      }
    };
    processQueue();
  }, [queue, syncing]);

  // Periodic consistency check
  useEffect(() => {
    const consistencyCheck = async () => {
      try {
        const serverTodos = await api.fetchTodos();
        setTodos((prevTodos) => {
          // Merge server state with local state, preferring local changes
          const mergedTodos = serverTodos.map((serverTodo) => {
            const localTodo = prevTodos.find((t) => t._id === serverTodo._id);
            return localTodo || serverTodo;
          });
          // Add any local todos that don't exist on the server
          prevTodos.forEach((localTodo) => {
            if (!serverTodos.some((t) => t._id === localTodo._id)) {
              mergedTodos.push(localTodo);
            }
          });
          return mergedTodos;
        });
      } catch (error) {
        console.error("Consistency check failed:", error);
      }
    };
    const interval = setInterval(consistencyCheck, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Focus on input after loading
  useEffect(() => {
    if (!loading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading]);

  const addTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTodoText.trim()) return;

      const newTodo: TodoItemModel = {
        _id: new bson.ObjectId().toHexString(),
        text: newTodoText.trim(),
        listId: "1", // Replace with actual list ID
        completed: false,
        userId: "1", // Replace with actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setQueue((prevQueue) => [...prevQueue, { action: "add", todo: newTodo }]);
      setNewTodoText("");
    },
    [newTodoText]
  );

  const updateTodoItem = useCallback((updatedItem: TodoItemModel) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
    setQueue((prevQueue) => [
      ...prevQueue,
      { action: "update", todo: updatedItem },
    ]);
  }, []);

  const deleteTodoItem = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    setQueue((prevQueue) => [
      ...prevQueue,
      { action: "delete", todo: { _id: id } as TodoItemModel },
    ]);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading spinner component
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Todo List</h2>
            </div>
            <div className="card-body shadow">
              {todos.length > 0 ? (
                <ul className="list-group">
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo._id}
                      item={todo}
                      delete={deleteTodoItem}
                      update={updateTodoItem}
                    />
                  ))}
                </ul>
              ) : (
                <div className="text-muted text-center my-3">
                  No items found. Add a new todo item.
                </div>
              )}
              <form className="mt-3" onSubmit={addTodo}>
                <div className="input-group">
                  <input
                    ref={newTodoInputRef}
                    className="form-control"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Enter a new todo item"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-success" type="submit">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

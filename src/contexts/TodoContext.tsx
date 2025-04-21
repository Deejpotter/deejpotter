// src/contexts/TodoContext.tsx

/**
 * This file defines the TodoContext, which manages the state and operations for a todo list application.
 * It uses React's Context API for state management across components, and implements features like
 * optimistic updates, offline support, and handling of concurrent updates.
 *
 * Key concepts used:
 * - React Context: https://reactjs.org/docs/context.html
 * - useReducer Hook: https://reactjs.org/docs/hooks-reference.html#usereducer
 * - useCallback Hook: https://reactjs.org/docs/hooks-reference.html#usecallback
 * - useEffect Hook: https://reactjs.org/docs/hooks-effect.html
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
// React is the core library for building UI components
// createContext is used to create a new context object
// useContext is a hook that lets you read and subscribe to context from your components
// useReducer is a hook that lets you manage local state of complex components with a reducer
// useCallback is a hook that lets you cache a function definition between re-renders
// ReactNode is a type that represents a React element, an array of React elements, or a string, number, or boolean
// useEffect is a hook that lets you perform side effects in function components

import netlifyIdentity from "netlify-identity-widget";
// This is used for user authentication with Netlify Identity
// https://github.com/netlify/netlify-identity-widget

import bson from "bson";
// BSON is used for working with MongoDB-style ObjectIds
// https://github.com/mongodb/js-bson

// Define the shape of a todo item
export interface TodoItemModel {
  _id: bson.ObjectId; // Unique identifier for the todo item
  text: string; // The content of the todo item
  completed: boolean; // Whether the todo item is completed or not
  userId: string; // The ID of the user who created the todo item
  createdAt: Date; // When the todo item was created
  updatedAt: Date; // When the todo item was last updated
}

// Define the shape of the todo list state
interface TodoState {
  todos: TodoItemModel[]; // Array of todo items
  isLoading: boolean; // Whether the todo list is currently loading
  error: string | null; // Any error message, or null if no error
  pendingActions: Array<() => Promise<void>>; // Queue of actions to be performed
}

// Use an enum to make sure the action types are consistent.
export enum TodoActionTypes {
  SET_TODOS = "SET_TODOS",
  ADD_TODO = "ADD_TODO",
  UPDATE_TODO = "UPDATE_TODO",
  DELETE_TODO = "DELETE_TODO",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  ADD_PENDING_ACTION = "ADD_PENDING_ACTION",
  REMOVE_PENDING_ACTION = "REMOVE_PENDING_ACTION",
}

// Define the types of actions that can be performed on the todo list
type TodoAction =
  | { type: "SET_TODOS"; payload: TodoItemModel[] }
  | { type: "ADD_TODO"; payload: TodoItemModel }
  | { type: "UPDATE_TODO"; payload: TodoItemModel }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "ADD_PENDING_ACTION"; payload: () => Promise<void> }
  | { type: "REMOVE_PENDING_ACTION" };

/**
 * The reducer function for managing todo state.
 * It takes the current state and an action, and returns the new state.
 * This is used with the useReducer hook to manage complex state logic.
 *
 * Learn more about reducers: https://reactjs.org/docs/hooks-reference.html#usereducer
 */
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "SET_TODOS":
      // Replace the entire todo list
      return { ...state, todos: action.payload, isLoading: false };
    case "ADD_TODO":
      // Add a new todo item to the list
      return { ...state, todos: [...state.todos, action.payload] };
    case "UPDATE_TODO":
      // Update an existing todo item
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo._id.equals(action.payload._id) ? action.payload : todo
        ),
      };
    case "DELETE_TODO":
      // Remove a todo item from the list
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo._id.equals(action.payload)),
      };
    case "SET_LOADING":
      // Set the loading state
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      // Set an error message
      return { ...state, error: action.payload };
    case "ADD_PENDING_ACTION":
      // Add a new action to the queue of pending actions
      return {
        ...state,
        pendingActions: [...state.pendingActions, action.payload],
      };
    case "REMOVE_PENDING_ACTION":
      // Remove the first action from the queue of pending actions
      return { ...state, pendingActions: state.pendingActions.slice(1) };
    default:
      return state;
  }
};

// Define the shape of the context that will be provided to components
interface TodoContextType extends Omit<TodoState, "pendingActions"> {
  addTodo: (text: string) => void;
  updateTodo: (todo: TodoItemModel) => void;
  deleteTodo: (id: string) => void;
  fetchTodos: () => Promise<void>;
}

// Create the context
// createContext is used to create a Context object. When React renders a component that subscribes to this Context object
// it will read the current context value from the closest matching Provider above it in the tree.
// Learn more: https://reactjs.org/docs/context.html#react-createcontext
const TodoContext = createContext<TodoContextType | undefined>(undefined);

/**
 * A simple hook for displaying notifications.
 * In a real application, you might want to use a more robust solution like react-toastify.
 *
 * Learn more about custom hooks: https://reactjs.org/docs/hooks-custom.html
 */
const useNotification = () => {
  return {
    success: (message: string) => console.log(`Success: ${message}`),
    error: (message: string) => console.error(`Error: ${message}`),
  };
};

/**
 * The TodoProvider component. This component provides the TodoContext to its children,
 * allowing them to interact with the todo list state.
 *
 * Learn more about Context.Provider: https://reactjs.org/docs/context.html#contextprovider
 */
export const TodoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Set up the state using useReducer
  // useReducer is preferred over useState when you have complex state logic that involves multiple sub-values
  // or when the next state depends on the previous one.
  // Learn more: https://reactjs.org/docs/hooks-reference.html#usereducer
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    isLoading: false,
    error: null,
    pendingActions: [],
  });

  // Get the current user's ID
  const userId = netlifyIdentity.currentUser()?.id;

  // Set up the notification system
  const notify = useNotification();

  /**
   * Effect to load cached todos from localStorage and fetch fresh todos from the server when the component mounts.
   *
   * Learn more about useEffect: https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    const cachedTodos = localStorage.getItem("todos");
    if (cachedTodos) {
      dispatch({ type: "SET_TODOS", payload: JSON.parse(cachedTodos) });
    }
    fetchTodos();
  }, []);

  /**
   * Effect to process pending actions when there are any and the state is not currently loading.
   * This helps manage concurrent updates and ensures that actions are processed in order.
   */
  useEffect(() => {
    if (state.pendingActions.length > 0 && !state.isLoading) {
      const action = state.pendingActions[0];
      dispatch({ type: "SET_LOADING", payload: true });
      action().finally(() => {
        dispatch({ type: "REMOVE_PENDING_ACTION" });
        dispatch({ type: "SET_LOADING", payload: false });
      });
    }
  }, [state.pendingActions, state.isLoading]);

  /**
   * Fetches todos from the server and updates the state.
   * This function is memoized with useCallback to prevent unnecessary re-renders.
   * It only changes when the notify function changes.
   * https://reactjs.org/docs/hooks-reference.html#usecallback
   */
  const fetchTodos = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // In Next.js, API routes are served under the /api directory
      // Learn more: https://nextjs.org/docs/api-routes/introduction
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const todos = await response.json();
      dispatch({ type: "SET_TODOS", payload: todos });
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch todos" });
      notify.error("Failed to fetch todos");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [notify]);

  /**
   * Adds a new todo item to the list.
   * This function updates the state optimistically and then syncs with the server.
   */
  const addTodo = useCallback(
    (text: string) => {
      const newTodo: TodoItemModel = {
        _id: new bson.ObjectId(),
        text,
        completed: false,
        userId: userId || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: "ADD_TODO", payload: newTodo });
      dispatch({
        type: "ADD_PENDING_ACTION",
        payload: async () => {
          try {
            const response = await fetch("/api/todos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newTodo),
            });
            if (!response.ok) {
              throw new Error("Failed to add todo");
            }
            notify.success("Todo added successfully");
          } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to add todo" });
            notify.error("Failed to add todo");
          }
        },
      });
    },
    [userId, notify]
  );

  /**
   * Updates an existing todo item.
   * This function updates the state optimistically and then syncs with the server.
   */
  const updateTodo = useCallback(
    (todo: TodoItemModel) => {
      dispatch({ type: "UPDATE_TODO", payload: todo });
      dispatch({
        type: "ADD_PENDING_ACTION",
        payload: async () => {
          try {
            const response = await fetch(`/api/todos/${todo._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(todo),
            });
            if (!response.ok) {
              throw new Error("Failed to update todo");
            }
            notify.success("Todo updated successfully");
          } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to update todo" });
            notify.error("Failed to update todo");
          }
        },
      });
    },
    [notify]
  );

  /**
   * Deletes a todo item from the list.
   * This function updates the state optimistically and then syncs with the server.
   */
  const deleteTodo = useCallback(
    (id: string) => {
      // dispatch is p
      dispatch({ type: "DELETE_TODO", payload: id });
      dispatch({
        type: "ADD_PENDING_ACTION",
        payload: async () => {
          try {
            const response = await fetch(`/api/todos/${id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error("Failed to delete todo");
            }
            notify.success("Todo deleted successfully");
          } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Failed to delete todo" });
            notify.error("Failed to delete todo");
          }
        },
      });
    },
    [notify]
  );

  // Provide the context value to children components
  return (
    <TodoContext.Provider
      value={{ ...state, addTodo, updateTodo, deleteTodo, fetchTodos }}
    >
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Custom hook to use the TodoContext.
 * This hook checks if it's being used within a TodoProvider and throws an error if it's not.
 * https://reactjs.org/docs/hooks-custom.html
 */
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

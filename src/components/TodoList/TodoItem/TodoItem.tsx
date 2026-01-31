/*
 Legacy Angular implementation removed; this component is a Tailwind-styled React placeholder awaiting real data wiring.
 */

import React, { useState, useRef, useEffect, ReactElement } from "react";

export type TodoItemModel = {
  _id: string;
  text: string;
  listId: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TodoItemProps = {
  item: { id: string; text: string };
  update: (item: { id: string; text: string }) => void;
  delete: (id: string) => void;
};

export default function TodoItem(props: TodoItemProps): ReactElement | null {
  const [editing, setEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(props.item.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus the input element when editing starts.
  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  // Check that the item property exists.
  if (!props.item) {
    return null;
  }

  // Create a function to handle the click event on the edit button.
  const startEditing = () => {
    // Set the editing property to true.
    setEditing(true);
    // Set the updatedText property to the text of the item.
    setUpdatedText(props.item.text);
  };

  // Create a function to handle the click event on the save button.
  const finishEditing = () => {
    // Set the editing property to false.
    setEditing(false);
    // If the updatedText property is not the same as the text of the item, set the text of the item to the updatedText property.
    if (updatedText.trim() !== props.item.text.trim()) {
      props.update({ ...props.item, text: updatedText });
    }
  };

  // Create a function to handle the click event on the delete button.
  const deleteItem = () => {
    // Emit the delete event with the id of the item.
    props.delete(props.item.id);
  };

  // Create a function to handle the change event on the input.
  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Set the updatedText property to the value of the input.
    setUpdatedText(e.target.value);
  };

  return (
    // Each item will be a list item with a button to edit and a button to delete. The text of the item will be displayed in a span. When the edit button is
    // clicked, the span will be replaced with an input and a save button. When the save button is clicked, the input will be replaced with a span.
    <li className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {editing ? (
        <input
          ref={editInputRef}
          value={updatedText}
          onChange={updateText}
          className="mr-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      ) : (
        <span>{props.item.text}</span>
      )}
      <div className="flex items-center">
        {editing ? (
          <button
            className="mr-2 inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            onClick={finishEditing}
            type="button"
          >
            Save
          </button>
        ) : (
          <button
            className="mr-2 inline-flex items-center justify-center rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            onClick={startEditing}
            type="button"
          >
            Edit
          </button>
        )}
        <button
          className="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          onClick={deleteItem}
          type="button"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

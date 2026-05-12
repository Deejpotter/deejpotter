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

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  if (!props.item) {
    return null;
  }

  const startEditing = () => {
    setEditing(true);
    setUpdatedText(props.item.text);
  };

  const finishEditing = () => {
    setEditing(false);
    if (updatedText.trim() !== props.item.text.trim()) {
      props.update({ ...props.item, text: updatedText });
    }
  };

  const deleteItem = () => {
    props.delete(props.item.id);
  };

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedText(e.target.value);
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {editing ? (
        <input
          ref={editInputRef}
          value={updatedText}
          onChange={updateText}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      ) : (
        <span className="text-gray-800 dark:text-gray-200">{props.item.text}</span>
      )}
      <div className="flex shrink-0 gap-2">
        {editing ? (
          <button
            className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            onClick={finishEditing}
          >
            Save
          </button>
        ) : (
          <button
            className="inline-flex items-center rounded-full bg-amber-500 px-3 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            onClick={startEditing}
          >
            Edit
          </button>
        )}
        <button
          className="inline-flex items-center rounded-full bg-red-600 px-3 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
          onClick={deleteItem}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

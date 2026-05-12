"use client";
import React, { useState } from "react";

const ConversationsList: React.FC = () => {
  const [selectedType, setSelectedType] = useState("Chat");

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <label htmlFor="conversation-type" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        Conversation Type:
      </label>
      <select
        id="conversation-type"
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        value={selectedType}
        onChange={handleTypeChange}
      >
        <option value="Chat">Chat</option>
        <option value="Email">Email</option>
      </select>
    </div>
  );
};

export default ConversationsList;

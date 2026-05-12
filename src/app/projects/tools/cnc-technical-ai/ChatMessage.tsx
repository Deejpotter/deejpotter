import React from "react";

interface ChatMessageProps {
  message: string;
  type: "user" | "bot";
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, type }) => {
  const isUser = type === "user";

  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
        isUser
          ? "ml-auto bg-primary text-white"
          : "mr-auto border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      }`}
    >
      {message}
    </div>
  );
};

export default ChatMessage;

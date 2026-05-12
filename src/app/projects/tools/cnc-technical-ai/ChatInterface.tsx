"use client";

import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useAuth } from "@clerk/nextjs";
import LayoutContainer from "@/components/LayoutContainer";
import { Send, Upload, RotateCcw, MessageSquare, FileText } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  setShowConversations,
  showConversations,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const { getToken } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createMessage = (type: "user" | "bot", content: string): ChatMessage => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    type,
    content,
    timestamp: new Date(),
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = createMessage("user", inputMessage.trim());
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const jwt = await getToken();
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({
          inputCode: userMessage.content,
          model: "gpt-4o-mini",
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          let botResponseContent = "";
          const botMessage = createMessage("bot", "");
          setMessages((prev) => [...prev, botMessage]);

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              botResponseContent += chunk;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessage.id ? { ...msg, content: botResponseContent } : msg
                )
              );
            }
          } finally {
            reader.releaseLock();
          }
        }
      } else {
        setMessages((prev) => [
          ...prev,
          createMessage("bot", "Sorry, I encountered an error. Please try again."),
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        createMessage("bot", "Sorry, I couldn't connect to the server. Please try again."),
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploadProgress("Uploading file...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const jwt = await getToken();
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
      });

      setUploadProgress(response.ok ? "File uploaded successfully!" : "Failed to upload file.");
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadProgress("Upload failed - connection error.");
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
    }
  };

  const handleReinitializeQA = async () => {
    if (
      !confirm(
        "Are you sure you want to reinitialize the Q&A collection? This will reset all uploaded data."
      )
    ) {
      return;
    }

    try {
      const jwt = await getToken();
      const response = await fetch(`${apiUrl}/reinitialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
      });

      alert(response.ok ? "Q&A Collection reinitialized successfully." : "Failed to reinitialize Q&A Collection.");
    } catch (error) {
      console.error("Error reinitializing Q&A Collection:", error);
      alert("Failed to reinitialize Q&A Collection.");
    }
  };

  return (
    <LayoutContainer className="min-h-[calc(100vh-9rem)]">
      <div className="grid min-h-[calc(100vh-9rem)] gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">CNC Technical AI</h2>
          </div>

          <div
            className={`mb-4 rounded-2xl border-2 border-dashed p-4 text-center transition ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950/40"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-2 text-primary" size={32} />
            <p className="mb-1 font-semibold text-gray-900 dark:text-white">Upload Q&A CSV</p>
            <small className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to select</small>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </div>

          {uploadProgress && (
            <div className="mb-4 rounded-2xl border border-info/20 bg-info/10 px-4 py-3 text-sm text-info">
              {uploadProgress}
            </div>
          )}

          <div className="space-y-2">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-100 dark:hover:bg-gray-800"
              onClick={handleClearChat}
              disabled={messages.length === 0}
            >
              <RotateCcw size={16} />
              Clear Chat
            </button>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm font-semibold text-warning transition hover:bg-warning/20"
              onClick={handleReinitializeQA}
            >
              <FileText size={16} />
              Reset Q&A Data
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Upload CSV files to add Q&A pairs to the knowledge base. Use the chat to ask CNC-related questions.
          </p>
        </aside>

        <section className="flex min-h-0 flex-col rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <MessageSquare size={48} className="mb-4 text-primary" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to CNC Technical AI</h3>
                <p className="mt-3 max-w-xl text-base leading-7">
                  Ask me anything about CNC machining, 3D printing, or technical questions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.type === "user"
                          ? "bg-primary text-white"
                          : "border border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-7">{message.content}</div>
                      <small className={`mt-2 block text-xs ${message.type === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="mt-4 flex justify-start">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    AI is typing...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="flex gap-3">
              <textarea
                ref={messageInputRef}
                className="min-h-[72px] flex-1 resize-none rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950/40 dark:text-white"
                placeholder="Type your CNC or technical question here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={2}
                disabled={isLoading}
              />
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <small className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </small>
          </div>
        </section>
      </div>
    </LayoutContainer>
  );
};

export default ChatInterface;

export type ChatInterfaceProps = {
  setShowConversations: Dispatch<SetStateAction<boolean>>;
  showConversations: boolean;
};

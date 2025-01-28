"use client";

import { useState } from "react";
import { sendChatMessage } from "@/utils/api";

const ChatPage = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (input.trim()) {
      // Add user message
      setMessages((prev) => [...prev, { sender: "User", text: input.trim() }]);
      setInput("");
      setIsTyping(true);

      try {
        // Send message to API and get response
        const { response } = await sendChatMessage(input.trim());

        // Add bot response
        setMessages((prev) => [...prev, { sender: "Bot", text: response }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "Bot",
            text: "Sorry, I encountered an error processing your message.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white text-center py-4">
        <h1 className="text-xl font-semibold">DandelionAI Chat</h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "User" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow ${
                message.sender === "User"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg shadow border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

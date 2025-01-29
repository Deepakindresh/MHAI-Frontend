"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  subscribeToMessages,
  supabase,
} from "@/utils/supabase";
import { sendChatMessage, fetchChatHistory } from "@/utils/api";

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Load existing messages
        const existingMessages = await fetchChatHistory();
        if (existingMessages) {
          setMessages(existingMessages);
        }

        // Subscribe to new messages
        const channel = await subscribeToMessages((newMessage) => {
          setMessages((prev) => [...prev, newMessage as Message]);
        });

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error initializing chat:", error);
        router.push("/login");
      }
    };

    initializeChat();
  }, [router]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setIsTyping(true);
      try {
        await sendChatMessage(input.trim());
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
        if ((error as Error).message === "Not authenticated") {
          router.push("/login");
        }
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white text-center py-4">
        <h1 className="text-xl font-semibold">DandelionAI Chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              !message.is_bot ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                !message.is_bot
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  // subscribeToMessages,
  // supabase,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // let channel: any = null;

    const initializeChat = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);

        // Load existing messages
        const existingMessages = await fetchChatHistory();
        setMessages(existingMessages || []);

        // Set up real-time subscription
        // channel = await subscribeToMessages((newMessage: Message) => {
        //   console.log("Received message:", newMessage);
        //   setMessages((prevMessages) => {
        //     // Check if message already exists
        //     if (prevMessages.some((msg) => msg.id === newMessage.id)) {
        //       return prevMessages;
        //     }
        //     return [...prevMessages, newMessage];
        //   });

        //   if (newMessage.is_bot) {
        //     setIsTyping(false);
        //   }
        // });
      } catch (error) {
        console.error("Error initializing chat:", error);
        router.push("/login");
      }
    };

    initializeChat();

    // return () => {
    //   if (channel) {
    //     supabase.removeChannel(channel);
    //   }
    // };
  }, [router]);

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: input.trim(),
      is_bot: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const bMessage = await sendChatMessage(tempMessage.content);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: bMessage.response,
        is_bot: true,
        created_at: new Date().toISOString(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      if ((error as Error).message === "Not authenticated") {
        router.push("/login");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white text-center py-4">
        <h1 className="text-xl font-semibold">DandelionAI Chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                !message.is_bot ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                  !message.is_bot
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !isTyping && handleSendMessage()
            }
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping}
            className={`px-4 py-2 ${
              isTyping ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

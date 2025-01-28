"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    // Check authentication
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      // Load existing messages
      const { data: existingMessages } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (existingMessages) {
        setMessages(existingMessages);
      }

      // Subscribe to new messages
      const channel = supabase
        .channel("chat_messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkAuth();
  }, [router]);

  const sendMessage = async () => {
    if (input.trim()) {
      setIsTyping(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/fastapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input.trim(),
            user_id: session.user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setInput("");
      } catch (error) {
        console.error("Error:", error);
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
        <div className="flex space-x-2 text-black">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
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

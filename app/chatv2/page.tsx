"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Edit2, Send, Check, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "bot" | "therapist";
  reply_to: string | null;
  created_at: string;
  updated_at: string;
}

export default function ChatPageV2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTherapist, setIsTherapist] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Check if user is therapist
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setIsTherapist(profile?.role === "therapist");

        // Load existing messages
        const { data: existingMessages } = await supabase
          .from("chat_messages_v2")
          .select("*")
          .order("created_at", { ascending: true });

        setMessages(existingMessages || []);

        // Set up realtime subscription
        channelRef.current = supabase
          .channel("chat_messages_v2")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "chat_messages_v2",
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setMessages((prev) => [...prev, payload.new as Message]);
              } else if (payload.eventType === "UPDATE") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === payload.new.id ? (payload.new as Message) : msg
                  )
                );
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error("Error initializing chat:", error);
        router.push("/login");
      }
    };

    initializeChat();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [router]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await supabase.from("chat_messages_v2").insert({
        content: input.trim(),
        user_id: session.user.id,
        role: "user",
      });

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      await supabase
        .from("chat_messages_v2")
        .update({
          content: editContent,
          role: "therapist",
        })
        .eq("id", messageId);

      setEditingMessage(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Therapy Chat</h1>
        <div className="flex space-x-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="text-sm hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs md:max-w-md lg:max-w-lg">
              {editingMessage === message.id ? (
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleEditMessage(message.id)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : message.role === "therapist"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <div className="flex justify-between items-center mt-1 text-xs opacity-75">
                    <span>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                    {isTherapist && message.role === "bot" && (
                      <button
                        onClick={() => startEditing(message)}
                        className="p-1 hover:bg-black/10 rounded"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t shadow-lg">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Send size={16} className="mr-1" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

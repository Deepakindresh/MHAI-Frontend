"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getCurrentUser,
  // subscribeToMessages,
  // supabase,
} from "@/utils/supabase";
import {
  sendChatV2Message,
  fetchUserChatHistory,
  editChatMessage,
} from "@/utils/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import EditTextModal from "@/components/EditTextModel";
import ThinkPopup from "@/components/ThinkPopup";
import { BrainCircuit, SquarePen } from "lucide-react";

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
  deepseekThink?: string | null;
}

const ChatPageV2 = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientIdState, setPatientIdState] = useState<string | null>(null);

  // Popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [popUpMessageId, setPopUpMessageId] = useState("");
  const [popUpMessage, setPopUpMessage] = useState("");

  // Think Popup
  const [thinkPopupOpen, setThinkPopupOpen] = useState(false);
  const [thinkPopupMessage, setThinkPopupMessage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchParams = useSearchParams();

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

        const patientId = searchParams.get("userId");
        setPatientIdState(patientId);

        // Load existing messages
        const existingMessages = await fetchUserChatHistory(patientId || "");
        console.log("Existing messages:", existingMessages);
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
      is_bot: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    try {
      sendChatV2Message(tempMessage.content, patientIdState || "");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      if ((error as Error).message === "Not authenticated") {
        router.push("/login");
      }
    }
  };

  const handleEditMessage = async (id: string, newText: string) => {
    try {
      await editChatMessage(id, newText);
      // Update message in UI
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === id) {
            return { ...msg, content: newText };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  return (
    <AuthWrapper showFooter={false} chatScreen={true}>
      <div className="flex flex-col h-screen bg-gray-50 pt-20 overflow-y-auto items-center">
        <div className="lg:w-[80%] w-full flex flex-col justify-between h-screen">
          <div className="flex-1  p-4 space-y-4">
            {popupOpen && popUpMessage && popUpMessageId && (
              <EditTextModal
                value={popUpMessage}
                messageId={popUpMessageId}
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onSubmit={handleEditMessage}
              />
            )}
            {thinkPopupOpen && thinkPopupMessage && (
              <ThinkPopup
                isOpen={thinkPopupOpen}
                onClose={() => setThinkPopupOpen(false)}
                messageContent={thinkPopupMessage}
              />
            )}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    transition={{
                      // Optional: customize the layout transition
                      layout: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    }}
                  >
                    <div
                      key={message.id}
                      className={`flex ${
                        !message.is_bot ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex flex-col  space-x-10 ${
                          !message.is_bot ? "items-end" : "items-start"
                        }`}
                      >
                        {message.is_bot && (
                          <div className="flex space-x-2 items-end w-full">
                            <Image
                              src="/dandelion.jpg"
                              alt="Dandelion Profile Picture"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div className="text-gray-700 font-bold hover:cursor-pointer w-full text-right mr-4 flex items-center space-x-4 justify-end">
                              {message.deepseekThink && (
                                <div
                                  className="flex items-center space-x-1 hover:cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => {
                                    setThinkPopupMessage(
                                      message.deepseekThink || ""
                                    );
                                    setThinkPopupOpen(true);
                                  }}
                                >
                                  <div>Think </div>
                                  <BrainCircuit size={20} />
                                </div>
                              )}
                              <div
                                className="flex items-center space-x-1 hover:cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => {
                                  setPopUpMessageId(message.id);
                                  setPopUpMessage(message.content);
                                  setPopupOpen(true);
                                }}
                              >
                                <div>Edit </div>
                                <SquarePen size={20} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-3xl  ${
                            !message.is_bot
                              ? "bg-linear-to-l from-violet-500 to-fuchsia-600 text-white rounded-br-xs"
                              : "bg-[#EDF3F7] text-black rounded-tl-xs ml-10"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                        {!message.is_bot && (
                          <Image
                            src="/batman.jpg"
                            alt="User Profile Picture"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {isTyping && (
              <div className="flex flex-col items-start space-x-4">
                <Image
                  src="/dandelion.jpg"
                  alt="Dandelion Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex justify-start animate-pulse ml-10">
                  <div className="bg-[#EDF3F7] p-3 rounded-3xl rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-50 border-t-3 sticky bottom-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  // !isTyping &&
                  handleSendMessage()
                }
                placeholder="Type your message..."
                // disabled={isTyping}
                className="flex-1 p-2  rounded-lg focus:outline-none  text-black"
              />
              <button
                onClick={handleSendMessage}
                // disabled={isTyping}
                className="px-4 py-2 bg-linear-to-l from-violet-500 to-fuchsia-600 hover:bg-linear-to-l hover:from-fuchsia-600 hover:to-violet-600
               text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 hover:cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ChatPageV2;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { User2, Clock, Search, MessageSquare } from "lucide-react";
import NotFound from "@/app/not-found";
import { AuthWrapper } from "@/components/AuthWrapper";
import { HomePageContainer } from "@/components/HomePageContainers";

interface ChatUser {
  id: string;
  full_name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  occupation?: string;
}

export default function RoomsPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTherapist, setIsTherapist] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Check if user is a therapist
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        setIsTherapist(profile?.role === "therapist");

        if (profile?.role !== "therapist") {
          setLoading(false);
          return;
        }

        // Get all unique users who have participated in chats
        const { data: chatMessages, error: chatError } = await supabase
          .from("chat_messages")
          .select(
            `
            user_id,
            content,
            created_at,
            is_bot
          `
          )
          .order("created_at", { ascending: false });

        if (chatError) throw chatError;

        // Get unique user IDs (excluding current user and bot messages)
        const uniqueUserIds = [
          ...new Set(
            chatMessages
              ?.filter((msg) => msg.user_id !== session.user.id && !msg.is_bot)
              .map((msg) => msg.user_id)
          ),
        ];

        console.log("Unique user IDs:", uniqueUserIds);

        // Get user profiles for these IDs
        const { data: profiles, error: profilesError } = await supabase
          .from("user_profiles")
          .select("id, full_name, occupation")
          .in("id", uniqueUserIds);

        console.log("User profiles:", profiles);

        if (profilesError) throw profilesError;

        // Process users with their last messages
        const processedUsers = profiles.map((profile) => {
          const userMessages = chatMessages?.filter(
            (msg) => msg.user_id === profile.id
          );
          const lastMessage = userMessages?.[0];

          return {
            id: profile.id,
            full_name: profile.full_name,
            occupation: profile.occupation,
            last_message: lastMessage?.content,
            last_message_time: lastMessage?.created_at,
            unread_count: userMessages?.filter(
              (msg) =>
                !msg.is_bot &&
                msg.user_id === profile.id &&
                new Date(msg.created_at) >
                  new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length,
          };
        });

        setUsers(processedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    checkAccess();

    // Set up real-time subscription only if user is a therapist
    let channel: any;
    if (isTherapist) {
      channel = supabase
        .channel("chat_messages_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          () => {
            checkAccess(); // Refresh the user list when new messages arrive
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router, isTherapist]);

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If not a therapist, show 404
  if (!isTherapist) {
    return <NotFound />;
  }

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <AuthWrapper>
      <div className="w-full bg-gray-50">
        <HomePageContainer>
          <div className="flex flex-col h-screen bg-gray-50 mt-30">
            <div className="p-4 bg-white shadow text-black">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare size={48} className="mb-2" />
                  <p>No patients found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => router.push(`/chatv2?userId=${user.id}`)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User2 className="text-blue-600" size={24} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.full_name}
                          </p>
                          {user.last_message_time && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {formatTime(user.last_message_time)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {user.last_message || "No messages yet"}
                          </p>
                          {user.unread_count && user.unread_count > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                              {user.unread_count}
                            </span>
                          )}
                        </div>
                        {user.occupation && (
                          <p className="text-xs text-gray-400 mt-1">
                            {user.occupation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </HomePageContainer>
      </div>
    </AuthWrapper>
  );
}

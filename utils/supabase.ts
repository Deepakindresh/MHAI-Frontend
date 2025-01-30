import { createClient } from "@supabase/supabase-js";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user;
}

let messageChannel: RealtimeChannel | null = null;

export async function subscribeToMessages(callback: (message: any) => void) {
  // Unsubscribe from existing channel if it exists
  if (messageChannel) {
    await supabase.removeChannel(messageChannel);
  }

  messageChannel = supabase.channel("message-channel").on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "chat_messages",
    },
    (payload) => {
      console.log("Received new message:", payload.new);
      callback(payload.new);
    }
  );

  const status = await messageChannel.subscribe();
  console.log("Subscription status:", status);

  return messageChannel;
}

export async function fetchChatHistory() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }

  return data;
}

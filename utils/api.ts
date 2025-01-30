import { supabase } from "./supabase";

export interface ChatMessage {
  message: string;
  user_id: string;
}

export async function sendChatMessage(message: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  try {
    // Log the request for debugging
    console.log("Sending message:", {
      message,
      user_id: session.user.id,
    });

    const response = await fetch("/api/fastapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(), // Ensure message is trimmed
        user_id: session.user.id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.error || "Failed to send message");
    }

    const data = await response.json();

    // Add message to Supabase immediately for real-time updates
    await supabase.from("chat_messages").insert([
      {
        content: message,
        user_id: session.user.id,
        is_bot: false,
      },
    ]);

    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function fetchChatHistory() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  try {
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }

    return messages || [];
  } catch (error) {
    console.error("Error in fetchChatHistory:", error);
    throw error;
  }
}

// Helper function to check if all required fields are present
export function validateMessagePayload(
  message: string,
  userId: string
): boolean {
  return Boolean(message && message.trim() && userId);
}

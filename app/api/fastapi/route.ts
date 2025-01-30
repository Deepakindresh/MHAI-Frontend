import { NextResponse } from "next/server";
import { ChatMessage } from "@/utils/api";

const API_URL = process.env.API_URL || "http://localhost:5000/chat";

export async function POST(request: Request) {
  try {
    const body: ChatMessage = await request.json();

    // Log the request body for debugging
    console.log("Request body:", body);

    // Validate required fields
    if (!body.message || !body.user_id) {
      return NextResponse.json(
        { error: "Message and user_id are required" },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: body.message,
        user_id: body.user_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);

      // Return more detailed error information
      return NextResponse.json(
        {
          error: "Failed to process request",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const cleanedResponse = data.response
      ? data.response.replace("<|end_of_text|>", "").trim()
      : "";
    return NextResponse.json({ response: cleanedResponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}

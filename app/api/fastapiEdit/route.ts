import { NextResponse } from "next/server";
import { ChatMessageEdit } from "@/utils/api";

const API_URL = process.env.API_V2_EDIT_URL || "http://localhost:5000/chatEdit";

export async function POST(request: Request) {
  try {
    const body: ChatMessageEdit = await request.json();

    // Log the request body for debugging
    // console.log("Request body:", body);

    // Validate required fields
    if (!body.message || !body.message_id) {
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
        message_id: body.message_id,
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

    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// app/api/fastapi/route.ts
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:5000/chat";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: body.message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const cleanedResponse = data.response.replace("<|end_of_text|>", "").trim();
    return NextResponse.json({ response: cleanedResponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

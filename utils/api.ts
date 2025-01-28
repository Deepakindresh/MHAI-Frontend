export async function sendChatMessage(message: string) {
  const response = await fetch("/api/fastapi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send message");
  }

  return response.json();
}

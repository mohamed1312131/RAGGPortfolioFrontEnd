// app/(chat)/api/vote/route.ts
// Local static version — no auth, no DB

import { ChatSDKError } from "@/lib/errors";

// GET /api/vote?chatId=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter 'chatId' is required."
    ).toResponse();
  }

  // Return mock votes for a given chat
  const votes = [
    { chatId, messageId: "msg-1", type: "up", createdAt: new Date().toISOString() },
    { chatId, messageId: "msg-2", type: "down", createdAt: new Date().toISOString() },
  ];

  return Response.json(votes, { status: 200 });
}

// PATCH /api/vote
export async function PATCH(request: Request) {
  try {
    const {
      chatId,
      messageId,
      type,
    }: { chatId: string; messageId: string; type: "up" | "down" } =
      await request.json();

    if (!chatId || !messageId || !type) {
      return new ChatSDKError(
        "bad_request:api",
        "Parameters chatId, messageId, and type are required."
      ).toResponse();
    }

    // Simulate success
    return Response.json(
      {
        chatId,
        messageId,
        type,
        status: "ok",
        message: `Message ${messageId} ${type === "up" ? "upvoted" : "downvoted"} successfully (demo mode).`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Vote error:", err);
    return new ChatSDKError("bad_request:chat").toResponse();
  }
}

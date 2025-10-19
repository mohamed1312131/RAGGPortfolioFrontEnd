// app/(chat)/api/history/route.ts
// Static local demo version (no auth, no DB)

import type { NextRequest } from "next/server";
import { ChatSDKError } from "@/lib/errors";

// GET /api/history?limit=10
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Number.parseInt(searchParams.get("limit") || "5", 10);

  // Return some fake static chat history
  const chats = Array.from({ length: limit }).map((_, i) => ({
    id: `local-chat-${i + 1}`,
    title: `Demo Conversation ${i + 1}`,
    lastMessage: "This is a mock message for local demo mode.",
    createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    visibility: "private",
  }));

  return Response.json(chats, { status: 200 });
}

// DELETE /api/history
export async function DELETE() {
  // In demo mode, just return a fake confirmation
  return Response.json(
    {
      message: "All chats cleared (demo mode).",
      cleared: true,
    },
    { status: 200 }
  );
}

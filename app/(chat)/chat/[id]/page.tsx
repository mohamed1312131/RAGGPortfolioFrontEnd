// app/(chat)/chat/[id]/page.tsx
// Static local demo version — chat page for individual conversations

import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Fake chat metadata
  const chat = {
    id,
    title: "Local Demo Chat",
    visibility: "private" as const,
    lastContext: {
      inputTokens: 50,
      outputTokens: 20,
      totalTokens: 70,
      modelId: DEFAULT_CHAT_MODEL,
    } as AppUsage, // ✅ match expected structure
  };

  if (!chat) {
    notFound();
  }

  // ✅ Strongly typed mock messages (no createdAt field — not part of UIMessage)
  const uiMessages: ChatMessage[] = [
    {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: "Hello, who are you?" }]
    },
    {
      id: "2",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "I'm your local AI assistant — running in demo mode with no authentication or database connection.",
        },
      ]
    },
  ];

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  return (
    <>
      <Chat
        autoResume={true}
        id={chat.id}
        initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialLastContext={chat.lastContext}
        initialMessages={uiMessages}
        initialVisibilityType={chat.visibility}
        isReadonly={false}
      />
      <DataStreamHandler />
    </>
  );
}

// app/(chat)/page.tsx
// Local demo version — no auth, no DB, no redirect

import { cookies } from "next/headers";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";

export default async function Page() {
  const id = generateUUID();

  // Fake usage context
  const lastContext: AppUsage = {
    inputTokens: 10,
    outputTokens: 5,
    totalTokens: 15,
    modelId: DEFAULT_CHAT_MODEL,
  };

  // Demo messages
  const initialMessages: ChatMessage[] = [
    {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: "Hi there!" }]
    },
    {
      id: "2",
      role: "assistant",
      parts: [
        { type: "text", text: "Welcome to your local AI chatbot demo 😎" },
      ]
    },
  ];

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  return (
    <>
      <Chat
        autoResume={false}
        id={id}
        initialChatModel={modelIdFromCookie?.value || DEFAULT_CHAT_MODEL}
        initialMessages={initialMessages}
        initialVisibilityType="private"
        isReadonly={false}
        initialLastContext={lastContext}
      />
      <DataStreamHandler />
    </>
  );
}

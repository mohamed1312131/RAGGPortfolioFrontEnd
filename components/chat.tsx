"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { ChatHeader } from "@/components/chat-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useArtifactSelector } from "@/hooks/use-artifact";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { ChatSDKError } from "@/lib/errors";
import type { Attachment, ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useDataStream } from "./data-stream-provider";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  autoResume,
  initialLastContext,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType?: string;
  isReadonly: boolean;
  autoResume: boolean;
  initialLastContext?: AppUsage;
}) {
  // Visibility removed; default to public
  const visibilityType = "public";

  const { mutate } = useSWRConfig();
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>("");
  const [usage, setUsage] = useState<AppUsage | undefined>(initialLastContext);
  const [limitReached, setLimitReached] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(currentModelId);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest(request) {
        // Build history for backend: [{ role, content }]
        const history = (request.messages || [])
          .map((m: any) => {
            const text = (m.parts || [])
              .filter((p: any) => p && p.type === "text" && typeof p.text === "string")
              .map((p: any) => p.text)
              .join("");
            if (!text) return null;
            return { role: m.role, content: text };
          })
          .filter(Boolean);

        return {
          body: {
            id: request.id,
            message: request.messages.at(-1),
            selectedChatModel: currentModelIdRef.current,
            // Send cumulative tokens so far based on UI usage shape
            totalTokensUsedSoFar: Number(usage?.totalTokens || 0),
            history,
            ...request.body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
      if (dataPart.type === "data-usage") {
        // Normalize backend payload to AppUsage shape used by the UI
        const total = Number(dataPart?.data?.totalTokens || 0);
        setUsage((prev) => ({ ...(prev || {}), totalTokens: total } as AppUsage));
      }
      const limitEvent = dataPart as any;
      if (limitEvent?.type === "limit-status") {
        const reached = Boolean(limitEvent?.data?.limitReached);
        setLimitReached(reached);
        if (reached) {
          setShowLimitAlert(true);
        }
      }
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({
          type: "error",
          description: error.message,
        });
      }
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <>
      <div className="overscroll-behavior-contain flex h-dvh min-w-0 touch-pan-y flex-col">
        <ChatHeader
          chatId={id}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isArtifactVisible={isArtifactVisible}
          isReadonly={isReadonly}
          messages={messages}
          regenerate={regenerate}
          selectedModelId={initialChatModel}
          setMessages={setMessages}
          status={status}
        />

        <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-4xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
          {!isReadonly && (
            <MultimodalInput
              attachments={attachments}
              chatId={id}
              input={input}
              messages={messages}
              onModelChange={setCurrentModelId}
              selectedModelId={currentModelId}
              sendMessage={sendMessage}
              setAttachments={setAttachments}
              setInput={setInput}
              setMessages={setMessages}
              status={status}
              stop={stop}
              usage={usage}
              disabled={limitReached}
            />
          )}
        </div>
      </div>



      <AlertDialog onOpenChange={setShowLimitAlert} open={showLimitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Token limit reached</AlertDialogTitle>
            <AlertDialogDescription>
              You have reached your token limit for this demo session. Please refresh to start a new conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowLimitAlert(false);
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

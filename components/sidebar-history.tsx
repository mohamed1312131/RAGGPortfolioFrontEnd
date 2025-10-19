"use client";

import { useParams } from "next/navigation";
import type { User } from "next-auth";
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
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
// Simple chat type since DB is removed
type SimpleChat = {
  id: string;
  title: string;
  createdAt: string;
};
// LoaderIcon import removed since we're not using it
import { ChatItem } from "./sidebar-history-item";

// Mock data for demo
const mockChats: SimpleChat[] = [
  {
    id: "1",
    title: "Welcome to your AI Assistant",
    createdAt: new Date().toISOString(),
  },
];

export function getChatHistoryPaginationKey() {
  // Simplified for demo - no pagination needed
  return null;
}

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();

  const handleDelete = (chatId: string) => {
    // Demo mode - just log the action
    console.log(`Delete chat: ${chatId}`);
  };

  // Demo mode - show simple message
  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Demo mode - no chat history saved
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className="flex flex-col gap-6">
            <div>
              <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                Demo Chats
              </div>
              {mockChats.map((chat) => (
                <ChatItem
                  chat={chat}
                  isActive={chat.id === id}
                  key={chat.id}
                  onDelete={handleDelete}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </div>
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

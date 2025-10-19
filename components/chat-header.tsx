"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { useTheme } from "next-themes";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";

import { Sun, Moon } from "lucide-react";

function PureChatHeader({
  chatId,

  isReadonly,
}: {
  chatId: string;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const { resolvedTheme, setTheme } = useTheme();

  // Hydration-safe flag
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background/80 backdrop-blur-md border-b border-border/50 px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      {/* Visibility selector removed */}

      {/* Hydration-safe theme toggle */}
      <button
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="
          order-3 ml-auto hidden md:flex
          h-8 w-8 items-center justify-center
          rounded-md border border-border/50
          bg-background/50 backdrop-blur-sm
          hover:bg-foreground/10
          transition-all duration-200
        "
        title="Toggle theme"
        type="button"
      >
        {mounted && (
          resolvedTheme === "dark" ? (
            <Sun size={16} className="text-foreground" />
          ) : (
            <Moon size={16} className="text-foreground" />
          )
        )}
      </button>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prev, next) => {
  return (
    prev.chatId === next.chatId  &&
    prev.isReadonly === next.isReadonly
  );
});
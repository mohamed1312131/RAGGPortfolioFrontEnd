"use client";

import type { ComponentProps } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppUsage } from "@/lib/usage";
import { cn } from "@/lib/utils";

export type ContextProps = ComponentProps<"button"> & {
  /** Optional full usage payload to enable breakdown view */
  usage?: AppUsage;
};

const _THOUSAND = 1000;
const _MILLION = 1_000_000;
const _BILLION = 1_000_000_000;
const PERCENT_MAX = 100;

// Lucide CircleIcon geometry
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_RADIUS = 10;
const ICON_STROKE_WIDTH = 2;

type ContextIconProps = {
  percent: number; // 0 - 100
};

export const ContextIcon = ({ percent }: ContextIconProps) => {
  const radius = ICON_RADIUS;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / PERCENT_MAX);

  return (
    <svg
      aria-label={`${percent.toFixed(2)}% of model context used`}
      height="28"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="28"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={radius}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={radius}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        transform={`rotate(-90 ${ICON_CENTER} ${ICON_CENTER})`}
      />
    </svg>
  );
};

function InfoRow({
  label,
  tokens,
  costText,
}: {
  label: string;
  tokens?: number;
  costText?: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 font-mono">
        <span className="min-w-[4ch] text-right">
          {tokens === undefined ? "—" : tokens.toLocaleString()}
        </span>
        {costText !== undefined &&
          costText !== null &&
          !Number.isNaN(Number.parseFloat(costText)) && (
            <span className="text-muted-foreground">
              ${Number.parseFloat(costText).toFixed(6)}
            </span>
          )}
      </div>
    </div>
  );
}

export const Context = ({ className, usage, ...props }: ContextProps) => {
  const used = usage?.totalTokens ?? 0;
  // Simple, non-dropdown badge showing only total token count
  return (
    <button
      className={cn(
        "inline-flex select-none items-center gap-1 rounded-md text-sm",
        "cursor-default bg-background text-foreground",
        className
      )}
      type="button"
      {...props}
    >
      <span className="font-medium text-muted-foreground">{used} tokens</span>
      <ContextIcon percent={0} />
    </button>
  );
};

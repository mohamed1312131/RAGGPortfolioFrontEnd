"use client";

import { cn } from "@/lib/utils";

interface Retro90sProps extends React.HTMLAttributes<HTMLDivElement> {
  angle?: number;
  cellSize?: number;
  gridOpacity?: number;
  lineColor?: string;
  glowColor?: string;
  intensity?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
  overlay?: boolean;
}

export function Retro90s({
  className,
  angle = 65,
  cellSize = 70,
  gridOpacity = 0.85,
  lineColor = "rgba(0, 255, 128, 0.8)",
  glowColor = "rgba(0, 255, 128, 0.6)",
  intensity = 1,
  blendMode = "normal",
  overlay = false,
  ...props
}: Retro90sProps) {
  const cssVars: React.CSSProperties = {
    zIndex: overlay ? 999 : 1,
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden [perspective:200px]",
        className
      )}
      style={cssVars}
      {...props}
    >
      {/* subtle dark base (only when not overlay) */}
      {!overlay && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.30), rgba(0,0,0,0.10) 60%, transparent)",
          }}
        />
      )}

      <div className="absolute inset-0" style={{ transform: `rotateX(${angle}deg)` }}>
        <div
          className="animate-retro-grid absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${lineColor} 1px, transparent 0),
              linear-gradient(to bottom, ${lineColor} 1px, transparent 0)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundRepeat: "repeat",
            height: "300vh",
            width: "600vw",
            marginLeft: "-200%",
            transformOrigin: "100% 0 0",
            mixBlendMode: blendMode,
            opacity: gridOpacity,
            filter: `drop-shadow(0 0 ${8 * intensity}px ${glowColor}) drop-shadow(0 0 ${16 * intensity}px ${glowColor})`,
          }}
        />
      </div>
      <div className="absolute inset-0 retro-scanlines" />
      <div className="absolute inset-0 crt-vignette" />
      <div className="absolute inset-0 crt-flicker" />
    </div>
  );
}

export type { Retro90sProps };

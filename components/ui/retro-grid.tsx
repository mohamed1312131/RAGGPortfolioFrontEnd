"use client";

import { cn } from "@/lib/utils";

interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lightLineColor?: string;
  darkLineColor?: string;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = "rgba(128, 128, 128, 0.3)",
  darkLineColor = "rgba(128, 128, 128, 0.3)",
  ...props
}: RetroGridProps) {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden [perspective:200px]",
        className
      )}
      style={{ ...gridStyles, opacity, zIndex: 0 }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className="animate-grid"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--light-line) 1px, transparent 0),
              linear-gradient(to bottom, var(--light-line) 1px, transparent 0)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundRepeat: "repeat",
            height: "300vh",
            width: "600vw",
            marginLeft: "-200%",
            transformOrigin: "100% 0 0",
            position: "absolute",
            inset: "0% 0px",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
}

export type { RetroGridProps };
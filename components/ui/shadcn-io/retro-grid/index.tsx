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
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden",
        className
      )}
      style={{ 
        perspective: "200px",
        zIndex: 0,
        opacity: opacity
      }}
      {...props}
    >
      {/* Perspective container */}
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        {/* Animated grid */}
        <div
          className="animate-grid absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${lightLineColor} 1px, transparent 0),
              linear-gradient(to bottom, ${lightLineColor} 1px, transparent 0)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundRepeat: "repeat",
            height: "300vh",
            width: "600vw",
            marginLeft: "-200%",
            transformOrigin: "100% 0 0",
          }}
        />
        
        {/* Dark mode grid overlay */}
        <div
          className="animate-grid absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${darkLineColor} 1px, transparent 0),
              linear-gradient(to bottom, ${darkLineColor} 1px, transparent 0)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundRepeat: "repeat",
            height: "300vh",
            width: "600vw",
            marginLeft: "-200%",
            transformOrigin: "100% 0 0",
          }}
        />
      </div>
      
      {/* Gradient fade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent to-90% dark:from-black dark:via-black/50" />
    </div>
  );
}

export type { RetroGridProps };
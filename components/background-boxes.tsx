"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMemo, useEffect, useState } from "react";

export function BackgroundBoxes() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const boxes = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        width: 40 + ((i * 23) % 70),
        height: 40 + ((i * 47) % 70),
        top: (i * 73) % 100,
        left: (i * 37) % 100,
        x: ((i * 11) % 100) - 50,
        y: ((i * 7) % 100) - 50,
        duration: 15 + (i % 15),
        delay: (i * 0.1) % 3,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {boxes.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-xl backdrop-blur-[2px]"
          style={{
            background: isDark 
              ? `linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))` 
              : `linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))`,
            border: isDark 
              ? "1px solid rgba(167, 139, 250, 0.25)" 
              : "1px solid rgba(96, 165, 250, 0.25)",
            width: `${b.width}px`,
            height: `${b.height}px`,
            top: `${b.top}%`,
            left: `${b.left}%`,
            boxShadow: isDark
              ? "0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.95, 1.05, 0.95],
            x: [0, b.x, 0],
            y: [0, b.y, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
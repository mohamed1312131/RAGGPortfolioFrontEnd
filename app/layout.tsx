import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Retro90s } from "@/components/ui/retro-90s";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chatbot (Local Demo)",
  description: "Offline Next.js chatbot template without authentication.",
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {/* Layer 1: Base background gradient (bottom) */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950" 
            style={{ zIndex: -2 }} 
          />
          
          {/* Layer 2: Glowing blobs */}
          <div 
            className="pointer-events-none fixed top-1/3 left-1/4 w-96 h-96 bg-blue-400/40 dark:bg-blue-600/40 rounded-full blur-[150px]" 
            style={{ zIndex: -1 }} 
          />
          <div 
            className="pointer-events-none fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/40 dark:bg-purple-600/40 rounded-full blur-[150px]" 
            style={{ zIndex: -1 }} 
          />

          <Retro90s 
            overlay
            angle={60}
            cellSize={64}
            gridOpacity={0.35}
            lineColor="rgba(0, 255, 128, 1)"
            glowColor="rgba(0, 255, 128, 1)"
            intensity={1.6}
            blendMode="normal"
          />

          {/* Layer 4: Content (top) */}
          <div className="relative" style={{ zIndex: 10 }}>
            <Toaster position="top-center" />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
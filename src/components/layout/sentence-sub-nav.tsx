"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SentenceSubNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isReading = pathname.startsWith("/sentence-reading");
  const isPractice = pathname.startsWith("/sentence") && !isReading;

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-muted/60 border border-border/80 backdrop-blur-md">
        {/* Route Tabs Container */}
        <div className="grid grid-cols-2 gap-1.5 flex-1 max-w-xl">
          {/* Sentence Practice Tab */}
          <button
            type="button"
            onClick={() => router.push("/sentence")}
            className={cn(
              "relative flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none",
              isPractice
                ? "bg-card text-foreground shadow-md shadow-purple-500/10 border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {isPractice && (
              <motion.div
                layoutId="sentence-tab-active"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-card border border-purple-500/30 -z-10"
              />
            )}
            <MessageSquare className={cn("h-4 w-4 shrink-0", isPractice ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <span className="leading-none font-black">Sentence Practice</span>
              <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">/sentence</span>
            </div>
          </button>

          {/* Sentence Reading AI Tab */}
          <button
            type="button"
            onClick={() => router.push("/sentence-reading")}
            className={cn(
              "relative flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all outline-none",
              isReading
                ? "bg-card text-foreground shadow-md shadow-purple-500/10 border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {isReading && (
              <motion.div
                layoutId="sentence-tab-active"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-card border border-purple-500/30 -z-10"
              />
            )}
            <Volume2 className={cn("h-4 w-4 shrink-0", isReading ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="leading-none font-black">Sentence Reading AI</span>
                <span className="rounded-full bg-purple-500/15 px-1.5 py-0.2 text-[9px] font-extrabold text-purple-600 dark:text-purple-400">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">/sentence-reading</span>
            </div>
          </button>
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-muted-foreground font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
          <span>{isPractice ? "Grammar & Translation Quizzes" : "AI Voice Reading & Pronunciation"}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SentenceSubNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isReading = pathname.startsWith("/sentence-reading");
  const isPractice = pathname.startsWith("/sentence") && !isReading;

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-[4px] bg-[#FAF7F2] dark:bg-[#161619] border-[2.5px] border-black dark:border-white shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
        {/* Route Tabs Container */}
        <div className="grid grid-cols-2 gap-1.5 flex-1 max-w-xl">
          {/* Sentence Practice Tab */}
          <button
            type="button"
            onClick={() => router.push("/sentence")}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-[2px] px-4 py-2 text-xs font-black uppercase transition-all outline-none cursor-pointer",
              isPractice
                ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col text-left">
              <span className="leading-none">Sentence Practice</span>
              <span className="text-[9px] font-bold text-neutral-600 dark:text-neutral-400 hidden md:inline lowercase">/sentence</span>
            </div>
          </button>

          {/* Sentence Reading AI Tab */}
          <button
            type="button"
            onClick={() => router.push("/sentence-reading")}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-[2px] px-4 py-2 text-xs font-black uppercase transition-all outline-none cursor-pointer",
              isReading
                ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <Volume2 className="h-4 w-4 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="leading-none">Sentence Reading AI</span>
                <span className="rounded-[2px] border border-black bg-[#FF6B00] px-1 py-0.2 text-[8px] font-black text-white">
                  AI
                </span>
              </div>
              <span className="text-[9px] font-bold text-neutral-600 dark:text-neutral-400 hidden md:inline lowercase">/sentence-reading</span>
            </div>
          </button>
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-foreground font-black uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-[#FF6B00] stroke-[3]" />
          <span>{isPractice ? "Grammar & Translation Quizzes" : "AI Voice Reading & Pronunciation"}</span>
        </div>
      </div>
    </div>
  );
}

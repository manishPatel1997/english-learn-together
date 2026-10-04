"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Sparkles, Star, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function VocabularySubNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isStudy = pathname === "/vocabulary/study";
  const isExam = pathname === "/vocabulary/exam";
  const isSelection = pathname === "/vocabulary" || (!isStudy && !isExam && !pathname.startsWith("/vocabulary/result"));
  const isResult = pathname.startsWith("/vocabulary/result");

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-[4px] bg-[#FAF7F2] dark:bg-[#161619] border-[2.5px] border-black dark:border-white shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
        {/* Route Tabs Container */}
        <div className="grid grid-cols-3 gap-1.5 flex-1 max-w-2xl">
          {/* Mode Selection Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary")}
            className={cn(
              "relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-[2px] px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs font-black uppercase transition-all outline-none cursor-pointer min-h-[44px]",
              isSelection
                ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col text-left min-w-0">
              <span className="leading-none truncate">
                <span className="hidden sm:inline">Mode </span>Select
              </span>
              <span className="text-[9px] font-bold text-neutral-600 dark:text-neutral-400 hidden md:inline lowercase">/vocabulary</span>
            </div>
          </button>

          {/* Read & Study Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary/study")}
            className={cn(
              "relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-[2px] px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs font-black uppercase transition-all outline-none cursor-pointer min-h-[44px]",
              isStudy
                ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col text-left min-w-0">
              <span className="leading-none truncate">
                <span className="hidden sm:inline">Read & </span>Study
              </span>
              <span className="text-[9px] font-bold text-neutral-600 dark:text-neutral-400 hidden md:inline lowercase">/vocabulary/study</span>
            </div>
          </button>

          {/* Take Exam Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary/exam")}
            className={cn(
              "relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-[2px] px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs font-black uppercase transition-all outline-none cursor-pointer min-h-[44px]",
              isExam || isResult
                ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
            )}
          >
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 stroke-[2.5]" />
            <div className="flex flex-col text-left min-w-0">
              <span className="leading-none truncate">
                <span className="hidden sm:inline">Take </span>Exam
              </span>
              <span className="text-[9px] font-bold text-neutral-600 dark:text-neutral-400 hidden md:inline lowercase">/vocabulary/exam</span>
            </div>
          </button>
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-foreground font-black uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-[#FF6B00] stroke-[3]" />
          <span>
            {isStudy
              ? "Audio & Spelling Review Mode"
              : isExam
              ? "Typing Quiz & XP Mode"
              : isResult
              ? "Exam Result Summary"
              : "Choose Learning Mode"}
          </span>
        </div>
      </div>
    </div>
  );
}

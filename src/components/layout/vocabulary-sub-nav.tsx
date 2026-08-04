"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-muted/60 border border-border/80 backdrop-blur-md">
        {/* Route Tabs Container */}
        <div className="grid grid-cols-3 gap-1.5 flex-1 max-w-2xl">
          {/* Mode Selection Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary")}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all outline-none",
              isSelection
                ? "bg-card text-foreground shadow-md shadow-indigo-500/10 border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {isSelection && (
              <motion.div
                layoutId="vocab-tab-active"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-card border border-indigo-500/30 -z-10"
              />
            )}
            <LayoutGrid className={cn("h-4 w-4 shrink-0", isSelection ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <span className="leading-none font-black">Mode Select</span>
              <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">/vocabulary</span>
            </div>
          </button>

          {/* Read & Study Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary/study")}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all outline-none",
              isStudy
                ? "bg-card text-foreground shadow-md shadow-indigo-500/10 border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {isStudy && (
              <motion.div
                layoutId="vocab-tab-active"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-card border border-indigo-500/30 -z-10"
              />
            )}
            <BookOpen className={cn("h-4 w-4 shrink-0", isStudy ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="leading-none font-black">Read & Study</span>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">/vocabulary/study</span>
            </div>
          </button>

          {/* Take Exam Tab */}
          <button
            type="button"
            onClick={() => router.push("/vocabulary/exam")}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all outline-none",
              isExam || isResult
                ? "bg-card text-foreground shadow-md shadow-indigo-500/10 border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            )}
          >
            {(isExam || isResult) && (
              <motion.div
                layoutId="vocab-tab-active"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-xl bg-card border border-purple-500/30 -z-10"
              />
            )}
            <Star className={cn("h-4 w-4 shrink-0", isExam || isResult ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground")} />
            <div className="flex flex-col text-left">
              <span className="leading-none font-black">Vocabulary Exam</span>
              <span className="text-[10px] font-medium text-muted-foreground hidden md:inline">/vocabulary/exam</span>
            </div>
          </button>
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-muted-foreground font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>
            {isStudy
              ? "Audio & Spelling Review Mode"
              : isExam
              ? "Typing Quiz & XP Mode"
              : isResult
              ? "Exam Result Summary"
              : "Choose Your Vocabulary Learning Mode"}
          </span>
        </div>
      </div>
    </div>
  );
}

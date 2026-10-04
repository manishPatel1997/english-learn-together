"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Flame, Zap, BarChart3 } from "lucide-react";
import { NumberAnimation } from "./number-animation";
import { cn } from "@/lib/utils";

export interface TodaysGoalCardProps {
  streak: number;
  xp: number;
  accuracy: number;
  todayCompleted: number;
  dailyGoal: number;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "compact" | "hero";
}

export function TodaysGoalCard({
  streak,
  xp,
  accuracy,
  todayCompleted,
  dailyGoal,
  onClick,
  className,
  variant = "default",
}: TodaysGoalCardProps) {
  const goalPercentage = Math.min(100, Math.round((todayCompleted / Math.max(1, dailyGoal)) * 100));

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ x: -1, y: -1 }}
        whileTap={{ x: 1, y: 1 }}
        onClick={onClick}
        className={cn(
          "p-2.5 rounded-[4px] bg-card border-2 border-black dark:border-white shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] flex flex-col items-center gap-2.5 text-center cursor-pointer select-none",
          className
        )}
        title="Today's Goal - Click to view progress"
      >
        <div className="flex flex-col items-center text-black dark:text-amber-400">
          <Flame className="h-5 w-5 fill-amber-500 text-black dark:text-white" />
          <span className="text-[11px] font-black mt-0.5" suppressHydrationWarning>
            {streak}d
          </span>
        </div>
        <div className="flex flex-col items-center text-black dark:text-yellow-400">
          <Zap className="h-5 w-5 fill-[#FFE600] text-black" />
          <span className="text-[11px] font-black mt-0.5" suppressHydrationWarning>
            {xp}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { x: -1, y: -1 } : undefined}
      whileTap={onClick ? { x: 2, y: 2 } : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-3.5 rounded-[4px] bg-card border-2 border-black dark:border-white shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] space-y-3 select-none",
        onClick && "cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-800/80 group",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-foreground flex items-center gap-1.5 uppercase tracking-wide">
          <Target className="h-4 w-4 text-[#FF6B00]" /> Today's Goal
        </span>
        <span className="border-2 border-black dark:border-white bg-[#FFE600] text-black px-1.5 py-0.2 text-[11px] font-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] rounded-[2px]" suppressHydrationWarning>
          {todayCompleted}/{dailyGoal}
        </span>
      </div>

      {/* Goal Progress Bar */}
      <div className="space-y-1">
        <div className="relative h-3 w-full overflow-hidden rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border-2 border-black dark:border-white p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-[#FFE600] dark:bg-[#FFE600] border-r-2 border-black dark:border-black"
          />
        </div>
        {variant === "hero" && (
          <div className="flex justify-between text-[11px] font-extrabold text-foreground pt-0.5">
            <span suppressHydrationWarning>{goalPercentage}% Reached</span>
            <span suppressHydrationWarning>
              {dailyGoal - todayCompleted > 0
                ? `${dailyGoal - todayCompleted} remaining`
                : "Goal Complete! 🎉"}
            </span>
          </div>
        )}
      </div>

      {/* 3 Counter Mini Cards */}
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-[3px] bg-white dark:bg-zinc-900 p-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]">
          <Flame className="h-3.5 w-3.5 mx-auto text-black dark:text-white fill-amber-500" />
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-tight mt-0.5">
            Streak
          </div>
          <NumberAnimation value={streak} className="text-xs text-foreground font-black" suffix="d" />
        </div>

        <div className="rounded-[3px] bg-white dark:bg-zinc-900 p-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]">
          <Zap className="h-3.5 w-3.5 mx-auto text-black fill-[#FFE600]" />
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-tight mt-0.5">
            XP
          </div>
          <NumberAnimation value={xp} className="text-xs text-foreground font-black" />
        </div>

        <div className="rounded-[3px] bg-white dark:bg-zinc-900 p-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]">
          <BarChart3 className="h-3.5 w-3.5 mx-auto text-black dark:text-white" />
          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-tight mt-0.5">
            Accuracy
          </div>
          <div className="text-xs font-black text-foreground" suppressHydrationWarning>
            {accuracy}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

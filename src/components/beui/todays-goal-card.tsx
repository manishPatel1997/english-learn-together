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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          "p-3 rounded-2xl bg-card border border-border flex flex-col items-center gap-3 text-center transition-shadow hover:shadow-md cursor-pointer select-none",
          className
        )}
        title="Today's Goal - Click to view progress"
      >
        <div className="flex flex-col items-center text-amber-500">
          <Flame className="h-5 w-5 fill-amber-500" />
          <span className="text-[10px] font-bold mt-0.5" suppressHydrationWarning>
            {streak}
          </span>
        </div>
        <div className="flex flex-col items-center text-indigo-500">
          <Zap className="h-5 w-5 fill-indigo-500" />
          <span className="text-[10px] font-bold mt-0.5" suppressHydrationWarning>
            {xp}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.015, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-4 rounded-[22px] bg-gradient-to-b from-muted/60 via-card to-muted/80 border border-border/80 space-y-3 transition-all duration-200 select-none shadow-sm",
        onClick && "cursor-pointer hover:border-indigo-500/40 hover:shadow-md group",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground flex items-center gap-1.5 group-hover:text-foreground transition-colors">
          <Target className="h-4 w-4 text-indigo-500 animate-pulse" /> Today's Goal
        </span>
        <span className="text-foreground font-bold text-xs" suppressHydrationWarning>
          {todayCompleted}/{dailyGoal}
        </span>
      </div>

      {/* Goal Progress Bar */}
      <div className="space-y-1">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-border/80 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 shadow-sm"
          />
        </div>
        {variant === "hero" && (
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground pt-0.5">
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
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="rounded-xl bg-card/90 p-2 border border-border/70 shadow-2xs transition-transform group-hover:scale-[1.02]">
          <Flame className="h-4 w-4 mx-auto text-amber-500 fill-amber-500" />
          <div className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-tight">
            Streak
          </div>
          <NumberAnimation value={streak} className="text-xs text-foreground font-extrabold" suffix="d" />
        </div>

        <div className="rounded-xl bg-card/90 p-2 border border-border/70 shadow-2xs transition-transform group-hover:scale-[1.02]">
          <Zap className="h-4 w-4 mx-auto text-indigo-500 fill-indigo-500" />
          <div className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-tight">
            XP
          </div>
          <NumberAnimation value={xp} className="text-xs text-foreground font-extrabold" />
        </div>

        <div className="rounded-xl bg-card/90 p-2 border border-border/70 shadow-2xs transition-transform group-hover:scale-[1.02]">
          <BarChart3 className="h-4 w-4 mx-auto text-emerald-500" />
          <div className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-tight">
            Accuracy
          </div>
          <div className="text-xs font-extrabold text-foreground" suppressHydrationWarning>
            {accuracy}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

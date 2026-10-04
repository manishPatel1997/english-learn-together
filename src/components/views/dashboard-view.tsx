"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  Target,
  BarChart3,
  BookOpen,
  MessageSquare,
  Shuffle,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Star,
} from "lucide-react";
import { TiltCard } from "@/components/beui/tilt-card";
import { NumberAnimation } from "@/components/beui/number-animation";
import { StatefulButton } from "@/components/beui/stateful-button";
import { type NavItem } from "@/components/beui/bounce-sidebar";
import { type UserStats } from "@/lib/storage";
import { apiClient } from "@/lib/api-client";
import { MotionSpinner } from "@/components/beui/loader";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  stats: UserStats;
  onNavigate: (nav: NavItem) => void;
  onStartPractice: (type: "vocabulary" | "sentence" | "mixed") => void;
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function getTimeGreeting(): { greeting: string; icon: string; subtitle: string } {
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      greeting: "Good Morning",
      icon: "🌅",
      subtitle: "Start your day with a quick 5-minute Gujarati translation sprint!",
    };
  }
  if (hour < 17) {
    return {
      greeting: "Good Afternoon",
      icon: "☀️",
      subtitle: "Keep your daily learning momentum going and level up your XP!",
    };
  }
  return {
    greeting: "Good Evening",
    icon: "🌙",
    subtitle: "Wrap up today's goal with a relaxing vocabulary review!",
  };
}

export function DashboardView({ stats, onNavigate, onStartPractice }: DashboardViewProps) {
  const goalPercentage = Math.min(100, Math.round((stats.todayCompleted / Math.max(1, stats.dailyGoal)) * 100));
  const timeInfo = getTimeGreeting();

  const [activities, setActivities] = React.useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = React.useState(false);

  // Calculate Level & Next Level XP
  const level = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;
  const xpToNextLevel = 100 - currentLevelXp;

  // Days of week for streak tracker
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  React.useEffect(() => {
    let isMounted = true;
    async function loadRecentActivity() {
      try {
        setLoadingActivities(true);
        const res = await apiClient.user.getProgress();
        if (res.success && res.history && isMounted) {
          setActivities(res.history.slice(0, 5));
        }
      } catch (err) {
        console.warn("Could not load backend activity history:", err);
      } finally {
        if (isMounted) setLoadingActivities(false);
      }
    }
    loadRecentActivity();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-7 pb-12 select-none">
      {/* 🌟 1. Bold Neo-Brutalist Hero Banner */}
      <div className="relative overflow-hidden rounded-[6px] border-[3px] border-black dark:border-white bg-[#18181B] text-white p-4 sm:p-9 shadow-[4px_4px_0px_#121212] sm:shadow-[7px_7px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] sm:dark:shadow-[7px_7px_0px_#ffffff]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-[2px] border-2 border-black bg-[#FFE600] px-3 py-1 text-xs font-black text-black shadow-[2.5px_2.5px_0px_#000000] uppercase tracking-wide">
              <span>{timeInfo.icon}</span>
              <span>{timeInfo.greeting}</span>
              <span>•</span>
              <span>નમસ્તે • Kem Cho!</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
                Master Gujarati to English with{" "}
                <span className="bg-[#FFE600] text-black px-2 py-0.5 inline-block border-2 border-black shadow-[3px_3px_0px_#000000]">
                  Confidence
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-bold max-w-xl">
                {timeInfo.subtitle}
              </p>
            </div>

            {/* Quick Level & XP Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-[3px] border-2 border-black bg-white px-3 py-1.5 text-black shadow-[2.5px_2.5px_0px_#000000]">
                <Award className="h-4 w-4 text-[#FF6B00] stroke-[2.5]" />
                <span className="text-xs font-black uppercase">Level {level} Explorer</span>
                <span className="text-[10px] font-black bg-[#FAF7F2] border border-black px-1.5 py-0.2 rounded-[2px]">
                  {xpToNextLevel} XP to Lvl {level + 1}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FF6B00] px-3 py-1.5 text-white shadow-[2.5px_2.5px_0px_#000000]">
                <Flame className="h-4 w-4 fill-white stroke-[2.5]" />
                <span className="text-xs font-black uppercase">{stats.streak} Day Streak 🔥</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <StatefulButton
                variant="success"
                size="lg"
                onClick={() => onStartPractice("vocabulary")}
                className="bg-[#22C55E] text-black font-black uppercase border-[2.5px] border-black shadow-[4px_4px_0px_#000000] text-xs sm:text-sm hover:bg-[#16A34A]"
              >
                <Sparkles className="h-4 w-4 mr-1.5 stroke-[2.5]" />
                <span>Start Practice Now</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5 stroke-[3]" />
              </StatefulButton>

              <button
                type="button"
                onClick={() => onNavigate("progress")}
                className="inline-flex h-13 items-center gap-2 rounded-[4px] border-[2.5px] border-black bg-white hover:bg-neutral-100 text-black px-5 sm:px-6 text-xs sm:text-sm font-black uppercase shadow-[4px_4px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000000] transition-all cursor-pointer"
              >
                <span>Analytics & Insights</span>
                <BarChart3 className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Right Column: Goal Card */}
          <div className="lg:col-span-5 bg-white text-black rounded-[4px] p-5 sm:p-6 border-2 border-black shadow-[5px_5px_0px_#000000] space-y-4">
            {/* Top Target Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-[2px] bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
                  <Target className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase text-black">Daily Goal</h4>
                  <span className="text-[11px] text-neutral-600 font-bold" suppressHydrationWarning>
                    {stats.todayCompleted} of {stats.dailyGoal} questions completed
                  </span>
                </div>
              </div>
              <span className="rounded-[2px] border-2 border-black bg-[#FFE600] px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_#000000]">
                {goalPercentage}%
              </span>
            </div>

            {/* Neo Progress Track */}
            <div className="space-y-1.5">
              <div className="h-4 w-full overflow-hidden rounded-[2px] bg-[#FAF7F2] border-2 border-black p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-[#FFE600] border-r-2 border-black"
                />
              </div>
              <div className="flex justify-between text-[11px] font-black text-black">
                <span suppressHydrationWarning>{goalPercentage}% Completed</span>
                <span suppressHydrationWarning>
                  {stats.dailyGoal - stats.todayCompleted > 0
                    ? `${stats.dailyGoal - stats.todayCompleted} Qs left today`
                    : "Goal Complete! 🎉"}
                </span>
              </div>
            </div>

            {/* 7-Day Weekly Streak Dots */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-black mb-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 stroke-[2.5]" /> 7-Day Momentum
                </span>
                <span>Active Week</span>
              </div>
              <div className="grid grid-cols-7 gap-1 xs:gap-1.5">
                {daysOfWeek.map((day, idx) => {
                  const isCompleted = idx <= currentDayIndex;
                  const isToday = idx === currentDayIndex;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col items-center py-1 xs:py-1.5 px-0.5 rounded-[2px] border border-black sm:border-2 text-[9px] xs:text-[10px] font-black shadow-[1px_1px_0px_#000000] sm:shadow-[1.5px_1.5px_0px_#000000]",
                        isToday
                          ? "bg-[#FFE600] text-black"
                          : isCompleted
                          ? "bg-[#22C55E] text-black"
                          : "bg-neutral-100 text-neutral-400"
                      )}
                    >
                      <span className="text-[8px] xs:text-[9px] uppercase">{day}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-2.5 w-2.5 xs:h-3 xs:w-3 mt-1 stroke-[3]" />
                      ) : (
                        <div className="h-1.5 w-1.5 xs:h-2 xs:w-2 rounded-full bg-neutral-300 mt-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Micro Stats */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="rounded-[2px] bg-[#FAF7F2] p-2 border-2 border-black shadow-[2px_2px_0px_#000000]">
                <Flame className="h-4 w-4 mx-auto text-black fill-amber-500 mb-0.5" />
                <span className="text-[9px] text-neutral-600 uppercase font-black block">Streak</span>
                <NumberAnimation value={stats.streak} className="text-sm font-black text-black" suffix="d" />
              </div>

              <div className="rounded-[2px] bg-[#FAF7F2] p-2 border-2 border-black shadow-[2px_2px_0px_#000000]">
                <Zap className="h-4 w-4 mx-auto text-black fill-[#FFE600] mb-0.5" />
                <span className="text-[9px] text-neutral-600 uppercase font-black block">Total XP</span>
                <NumberAnimation value={stats.xp} className="text-sm font-black text-black" />
              </div>

              <div className="rounded-[2px] bg-[#FAF7F2] p-2 border-2 border-black shadow-[2px_2px_0px_#000000]">
                <TrendingUp className="h-4 w-4 mx-auto text-black stroke-[2.5] mb-0.5" />
                <span className="text-[9px] text-neutral-600 uppercase font-black block">Accuracy</span>
                <span className="text-sm font-black text-black" suppressHydrationWarning>{stats.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 2. Practice Selection Launcher Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 stroke-[2.5]" /> Practice Modules
          </h3>
          <p className="text-xs sm:text-sm font-bold text-muted-foreground">Select a mode to accelerate your Gujarati & English fluency</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Vocabulary */}
          <TiltCard
            onClick={() => onStartPractice("vocabulary")}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 p-5 sm:p-6 border-[2.5px] border-black dark:border-white shadow-[3px_3px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] rounded-[6px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#22C55E] text-black shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
                <BookOpen className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="rounded-[2px] border-2 border-black bg-[#22C55E] px-2 py-0.5 text-xs font-black text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] uppercase">
                25 Words
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 uppercase tracking-tight">
              Vocabulary Practice
            </h4>
            <p className="text-xs text-muted-foreground font-semibold mb-5 leading-relaxed">
              Master Gujarati word spellings, phonetics, and English meanings with instant feedback.
            </p>

            <div className="flex items-center justify-between text-xs font-black text-foreground pt-3 border-t-2 border-black dark:border-white uppercase">
              <span>Start Vocabulary</span>
              <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 2: Sentence */}
          <TiltCard
            onClick={() => onStartPractice("sentence")}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 p-5 sm:p-6 border-[2.5px] border-black dark:border-white shadow-[3px_3px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] rounded-[6px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#FF6B00] text-white shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
                <MessageSquare className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="rounded-[2px] border-2 border-black bg-[#FF6B00] px-2 py-0.5 text-xs font-black text-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] uppercase">
                10 Topics
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 uppercase tracking-tight">
              Sentence Practice
            </h4>
            <p className="text-xs text-muted-foreground font-semibold mb-5 leading-relaxed">
              Practice full Gujarati to English translations across topics like Whose, Which, Can, Could, Will, etc.
            </p>

            <div className="flex items-center justify-between text-xs font-black text-foreground pt-3 border-t-2 border-black dark:border-white uppercase">
              <span>Choose Topics</span>
              <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 3: Mixed Practice */}
          <TiltCard
            onClick={() => onStartPractice("mixed")}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 p-5 sm:p-6 border-[2.5px] border-black dark:border-white shadow-[3px_3px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] rounded-[6px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#FFE600] text-black shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
                <Shuffle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="rounded-[2px] border-2 border-black bg-[#FFE600] px-2 py-0.5 text-xs font-black text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] uppercase">
                Adaptive Quiz
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 uppercase tracking-tight">
              Mixed Challenge
            </h4>
            <p className="text-xs text-muted-foreground font-semibold mb-5 leading-relaxed">
              Challenge yourself with a randomized sequence of vocabulary spellings and grammar sentences.
            </p>

            <div className="flex items-center justify-between text-xs font-black text-foreground pt-3 border-t-2 border-black dark:border-white uppercase">
              <span>Start Quiz</span>
              <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 4: Sentence Reading AI */}
          <TiltCard
            onClick={() => onNavigate("sentence-reading" as any)}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 p-5 sm:p-6 border-[2.5px] border-black dark:border-white shadow-[3px_3px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] rounded-[6px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#FF4D4D] text-white shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
                <Volume2 className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="rounded-[2px] border-2 border-black bg-[#FF4D4D] px-2 py-0.5 text-xs font-black text-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] uppercase">
                AI Speech
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 uppercase tracking-tight">
              Sentence Reading AI
            </h4>
            <p className="text-xs text-muted-foreground font-semibold mb-5 leading-relaxed">
              Listen to native reading, inspect word-by-word phonetics, and practice speaking into mic.
            </p>

            <div className="flex items-center justify-between text-xs font-black text-foreground pt-3 border-t-2 border-black dark:border-white uppercase">
              <span>Open AI Reader</span>
              <ArrowRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>
        </div>
      </div>

      {/* 📊 3. Bento Grid: Overview Statistics & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 stroke-[2.5]" /> Learning Analytics
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="text-xs font-black uppercase text-foreground hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Detailed Reports <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2.5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
                <span>Words Learned</span>
                <div className="p-1.5 rounded-[2px] border-2 border-black bg-[#22C55E] text-black shadow-[1.5px_1.5px_0px_#121212]">
                  <BookOpen className="h-4 w-4 stroke-[2.5]" />
                </div>
              </div>
              <NumberAnimation value={stats.vocabularyLearned} className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" suffix=" Words" />
              <div className="flex items-center justify-between pt-1 border-t-2 border-black/10 dark:border-white/10">
                <span className="text-xs text-[#22C55E] dark:text-[#4ADE80] flex items-center gap-1 font-black uppercase">
                  <TrendingUp className="h-3.5 w-3.5 stroke-[3]" /> Mastered
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">Section 1 Active</span>
              </div>
            </div>

            <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2.5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
                <span>Sentence Practice</span>
                <div className="p-1.5 rounded-[2px] border-2 border-black bg-[#FF6B00] text-white shadow-[1.5px_1.5px_0px_#121212]">
                  <MessageSquare className="h-4 w-4 stroke-[2.5]" />
                </div>
              </div>
              <NumberAnimation value={stats.sentencesPracticed} className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" suffix=" Sentences" />
              <div className="flex items-center justify-between pt-1 border-t-2 border-black/10 dark:border-white/10">
                <span className="text-xs text-[#FF6B00] flex items-center gap-1 font-black uppercase">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" /> High Retention
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">10 Topics</span>
              </div>
            </div>

            <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2.5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
                <span>Recommended Focus</span>
                <div className="p-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] text-black shadow-[1.5px_1.5px_0px_#121212]">
                  <Star className="h-4 w-4 stroke-[2.5]" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-foreground block tracking-tight">Had & Would</span>
              <div className="flex items-center justify-between pt-1 border-t-2 border-black/10 dark:border-white/10">
                <span className="text-xs text-[#FF6B00] font-black uppercase">
                  Needs practice
                </span>
                <button
                  onClick={() => onStartPractice("sentence")}
                  className="text-xs font-black uppercase text-foreground hover:underline cursor-pointer"
                >
                  Practice Now →
                </button>
              </div>
            </div>

            <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2.5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
                <span>Overall Accuracy</span>
                <div className="p-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] text-black shadow-[1.5px_1.5px_0px_#121212]">
                  <TrendingUp className="h-4 w-4 stroke-[2.5]" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" suppressHydrationWarning>
                {stats.accuracy}%
              </span>
              <div className="flex items-center justify-between pt-1 border-t-2 border-black/10 dark:border-white/10">
                <span className="text-xs text-[#22C55E] dark:text-[#4ADE80] font-black uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" /> Top Performer
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">Ranked #{Math.max(1, 10 - Math.floor(stats.streak / 2))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 stroke-[2.5]" /> Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="text-xs font-black uppercase text-foreground hover:underline cursor-pointer"
            >
              Full History
            </button>
          </div>

          <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-3.5 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
            {loadingActivities ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2.5">
                <MotionSpinner size="md" />
                <span className="text-xs font-black uppercase text-muted-foreground">Syncing recent progress...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="rounded-[3px] border-2 border-black bg-[#FFE600] p-3 text-black shadow-[2.5px_2.5px_0px_#121212]">
                  <Sparkles className="h-6 w-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground uppercase">Ready for Your First Challenge?</p>
                  <p className="text-xs font-bold text-muted-foreground max-w-xs leading-relaxed mt-1">
                    Complete your first vocabulary or sentence quiz to see your live progress feed here!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartPractice("vocabulary")}
                  className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FFE600] text-black font-black uppercase text-xs px-4 py-2 shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer"
                >
                  Start First Quiz <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              activities.map((act, index) => {
                const secName = act.sectionId ? act.sectionId.toUpperCase() : "EXAM";
                const typeLabel = act.examType === "sentence" ? "Sentence Module" : "Vocabulary Section";
                return (
                  <div
                    key={act.id || index}
                    className="flex items-start gap-3 border-b-2 border-black/10 dark:border-white/10 last:border-0 pb-3 last:pb-0"
                  >
                    <div
                      className={cn(
                        "rounded-[2px] p-2 mt-0.5 shrink-0 border-2 border-black shadow-[1.5px_1.5px_0px_#121212]",
                        act.passed
                          ? "bg-[#22C55E] text-black"
                          : "bg-[#FF6B00] text-white"
                      )}
                    >
                      {act.examType === "sentence" ? (
                        <MessageSquare className="h-4 w-4 stroke-[2.5]" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-foreground truncate block">
                          Completed {secName} {typeLabel}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground flex items-center gap-1 shrink-0 uppercase">
                          <Clock className="h-3 w-3 stroke-[2.5]" /> {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-bold text-muted-foreground">
                          Accuracy: <strong className="text-foreground">{act.scorePercentage}%</strong> ({act.correctAnswers}/{act.totalQuestions})
                        </span>
                        <span className="text-[10px] font-black text-black bg-[#FFE600] border border-black px-1.5 py-0.2 rounded-[2px] shadow-[1px_1px_0px_#121212]">
                          +{act.correctAnswers * 10} XP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

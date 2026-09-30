"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RotateCcw,
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
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 🌟 1. Ultra-Modern Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl sm:rounded-[32px] bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-10 text-white shadow-2xl shadow-indigo-900/30 border border-white/15"
      >
        {/* Dynamic Multi-layered Background Glow & Mesh */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-indigo-500/30 to-cyan-500/20 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black/20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Pill Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-xl border border-white/20 shadow-inner">
              <span className="text-base">{timeInfo.icon}</span>
              <span className="text-amber-300 font-bold">{timeInfo.greeting}</span>
              <span className="text-white/40">•</span>
              <span className="text-indigo-100/90 font-medium">નમસ્તે • Kem Cho!</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                Master Gujarati to English with{" "}
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  AI Confidence
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed max-w-xl font-medium">
                {timeInfo.subtitle}
              </p>
            </div>

            {/* Quick Level & XP Badge */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/15">
                <Award className="h-4 w-4 text-amber-300" />
                <span className="text-xs font-bold text-white">Level {level} Explorer</span>
                <span className="text-[10px] text-indigo-200 bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                  {xpToNextLevel} XP to Level {level + 1}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/20 px-3.5 py-2 backdrop-blur-md border border-emerald-400/30 text-emerald-200">
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-bounce" />
                <span className="text-xs font-extrabold">{stats.streak} Day Streak 🔥</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <StatefulButton
                  variant="success"
                  size="lg"
                  onClick={() => onStartPractice("vocabulary")}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold shadow-xl shadow-emerald-500/30 border-0 text-xs sm:text-sm px-5 sm:px-7 py-3 rounded-2xl"
                >
                  <Sparkles className="h-4 w-4 mr-1.5 text-amber-200" />
                  <span>Start Practice Now</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1.5" />
                </StatefulButton>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => onNavigate("progress")}
                className="inline-flex h-12 sm:h-13 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-5 sm:px-6 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all shadow-lg shadow-black/10"
              >
                <span>Analytics & Insights</span>
                <BarChart3 className="h-4 w-4 text-indigo-200" />
              </motion.button>
            </div>
          </div>

          {/* Right Hero Column: Interactive Goal Card with Radial Gauge */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl space-y-5">
            {/* Top Target Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">Daily Learning Goal</h4>
                  <span className="text-[11px] text-indigo-200 font-medium" suppressHydrationWarning>
                    {stats.todayCompleted} of {stats.dailyGoal} questions completed
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 text-[11px] font-black text-amber-300">
                {goalPercentage}%
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div className="space-y-2">
              <div className="h-3.5 w-full overflow-hidden rounded-full bg-black/30 p-0.5 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalPercentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 shadow-lg shadow-amber-400/30"
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-indigo-200">
                <span suppressHydrationWarning>{goalPercentage}% Achieved</span>
                <span suppressHydrationWarning>
                  {stats.dailyGoal - stats.todayCompleted > 0
                    ? `${stats.dailyGoal - stats.todayCompleted} Qs left today`
                    : "Daily Goal Crushed! 🎉"}
                </span>
              </div>
            </div>

            {/* 7-Day Weekly Streak Dots */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-200 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-amber-300" /> 7-Day Momentum
                </span>
                <span>Active Week</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {daysOfWeek.map((day, idx) => {
                  const isCompleted = idx <= currentDayIndex;
                  const isToday = idx === currentDayIndex;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col items-center py-2 rounded-xl border text-[10px] font-extrabold transition-all",
                        isToday
                          ? "bg-amber-400 text-slate-900 border-amber-300 ring-2 ring-amber-300/40 shadow-md font-black"
                          : isCompleted
                          ? "bg-white/15 text-emerald-300 border-emerald-400/30"
                          : "bg-black/20 text-white/40 border-white/5"
                      )}
                    >
                      <span className="text-[9px] uppercase tracking-wider">{day}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-3 w-3 mt-1 text-emerald-300" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-white/20 mt-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="rounded-2xl bg-black/30 p-2.5 border border-white/10">
                <Flame className="h-4 w-4 mx-auto text-amber-400 fill-amber-400 mb-1" />
                <span className="text-[9px] text-indigo-200 uppercase font-bold block">Streak</span>
                <NumberAnimation value={stats.streak} className="text-base font-black text-white" suffix="d" />
              </div>

              <div className="rounded-2xl bg-black/30 p-2.5 border border-white/10">
                <Zap className="h-4 w-4 mx-auto text-indigo-300 fill-indigo-300 mb-1" />
                <span className="text-[9px] text-indigo-200 uppercase font-bold block">Total XP</span>
                <NumberAnimation value={stats.xp} className="text-base font-black text-white" />
              </div>

              <div className="rounded-2xl bg-black/30 p-2.5 border border-white/10">
                <TrendingUp className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-[9px] text-indigo-200 uppercase font-bold block">Accuracy</span>
                <span className="text-base font-black text-white" suppressHydrationWarning>{stats.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🚀 2. Practice Selection Launcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" /> Practice Modules
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Select a mode to accelerate your Gujarati & English fluency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Vocabulary */}
          <TiltCard
            onClick={() => onStartPractice("vocabulary")}
            className="group relative overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all bg-card p-5 sm:p-6 rounded-3xl border border-border"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-emerald-500/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                25 Words
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Vocabulary Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Master Gujarati word spellings, phonetics, and English meanings with instant feedback.
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-border">
              <span>Start Vocabulary</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 2: Sentence */}
          <TiltCard
            onClick={() => onStartPractice("sentence")}
            className="group relative overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all bg-card p-5 sm:p-6 rounded-3xl border border-border"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-indigo-500/20">
                <MessageSquare className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                10 Topics
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Sentence Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Practice full Gujarati to English translations across topics like Whose, Which, Can, Could, Will, etc.
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-border">
              <span>Choose Topics</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 3: Mixed Practice */}
          <TiltCard
            onClick={() => onStartPractice("mixed")}
            className="group relative overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all bg-card p-5 sm:p-6 rounded-3xl border border-border"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-amber-500/20">
                <Shuffle className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Adaptive Quiz
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Mixed Challenge
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Challenge yourself with a randomized sequence of vocabulary spellings and grammar sentences.
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 pt-3 border-t border-border">
              <span>Start Quiz</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 4: Sentence Reading AI */}
          <TiltCard
            onClick={() => onNavigate("sentence-reading" as any)}
            className="group relative overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all bg-card p-5 sm:p-6 rounded-3xl border border-border"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-purple-500/20">
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                AI Speech
              </span>
            </div>

            <h4 className="text-lg font-black text-foreground mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Sentence Reading AI
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Listen to native reading, inspect word-by-word phonetics, and practice speaking into mic.
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 pt-3 border-t border-border">
              <span>Open AI Reader</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </TiltCard>
        </div>
      </div>

      {/* 📊 3. Bento Grid: Overview Statistics & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" /> Learning Analytics
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Detailed Reports <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-5 space-y-2.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>Vocabulary Words Learned</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <NumberAnimation value={stats.vocabularyLearned} className="text-2xl sm:text-3xl font-black text-foreground block" suffix=" Words" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <TrendingUp className="h-3.5 w-3.5" /> Mastered 100%
                </span>
                <span className="text-[11px] text-muted-foreground">Section 1 Active</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-5 space-y-2.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>Sentence Practice</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
              <NumberAnimation value={stats.sentencesPracticed} className="text-2xl sm:text-3xl font-black text-foreground block" suffix=" Sentences" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> High Retention
                </span>
                <span className="text-[11px] text-muted-foreground">10 Grammar Topics</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-5 space-y-2.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>Recommended Focus</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black text-foreground block">Had & Would</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  Needs practice
                </span>
                <button
                  onClick={() => onStartPractice("sentence")}
                  className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Practice Now →
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-5 space-y-2.5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                <span>Overall Accuracy</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-foreground block" suppressHydrationWarning>
                {stats.accuracy}%
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Top Performer
                </span>
                <span className="text-[11px] text-muted-foreground">Ranked #{Math.max(1, 10 - Math.floor(stats.streak / 2))}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity Timeline Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full History
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 space-y-3.5 shadow-sm">
            {loadingActivities ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2.5">
                <MotionSpinner size="md" />
                <span className="text-xs font-bold text-muted-foreground">Syncing recent progress...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="rounded-2xl bg-indigo-500/10 p-3.5 text-indigo-500">
                  <Sparkles className="h-6 w-6 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground">Ready for Your First Challenge?</p>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mt-1">
                    Complete your first vocabulary or sentence quiz to see your live progress feed here!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartPractice("vocabulary")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 shadow-md shadow-indigo-500/20"
                >
                  Start First Quiz <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              activities.map((act, index) => {
                const secName = act.sectionId ? act.sectionId.toUpperCase() : "EXAM";
                const typeLabel = act.examType === "sentence" ? "Sentence Module" : "Vocabulary Section";
                return (
                  <motion.div
                    key={act.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-3.5 border-b border-border/60 last:border-0 pb-3 last:pb-0 group"
                  >
                    <div
                      className={cn(
                        "rounded-2xl p-2.5 mt-0.5 shrink-0 transition-transform group-hover:scale-110",
                        act.passed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                      )}
                    >
                      {act.examType === "sentence" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-foreground truncate block">
                          Completed {secName} {typeLabel}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" /> {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Accuracy: <strong className="text-foreground">{act.scorePercentage}%</strong> ({act.correctAnswers}/{act.totalQuestions})
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          +{act.correctAnswers * 10} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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

export function DashboardView({ stats, onNavigate, onStartPractice }: DashboardViewProps) {
  const goalPercentage = Math.min(100, Math.round((stats.todayCompleted / stats.dailyGoal) * 100));

  const [activities, setActivities] = React.useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = React.useState(false);

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
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-[28px] bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-5 sm:p-8 text-white shadow-2xl shadow-indigo-600/20"
      >
        {/* Animated Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-glow" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
              <span>Daily Mastery Status • Active Learner</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Kem Cho! Welcome back to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Gujarati English Master
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-xl">
              You are making great progress today! Continue your practice streak and conquer new sentence translation modules.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <StatefulButton
                variant="success"
                size="lg"
                onClick={() => onStartPractice("vocabulary")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold shadow-lg shadow-emerald-500/30 border-0 text-xs sm:text-sm px-4 sm:px-6"
              >
                <span>Continue Learning</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
              </StatefulButton>

              <button
                type="button"
                onClick={() => onNavigate("progress")}
                className="inline-flex h-12 sm:h-14 items-center gap-2 rounded-[18px] border border-white/20 bg-white/10 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <span>View Analytics</span>
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Hero Column: Today's Goal Ring & Counter Cards */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 border border-white/20 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
                <span className="text-xs sm:text-sm font-bold">Today's Progress</span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-indigo-200" suppressHydrationWarning>
                {stats.todayCompleted} of {stats.dailyGoal} Qs
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-black/20 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 shadow-md"
                />
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-indigo-200">
                <div suppressHydrationWarning>{goalPercentage}% Goal Reached</div>
                <div suppressHydrationWarning>{stats.dailyGoal - stats.todayCompleted > 0 ? `${stats.dailyGoal - stats.todayCompleted} left` : "Complete! 🎉"}</div>
              </div>
            </div>

            {/* Counter Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-xl bg-slate-950/30 p-2 sm:p-3 border border-white/10">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-amber-400 fill-amber-400 mb-1" />
                <span className="text-[9px] sm:text-[10px] text-indigo-200 uppercase font-bold block">Streak</span>
                <NumberAnimation value={stats.streak} className="text-base sm:text-lg font-black text-white" suffix=" d" />
              </div>

              <div className="rounded-xl bg-slate-950/30 p-2 sm:p-3 border border-white/10">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-indigo-300 fill-indigo-300 mb-1" />
                <span className="text-[9px] sm:text-[10px] text-indigo-200 uppercase font-bold block">XP</span>
                <NumberAnimation value={stats.xp} className="text-base sm:text-lg font-black text-white" />
              </div>

              <div className="rounded-xl bg-slate-950/30 p-2 sm:p-3 border border-white/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-emerald-400 mb-1" />
                <span className="text-[9px] sm:text-[10px] text-indigo-200 uppercase font-bold block">Accuracy</span>
                <span className="text-base sm:text-lg font-black text-white" suppressHydrationWarning>{stats.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Practice Selection Launcher Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">Practice Modules</h3>
            <p className="text-xs text-muted-foreground">Select a practice mode to train your Gujarati skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Vocabulary */}
          <TiltCard
            onClick={() => onStartPractice("vocabulary")}
            className="group hover:border-indigo-500/50 transition-all bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                25 Words
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Vocabulary Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Master Gujarati word spellings, phonetics, and English meanings with instant feedback.
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-border">
              <span>Start Vocabulary</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 2: Sentence */}
          <TiltCard
            onClick={() => onStartPractice("sentence")}
            className="group hover:border-purple-500/50 transition-all bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                10 Topics
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Sentence Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Practice full Gujarati to English translations across topics like Whose, Which, Can, Could, Will, etc.
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 pt-2 border-t border-border">
              <span>Choose Topics</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 3: Mixed Practice */}
          <TiltCard
            onClick={() => onStartPractice("mixed")}
            className="group hover:border-emerald-500/50 transition-all bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Shuffle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Randomized
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Mixed Practice
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Challenge yourself with a randomized sequence of vocabulary spellings and complex sentences.
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-border">
              <span>Start Quiz</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>

          {/* Card 4: Sentence Reading AI */}
          <TiltCard
            onClick={() => onNavigate("sentence-reading" as any)}
            className="group hover:border-purple-500/50 transition-all bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                AI Voice
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Sentence Reading AI
            </h4>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Listen to native reading, inspect word-by-word phonetics, and practice speaking into mic.
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 pt-2 border-t border-border">
              <span>Open Reader</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Statistics Grid & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">Overview Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Vocabulary Learned</span>
                <BookOpen className="h-4 w-4 text-indigo-500" />
              </div>
              <NumberAnimation value={stats.vocabularyLearned} className="text-xl sm:text-2xl font-black text-foreground" suffix=" Words" />
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +4 words this week
              </p>
            </div>

            <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Sentence Practice</span>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </div>
              <NumberAnimation value={stats.sentencesPracticed} className="text-xl sm:text-2xl font-black text-foreground" suffix=" Sentences" />
              <p className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" /> 94% translation success
              </p>
            </div>

            <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Weak Topics</span>
                <BarChart3 className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-foreground block">Had & Would</span>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Recommended for practice
              </p>
            </div>

            <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Average Accuracy</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-foreground block" suppressHydrationWarning>{stats.accuracy}%</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Top 5% among learners
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">Recent Activity</h3>
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full History
            </button>
          </div>

          <div className="rounded-[20px] border border-border bg-card p-4 sm:p-5 space-y-4">
            {loadingActivities ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <MotionSpinner size="sm" />
                <span className="text-xs font-bold text-muted-foreground">Loading recent activities...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-500">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-xs font-extrabold text-foreground">No Recent Activity Yet</p>
                <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                  Complete your first vocabulary or sentence module exam to start tracking your learning history here!
                </p>
              </div>
            ) : (
              activities.map((act) => {
                const secName = act.sectionId ? act.sectionId.toUpperCase() : "EXAM";
                const typeLabel = act.examType === "sentence" ? "Sentence Module" : "Vocabulary Section";
                return (
                  <div key={act.id} className="flex items-start gap-3 border-b border-border/60 last:border-0 pb-3 last:pb-0">
                    <div
                      className={cn(
                        "rounded-full p-2 mt-0.5 shrink-0",
                        act.passed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {act.examType === "sentence" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-foreground block truncate">
                        Completed {secName} {typeLabel}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Scored {act.scorePercentage}% accuracy ({act.correctAnswers}/{act.totalQuestions}) • +{act.correctAnswers * 10} XP
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" /> {formatRelativeTime(act.timestamp)}
                    </span>
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


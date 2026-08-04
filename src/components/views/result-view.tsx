"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Flame,
  Zap,
  BarChart3,
  RotateCcw,
  LayoutDashboard,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { StatefulButton } from "@/components/beui/stateful-button";
import { NumberAnimation } from "@/components/beui/number-animation";
import { type NavItem } from "@/components/beui/bounce-sidebar";

interface ResultViewProps {
  score: number;
  accuracy: number;
  xp: number;
  mistakes: any[];
  onNavigate: (nav: NavItem) => void;
  onRestartPractice: () => void;
}

export function ResultView({
  score,
  accuracy,
  xp,
  mistakes,
  onNavigate,
  onRestartPractice,
}: ResultViewProps) {
  useEffect(() => {
    // Fire celebratory confetti on mount
    const end = Date.now() + 1.5 * 1000;
    const colors = ["#6366f1", "#a855f7", "#10b981", "#f59e0b"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 text-center space-y-8 select-none">
      {/* Trophy Header Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950 mx-auto shadow-2xl shadow-amber-400/30"
      >
        <Trophy className="h-12 w-12 stroke-[2.5]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md"
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <span className="inline-block rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
          Module Complete 🎉
        </span>
        <h2 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
          Congratulations!
        </h2>
        <p className="text-sm text-muted-foreground">
          You finished the practice session with incredible focus. Here is your summary!
        </p>
      </motion.div>

      {/* Main Score Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-[28px] border border-border bg-card shadow-xl"
      >
        <div className="rounded-2xl bg-muted/40 p-4 border border-border/60">
          <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Score</span>
          <NumberAnimation value={score} className="text-xl font-black text-foreground" />
        </div>

        <div className="rounded-2xl bg-muted/40 p-4 border border-border/60">
          <BarChart3 className="h-5 w-5 mx-auto text-indigo-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Accuracy</span>
          <span className="text-xl font-black text-foreground">{accuracy}%</span>
        </div>

        <div className="rounded-2xl bg-muted/40 p-4 border border-border/60">
          <Zap className="h-5 w-5 mx-auto text-amber-500 fill-amber-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">XP Earned</span>
          <NumberAnimation value={xp} className="text-xl font-black text-indigo-600 dark:text-indigo-400" prefix="+" />
        </div>

        <div className="rounded-2xl bg-muted/40 p-4 border border-border/60">
          <Flame className="h-5 w-5 mx-auto text-rose-500 fill-rose-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Streak</span>
          <span className="text-xl font-black text-foreground">Active 🔥</span>
        </div>
      </motion.div>

      {/* Weak Topics / Review Mistakes Summary */}
      {mistakes.length > 0 ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> {mistakes.length} Items Need Review
            </span>
            <button
              type="button"
              onClick={() => onNavigate("mistakes")}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Open Mistakes Page →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {mistakes.slice(0, 4).map((m, i) => (
              <span
                key={i}
                className="rounded-lg bg-card px-3 py-1 text-xs font-semibold text-foreground border border-border"
              >
                {m.gujarati} → <span className="text-emerald-500">{m.correctEnglish}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          🌟 Perfect Score! You answered all questions correctly without any mistakes.
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <StatefulButton
          variant="primary"
          size="lg"
          onClick={onRestartPractice}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" /> Practice Again
        </StatefulButton>

        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-[18px] border border-border bg-card px-8 text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
        >
          <LayoutDashboard className="h-4 w-4 text-indigo-500" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}

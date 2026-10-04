"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Flame,
  Zap,
  BarChart3,
  RotateCcw,
  LayoutDashboard,
  AlertCircle,
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
    const end = Date.now() + 1.2 * 1000;
    const colors = ["#FFE600", "#FF6B00", "#22C55E", "#000000"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
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
    <div className="max-w-2xl mx-auto py-8 text-center space-y-7 select-none">
      {/* Trophy Header Badge */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[4px] border-[3px] border-black bg-[#FFE600] text-black mx-auto shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
        <Trophy className="h-10 w-10 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-block rounded-[2px] border-2 border-black bg-[#22C55E] px-3.5 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212]">
          Session Completed 🎉
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
          Congratulations!
        </h2>
        <p className="text-xs sm:text-sm font-bold text-muted-foreground">
          You finished the practice session with incredible focus. Here is your summary!
        </p>
      </div>

      {/* Main Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-[4px] border-[2.5px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#ffffff]">
        <div className="rounded-[3px] bg-[#FAF7F2] dark:bg-zinc-800 p-3.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212]">
          <CheckCircle2 className="h-5 w-5 mx-auto text-[#22C55E] mb-1 stroke-[3]" />
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Score</span>
          <NumberAnimation value={score} className="text-xl font-black text-foreground" />
        </div>

        <div className="rounded-[3px] bg-[#FAF7F2] dark:bg-zinc-800 p-3.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212]">
          <BarChart3 className="h-5 w-5 mx-auto text-black dark:text-white mb-1 stroke-[2.5]" />
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Accuracy</span>
          <span className="text-xl font-black text-foreground">{accuracy}%</span>
        </div>

        <div className="rounded-[3px] bg-[#FAF7F2] dark:bg-zinc-800 p-3.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212]">
          <Zap className="h-5 w-5 mx-auto text-black fill-[#FFE600] mb-1 stroke-[2]" />
          <span className="text-[9px] text-muted-foreground uppercase font-black block">XP Earned</span>
          <NumberAnimation value={xp} className="text-xl font-black text-[#FF6B00]" prefix="+" />
        </div>

        <div className="rounded-[3px] bg-[#FAF7F2] dark:bg-zinc-800 p-3.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212]">
          <Flame className="h-5 w-5 mx-auto text-black fill-[#FF6B00] mb-1" />
          <span className="text-[9px] text-muted-foreground uppercase font-black block">Streak</span>
          <span className="text-xl font-black text-foreground">Active 🔥</span>
        </div>
      </div>

      {/* Weak Topics / Review Mistakes Summary */}
      {mistakes.length > 0 ? (
        <div className="rounded-[4px] border-2 border-black bg-[#FFEAEA] dark:bg-rose-950/60 p-5 text-left space-y-3 shadow-[4px_4px_0px_#121212]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#FF4D4D] flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 stroke-[3]" /> {mistakes.length} Items Need Review
            </span>
            <button
              type="button"
              onClick={() => onNavigate("mistakes")}
              className="text-xs font-black uppercase text-foreground hover:underline cursor-pointer"
            >
              Open Mistakes Page →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {mistakes.slice(0, 4).map((m, i) => (
              <span
                key={i}
                className="rounded-[2px] bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs font-bold text-foreground border border-black shadow-[1.5px_1.5px_0px_#121212]"
              >
                {m.gujarati} → <span className="text-[#22C55E] font-black">{m.correctEnglish}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[4px] border-2 border-black bg-[#E8F8EE] dark:bg-zinc-900 p-4 text-xs font-black uppercase text-black dark:text-emerald-300 shadow-[3px_3px_0px_#121212]">
          🌟 Perfect Score! You answered all questions correctly without any mistakes.
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
        <StatefulButton
          variant="primary"
          size="lg"
          onClick={onRestartPractice}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4 stroke-[2.5]" />
          <span>Practice Again</span>
        </StatefulButton>

        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="inline-flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-[4px] border-[2.5px] border-black bg-white dark:bg-zinc-800 px-7 text-xs sm:text-sm font-black uppercase text-foreground shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#121212] transition-all cursor-pointer"
        >
          <LayoutDashboard className="h-4 w-4 stroke-[2.5]" /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}

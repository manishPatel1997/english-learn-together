"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Volume2, VolumeX, Sparkles, Trophy } from "lucide-react";
import { NumberAnimation } from "./number-animation";
import { cn } from "@/lib/utils";

interface DynamicIslandProps {
  streak?: number;
  xp?: number;
  accuracy?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  activeMessage?: string | null;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export function DynamicIsland({
  streak = 0,
  xp = 0,
  accuracy = 100,
  currentQuestion,
  totalQuestions,
  activeMessage,
  soundEnabled = true,
  onToggleSound,
}: DynamicIslandProps) {
  const [expanded, setExpanded] = useState(false);

  const getComboMultiplier = (s: number) => {
    if (s >= 10) return "3x XP";
    if (s >= 5) return "2x XP";
    if (s >= 3) return "1.5x XP";
    return null;
  };

  const combo = getComboMultiplier(streak);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative flex items-center justify-between gap-4 rounded-full bg-slate-950/90 text-white shadow-2xl border border-slate-800 backdrop-blur-xl px-5 py-2.5 cursor-pointer select-none",
          expanded ? "w-[360px] rounded-[24px] p-5 flex-col items-stretch" : "w-auto"
        )}
      >
        <AnimatePresence mode="wait">
          {activeMessage ? (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400"
            >
              <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
              <span>{activeMessage}</span>
            </motion.div>
          ) : (
            <motion.div key="normal" className="flex items-center gap-4 text-xs">
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
                <NumberAnimation value={streak} suffix=" Streak" />
              </div>

              {/* Combo Multiplier */}
              {combo && (
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 uppercase tracking-wide animate-bounce">
                  {combo}
                </span>
              )}

              {/* XP */}
              <div className="flex items-center gap-1 font-semibold text-indigo-300">
                <Zap className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                <NumberAnimation value={xp} suffix=" XP" />
              </div>

              {/* Progress counter if present */}
              {currentQuestion && totalQuestions && (
                <div className="hidden sm:flex items-center gap-1 text-slate-400 border-l border-slate-800 pl-3">
                  <span>Q{currentQuestion}</span>
                  <span>/</span>
                  <span>{totalQuestions}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Toggle button */}
        {onToggleSound && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSound();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          </button>
        )}

        {/* Expanded View Content */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs"
          >
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Accuracy</span>
              <span className="font-bold text-emerald-400 text-sm">{accuracy}%</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Combo</span>
              <span className="font-bold text-amber-400 text-sm">{combo || "1x"}</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Total XP</span>
              <span className="font-bold text-indigo-400 text-sm">{xp}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

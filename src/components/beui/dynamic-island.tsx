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
    <div className="fixed top-18 sm:top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[calc(100vw-24px)]">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
        className={cn(
          "relative flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-slate-950/95 text-white shadow-2xl border border-slate-800/80 backdrop-blur-2xl px-3.5 sm:px-5 py-2 sm:py-2.5 cursor-pointer select-none transition-all duration-300",
          streak >= 3 && "border-amber-500/40 shadow-amber-500/10 shadow-lg",
          streak >= 10 && "border-orange-500/60 shadow-orange-500/20 shadow-xl ring-2 ring-orange-500/30",
          expanded ? "w-[calc(100vw-24px)] sm:w-[400px] rounded-[28px] p-5 flex-col items-stretch" : "max-w-[calc(100vw-24px)] w-auto"
        )}
      >
        <AnimatePresence mode="wait">
          {activeMessage ? (
            <motion.div
              key="msg"
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 6 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400"
            >
              <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
              <span>{activeMessage}</span>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 text-xs font-medium"
            >
              {/* Streak Badge */}
              <motion.div
                className="flex items-center gap-1.5 font-bold text-amber-400"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className={cn("h-4 w-4 fill-amber-400", streak > 0 && "animate-bounce text-orange-500")} />
                <NumberAnimation value={streak} suffix=" Streak" />
              </motion.div>

              {/* Combo Multiplier */}
              {combo && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider shadow-sm shadow-orange-500/30 animate-pulse"
                >
                  {combo}
                </motion.span>
              )}

              {/* XP */}
              <motion.div
                className="flex items-center gap-1 font-semibold text-indigo-300"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                <NumberAnimation value={xp} suffix=" XP" />
              </motion.div>

              {/* Progress counter if present */}
              {currentQuestion && totalQuestions && (
                <div className="hidden sm:flex items-center gap-1 text-slate-400 border-l border-slate-800 pl-3 text-[11px] font-semibold">
                  <span>Q{currentQuestion}</span>
                  <span className="text-slate-600">/</span>
                  <span>{totalQuestions}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Toggle button */}
        {onToggleSound && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSound();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shadow-xs"
            title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          </motion.button>
        )}

        {/* Expanded View Content */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2.5 text-center text-xs"
          >
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block">Accuracy</span>
              <span className="font-black text-emerald-400 text-sm">{accuracy}%</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block">Combo</span>
              <span className="font-black text-amber-400 text-sm">{combo || "1x"}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-semibold block">Total XP</span>
              <span className="font-black text-indigo-400 text-sm">{xp}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

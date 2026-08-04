"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Volume2, Sparkles, Star } from "lucide-react";
import { StatefulButton } from "./stateful-button";
import { cn } from "@/lib/utils";

interface PreviewRailProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  categoryOrTopic?: string;
  gujaratiText?: string;
  englishTranslation?: string;
  phonetic?: string;
  exampleSentence?: string;
  hint?: string;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

export function PreviewRail({
  open,
  onClose,
  title,
  subtitle,
  categoryOrTopic,
  gujaratiText,
  englishTranslation,
  phonetic,
  exampleSentence,
  hint,
  onFavoriteToggle,
  isFavorite = false,
}: PreviewRailProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Side Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-border bg-card p-6 shadow-2xl flex flex-col justify-between select-none"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{title}</h3>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="mt-6 space-y-6">
                {/* Main Gujarati Display Card */}
                <div className="rounded-[20px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 border border-indigo-500/20 text-center relative overflow-hidden">
                  {categoryOrTopic && (
                    <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-3">
                      {categoryOrTopic}
                    </span>
                  )}
                  {gujaratiText && (
                    <h2 className="text-3xl font-extrabold text-foreground tracking-wide font-sans mb-2">
                      {gujaratiText}
                    </h2>
                  )}
                  {phonetic && (
                    <p className="text-sm italic text-muted-foreground">Pronounced: "{phonetic}"</p>
                  )}
                </div>

                {/* English Translation */}
                {englishTranslation && (
                  <div className="rounded-2xl border border-border p-4 bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground block mb-1">
                      English Translation
                    </span>
                    <p className="text-lg font-bold text-foreground">{englishTranslation}</p>
                  </div>
                )}

                {/* Example Sentence */}
                {exampleSentence && (
                  <div className="rounded-2xl border border-border p-4 bg-muted/30 space-y-1">
                    <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Example Context
                    </span>
                    <p className="text-sm text-foreground italic">{exampleSentence}</p>
                  </div>
                )}

                {/* Grammar Hint */}
                {hint && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      💡 Practice Hint
                    </span>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              {onFavoriteToggle && (
                <button
                  type="button"
                  onClick={onFavoriteToggle}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors",
                    isFavorite
                      ? "bg-amber-500/20 border-amber-500 text-amber-500"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Star className={cn("h-5 w-5", isFavorite && "fill-amber-500")} />
                </button>
              )}

              <StatefulButton variant="primary" className="flex-1" onClick={onClose}>
                Close Preview
              </StatefulButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

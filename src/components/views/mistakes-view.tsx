"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trash2,
  BookOpen,
  MessageSquare,
  Check,
} from "lucide-react";
import { StatefulButton } from "@/components/beui/stateful-button";
import { MorphingModal } from "@/components/beui/morphing-modal";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type MistakeItem } from "@/lib/storage";

export function MistakesView() {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [retryItem, setRetryItem] = useState<MistakeItem | null>(null);
  const [retryInput, setRetryInput] = useState("");
  const [retrySuccess, setRetrySuccess] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setMistakes(storage.getMistakes());
  }, []);

  const handleMarkLearned = (id: string | number) => {
    storage.removeMistake(id);
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    toast({
      title: "Marked as Learned! 🎉",
      description: "Item removed from your mistakes review queue.",
      type: "success",
    });
  };

  const normalizeText = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()'"’]/g, "")
      .replace(/\s+/g, " ");

  const handleRetrySubmit = () => {
    if (!retryItem) return;
    const formattedUser = normalizeText(retryInput);

    const validAnswers = [
      retryItem.correctEnglish,
      ...((retryItem as any).answers || []),
    ].filter((a) => a && typeof a === "string");

    const isMatch = validAnswers.some((ans) => normalizeText(ans) === formattedUser);

    if (isMatch) {
      setRetrySuccess(true);
      toast({
        title: "Correct! Outstanding Retry 🌟",
        description: "You have mastered this mistake.",
        type: "success",
      });

      setTimeout(() => {
        handleMarkLearned(retryItem.id);
        setRetryItem(null);
        setRetryInput("");
        setRetrySuccess(false);
      }, 900);
    } else {
      toast({
        title: "Not quite right",
        description: `Target answer: "${retryItem.correctEnglish}"`,
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 select-none pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" /> Targeted Mistakes Queue
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight mt-1">
            Review Your Mistakes
          </h2>
          <p className="text-xs text-muted-foreground">
            Revisit past incorrect answers to reinforce your long-term memory.
          </p>
        </div>

        <span className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 self-start sm:self-auto">
          {mistakes.length} Errors Remaining
        </span>
      </div>

      {/* List of Mistakes */}
      {mistakes.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {mistakes.map((item, idx) => (
              <motion.div
                key={`mistake-${item.id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[24px] border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                      {item.topic}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      {item.type === "vocabulary" ? "Spelling Word" : "Sentence Translation"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-foreground font-sans">
                    {item.gujarati}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">
                        Your Incorrect Answer:
                      </span>
                      <span className="font-semibold text-rose-700 dark:text-rose-300">
                        {item.userAnswer || "(Skipped)"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        Correct English Answer:
                      </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                        {item.correctEnglish}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setRetryItem(item);
                      setRetryInput("");
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Retry Now
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkLearned(item.id)}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark Learned
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-[28px] border border-emerald-500/30 bg-emerald-500/5 p-12 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="text-2xl font-black text-foreground">Zero Mistakes Recorded!</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You have either solved all past mistakes or haven't made any errors yet. Keep up the high accuracy!
          </p>
        </div>
      )}

      {/* Retry Morphing Modal */}
      <MorphingModal
        open={!!retryItem}
        onOpenChange={() => setRetryItem(null)}
        title="Retry Mistake Question"
      >
        {retryItem && (
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {retryItem.topic} Module
              </span>
              <h3 className="text-3xl font-black text-foreground">{retryItem.gujarati}</h3>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={retryInput}
                onChange={(e) => setRetryInput(e.target.value)}
                placeholder="Type correct English translation..."
                autoFocus
                className="w-full rounded-2xl border border-border bg-background p-4 text-center text-lg font-bold text-foreground outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              <StatefulButton
                state={retrySuccess ? "success" : "idle"}
                variant="primary"
                size="lg"
                onClick={handleRetrySubmit}
                className="w-full"
              >
                Submit Retry Answer
              </StatefulButton>
            </div>
          </div>
        )}
      </MorphingModal>
    </div>
  );
}

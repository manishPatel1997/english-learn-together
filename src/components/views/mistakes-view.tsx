"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  RotateCcw,
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
    <div className="space-y-7 w-full max-w-5xl mx-auto select-none pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-[#FF4D4D] px-2.5 py-0.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#121212]">
            <AlertCircle className="h-3.5 w-3.5 stroke-[3]" /> Targeted Mistakes Queue
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2">
            Review Your Mistakes
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            Revisit past incorrect answers to reinforce your long-term memory.
          </p>
        </div>

        <span className="rounded-[3px] border-2 border-black bg-[#FFE600] px-4 py-2 text-xs font-black text-black uppercase shadow-[3px_3px_0px_#121212] self-start sm:self-auto">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[3px_3px_0px_#121212] sm:shadow-[5px_5px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[5px_5px_0px_#ffffff]"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[2px] border border-black bg-[#FFE600] px-2 py-0.2 text-[9px] font-black uppercase text-black">
                      {item.topic}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black">
                      {item.type === "vocabulary" ? "Spelling Word" : "Sentence Translation"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-foreground font-sans">
                    {item.gujarati}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-[3px] bg-[#FFEAEA] dark:bg-rose-950/60 border-2 border-black p-2.5 shadow-[1.5px_1.5px_0px_#121212]">
                      <span className="text-[9px] text-[#FF4D4D] font-black uppercase block">
                        Your Incorrect Answer:
                      </span>
                      <span className="font-bold text-foreground">
                        {item.userAnswer || "(Skipped)"}
                      </span>
                    </div>

                    <div className="rounded-[3px] bg-[#E8F8EE] dark:bg-emerald-950/60 border-2 border-black p-2.5 shadow-[1.5px_1.5px_0px_#121212]">
                      <span className="text-[9px] text-[#22C55E] dark:text-[#4ADE80] font-black uppercase block">
                        Correct English Answer:
                      </span>
                      <span className="font-black text-foreground">
                        {item.correctEnglish}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t-2 sm:border-t-0 border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setRetryItem(item);
                      setRetryInput("");
                    }}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FFE600] px-4 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" /> Retry
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkLearned(item.id)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-4 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" /> Learned
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-[4px] border-[2.5px] border-black bg-[#E8F8EE] dark:bg-zinc-900 p-12 text-center space-y-3 shadow-[5px_5px_0px_#121212]">
          <CheckCircle2 className="h-12 w-12 text-[#22C55E] mx-auto stroke-[2.5]" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Zero Mistakes Recorded!</h3>
          <p className="text-xs font-bold text-muted-foreground max-w-sm mx-auto">
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
          <div className="space-y-5 pt-2 select-none">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase bg-[#FFE600] text-black px-2 py-0.5 border border-black rounded-[2px]">
                {retryItem.topic} Module
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground pt-1">{retryItem.gujarati}</h3>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={retryInput}
                onChange={(e) => setRetryInput(e.target.value)}
                placeholder="Type correct English translation..."
                autoFocus
                className="w-full rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 p-3.5 text-center text-base font-black text-foreground outline-none shadow-[3px_3px_0px_#121212]"
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

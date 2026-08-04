"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  HelpCircle as QuestionIcon,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { StatefulButton } from "@/components/beui/stateful-button";
import sentenceData from "@/data/sentences.json";
import { cn } from "@/lib/utils";

export interface TopicConfig {
  key: string;
  name: string;
  gujaratiSample: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
}

const TOPIC_ICONS: Record<string, string> = {
  what: "❓",
  whose: "❓",
  which: "🎯",
  how_many: "🔢",
  how_many_much: "🔢",
  where: "📍",
  when: "⏰",
  can: "⚡",
  could: "🤝",
  will: "🚀",
  would: "☕",
  has_have_had: "💎",
  why: "🤔",
  how: "💡",
  who: "👤",
  should: "⚖️",
  must: "❗",
};

export function getDynamicTopicList(): TopicConfig[] {
  const allKeys = Object.keys(sentenceData).filter((k) => k !== "_order");
  const orderKeys: string[] = (sentenceData as any)._order || [];

  const keys = [
    ...orderKeys.filter((k) => (sentenceData as any)[k] && Array.isArray((sentenceData as any)[k])),
    ...allKeys.filter((k) => !orderKeys.includes(k) && Array.isArray((sentenceData as any)[k])),
  ];

  return keys.map((key) => {
    const list = (sentenceData as any)[key] || [];
    const sampleItem = list[0] || {};

    let name = sampleItem.topic;
    if (!name) {
      const cleanKey = key.replace(/_section$/, "").replace(/_/g, " ");
      name = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
    }

    const rawKey = key.replace(/_section$/, "").toLowerCase();
    const icon = TOPIC_ICONS[rawKey] || "📝";
    const difficulty: "Easy" | "Medium" | "Hard" = sampleItem.difficulty || "Easy";
    const estimatedMinutes = Math.max(2, Math.ceil(list.length * 0.3));

    return {
      key,
      name,
      gujaratiSample: sampleItem.gujarati || "નમૂના વાક્ય",
      icon,
      difficulty,
      estimatedMinutes,
    };
  });
}

interface TopicSelectViewProps {
  onStartSelectedTopics: (selectedKeys: string[]) => void;
}

export function TopicSelectView({ onStartSelectedTopics }: TopicSelectViewProps) {
  const topicList = getDynamicTopicList();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>(() =>
  //   topicList.slice(0, 3).map((t) => t.key)
  // );

  const toggleTopic = (key: string) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const selectAll = () => {
    setSelectedKeys(topicList.map((t) => t.key));
  };

  const deselectAll = () => {
    setSelectedKeys([]);
  };

  // Compute combined stats
  const totalQuestions = selectedKeys.reduce((acc, key) => {
    const list = (sentenceData as any)[key] || [];
    return acc + list.length;
  }, 0);

  const totalTime = selectedKeys.reduce((acc, key) => {
    const topic = topicList.find((t) => t.key === key);
    return acc + (topic?.estimatedMinutes || 3);
  }, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 select-none pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sentence Grammar Modules
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight mt-1">
            Select Practice Topics
          </h2>
          <p className="text-xs text-muted-foreground">
            Choose one or multiple topics to generate your custom practice set.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Check className="h-3.5 w-3.5 text-emerald-500" /> Select All
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <X className="h-3.5 w-3.5 text-rose-500" /> Deselect All
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topicList.map((topic) => {
          const isSelected = selectedKeys.includes(topic.key);
          const questionsCount = ((sentenceData as any)[topic.key] || []).length;

          return (
            <motion.div
              key={topic.key}
              onClick={() => toggleTopic(topic.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col justify-between rounded-[22px] border p-5 cursor-pointer transition-all shadow-sm select-none",
                isSelected
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/15"
                  : "border-border bg-card hover:border-border/80"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-border bg-background text-transparent"
                    )}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>

                <h4 className="text-lg font-black text-foreground mb-1">
                  {isSelected ? `✓ ${topic.name}` : topic.name}
                </h4>

                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-4 italic">
                  "{topic.gujaratiSample}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                  <QuestionIcon className="h-3.5 w-3.5 text-purple-500" /> {questionsCount} Questions
                </span>
                <span className="text-muted-foreground flex items-center gap-1 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> ~{topic.estimatedMinutes} mins
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                    topic.difficulty === "Easy"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {topic.difficulty}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[24px] border border-border bg-slate-950/90 p-4 px-6 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Topics Selected</span>
              <span className="font-extrabold text-amber-400 text-base">{selectedKeys.length} Modules</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Questions</span>
              <span className="font-extrabold text-indigo-300 text-base">{totalQuestions} Questions</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Est. Duration</span>
              <span className="font-extrabold text-emerald-400 text-base">~{totalTime} Mins</span>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedKeys.length === 0}
            onClick={() => onStartSelectedTopics(selectedKeys)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>{selectedKeys.length === 0 ? "Select at least 1 topic" : "Start Practice"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

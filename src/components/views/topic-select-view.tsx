"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  HelpCircle as QuestionIcon,
  ArrowRight,
  SlidersHorizontal,
  X,
  Lock,
} from "lucide-react";
import sentenceData from "@/data/sentences.json";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/beui/animated-toast-stack";

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
  const { toast } = useToast();
  const { unlockedSections } = useAuth();
  const topicList = getDynamicTopicList();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const isTopicUnlocked = (key: string) => {
    if (key === "who_section") return true;
    return (
      unlockedSections.includes(key) ||
      unlockedSections.includes("sentence_all") ||
      unlockedSections.includes("all")
    );
  };

  const toggleTopic = (key: string) => {
    if (!isTopicUnlocked(key)) {
      toast({
        title: "Sentence Module Locked 🔒",
        description: "Your administrator has not unlocked this sentence module yet, or complete previous practice to unlock!",
        type: "info",
      });
      return;
    }

    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };

  const selectAll = () => {
    setSelectedKeys(topicList.filter((t) => isTopicUnlocked(t.key)).map((t) => t.key));
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
    <div className="space-y-7 w-full select-none pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212]">
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[2.5]" /> Sentence Grammar Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2">
            Select Practice Topics
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            Choose one or multiple topics to generate your custom practice set.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-3.5 text-xs font-black uppercase text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" /> Select All
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-3.5 text-xs font-black uppercase text-foreground hover:bg-[#FF4D4D] hover:text-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] cursor-pointer"
          >
            <X className="h-3.5 w-3.5 stroke-[3]" /> Deselect
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topicList.map((topic) => {
          const isSelected = selectedKeys.includes(topic.key);
          const isUnlocked = isTopicUnlocked(topic.key);
          const questionsCount = ((sentenceData as any)[topic.key] || []).length;

          return (
            <div
              key={topic.key}
              onClick={() => toggleTopic(topic.key)}
              className={cn(
                "relative flex flex-col justify-between rounded-[4px] border-2 p-5 cursor-pointer select-none transition-all",
                !isUnlocked
                  ? "border-black/30 dark:border-white/30 bg-neutral-100 dark:bg-zinc-900 opacity-60"
                  : isSelected
                  ? "border-[2.5px] border-black bg-[#FFE600] text-black shadow-[5px_5px_0px_#121212] -translate-x-0.5 -translate-y-0.5"
                  : "border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-foreground shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#121212] dark:hover:shadow-[6px_6px_0px_#ffffff]"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-2xl", !isUnlocked && "grayscale opacity-50")}>{topic.icon}</span>
                  {!isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-[2px] border border-black bg-[#FF4D4D] px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-[1px_1px_0px_#000]">
                      <Lock className="h-3 w-3 stroke-[2.5]" /> Locked
                    </span>
                  ) : (
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-[2px] border-2 border-black transition-all",
                        isSelected
                          ? "bg-black text-white shadow-[1px_1px_0px_#000]"
                          : "bg-white text-transparent shadow-[1px_1px_0px_#121212]"
                      )}
                    >
                      <Check className="h-4 w-4 stroke-[3.5]" />
                    </div>
                  )}
                </div>

                <h4 className="text-base font-black uppercase tracking-tight mb-1">
                  {!isUnlocked ? `🔒 ${topic.name}` : isSelected ? `✓ ${topic.name}` : topic.name}
                </h4>

                <p className="text-xs font-bold mb-4 italic opacity-90">
                  "{topic.gujaratiSample}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-black/10 dark:border-white/10 text-xs">
                <span className="flex items-center gap-1 font-bold">
                  <QuestionIcon className="h-3.5 w-3.5 stroke-[2.5]" /> {questionsCount} Qs
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Clock className="h-3.5 w-3.5 stroke-[2.5]" /> ~{topic.estimatedMinutes}m
                </span>
                <span
                  className={cn(
                    "rounded-[2px] border border-black px-1.5 py-0.2 text-[9px] font-black uppercase shadow-[1px_1px_0px_#121212]",
                    topic.difficulty === "Easy"
                      ? "bg-[#22C55E] text-black"
                      : "bg-[#FF6B00] text-white"
                  )}
                >
                  {topic.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-3 sm:px-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-[4px] border-[2.5px] sm:border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-3.5 sm:p-4 px-4 sm:px-6 text-foreground shadow-[4px_4px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] transition-all">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-black block uppercase tracking-wider">Topics</span>
              <span className="font-black text-foreground text-xs sm:text-base">
                <span className={cn(
                  "px-1.5 py-0.2 rounded-[2px] border border-black dark:border-white font-black inline-block mr-1",
                  selectedKeys.length > 0
                    ? "bg-[#FFE600] text-black shadow-[1px_1px_0px_#121212]"
                    : "bg-neutral-100 dark:bg-zinc-800 text-muted-foreground"
                )}>
                  {selectedKeys.length}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">
                  {selectedKeys.length === 1 ? "Module" : "Modules"}
                </span>
              </span>
            </div>
            <div className="h-6 sm:h-8 w-[2px] bg-black/15 dark:bg-white/20" />
            <div className="text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-black block uppercase tracking-wider">Questions</span>
              <span className="font-black text-foreground text-xs sm:text-base">
                {totalQuestions} <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Qs</span>
              </span>
            </div>
            <div className="h-6 sm:h-8 w-[2px] bg-black/15 dark:bg-white/20" />
            <div className="text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-black block uppercase tracking-wider">Duration</span>
              <span className="font-black text-[#22C55E] dark:text-[#4ADE80] text-xs sm:text-base">
                ~{totalTime} <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">Mins</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedKeys.length === 0}
            onClick={() => onStartSelectedTopics(selectedKeys)}
            className={cn(
              "w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 rounded-[3px] border-2 border-black px-6 sm:px-8 py-2.5 text-xs sm:text-sm font-black uppercase transition-all",
              selectedKeys.length === 0
                ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-zinc-500 border-black/30 dark:border-white/30 cursor-not-allowed shadow-none"
                : "bg-[#22C55E] text-black shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer"
            )}
          >
            <span>{selectedKeys.length === 0 ? "Select at least 1 topic" : `Start Practice (${selectedKeys.length})`}</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

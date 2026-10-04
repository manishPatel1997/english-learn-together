"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  MessageSquare,
  Shuffle,
  Volume2,
  BarChart3,
  AlertCircle,
  Star,
  Settings,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ALL_VOCABULARY_QUESTIONS } from "@/lib/vocabulary-data";
import sentenceData from "@/data/sentences.json";
import { type NavItem } from "./bounce-sidebar";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (nav: NavItem) => void;
  onSelectWord?: (word: any) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  onSelectWord,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
          navigator.userAgent.includes("Mac")
      );
    }
  }, []);

  const navCommands = [
    { id: "nav-dashboard", label: "Go to Dashboard", icon: Sparkles, shortcut: "1", action: () => onNavigate("dashboard") },
    { id: "nav-vocab", label: "Start Vocabulary Practice", icon: BookOpen, shortcut: "2", action: () => onNavigate("vocabulary") },
    { id: "nav-sentence", label: "Start Sentence Practice", icon: MessageSquare, shortcut: "3", action: () => onNavigate("sentence") },
    { id: "nav-reading", label: "Open Sentence Reading AI", icon: Volume2, shortcut: "4", action: () => onNavigate("sentence-reading" as any) },
    { id: "nav-mixed", label: "Start Mixed Practice", icon: Shuffle, shortcut: "5", action: () => onNavigate("mixed") },
    { id: "nav-progress", label: "View Progress & Analytics", icon: BarChart3, shortcut: "6", action: () => onNavigate("progress") },
    { id: "nav-mistakes", label: "Review Mistakes", icon: AlertCircle, shortcut: "7", action: () => onNavigate("mistakes") },
    { id: "nav-favorites", label: "View Saved Favorites", icon: Star, shortcut: "8", action: () => onNavigate("favorites") },
    { id: "nav-settings", label: "Open Settings", icon: Settings, shortcut: "9", action: () => onNavigate("settings") },
  ];

  // Filter commands
  const filteredNav = query
    ? navCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : navCommands;

  const filteredVocab = query
    ? ALL_VOCABULARY_QUESTIONS.filter(
        (v) =>
          v.gujarati.includes(query) ||
          v.english.toLowerCase().includes(query.toLowerCase()) ||
          (v.category || "").toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const allSentences = Object.values(sentenceData).flat();
  const filteredSentences = query
    ? allSentences.filter(
        (s: any) =>
          s.gujarati.includes(query) ||
          s.english.toLowerCase().includes(query.toLowerCase()) ||
          s.topic.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Unified items array for keyboard navigation
  const allItems = [
    ...filteredNav.map((cmd) => ({
      type: "nav" as const,
      id: cmd.id,
      label: cmd.label,
      icon: cmd.icon,
      shortcut: cmd.shortcut,
      onSelect: () => {
        cmd.action();
        onOpenChange(false);
      },
    })),
    ...filteredVocab.map((word) => ({
      type: "vocab" as const,
      id: `vocab-${word.id}`,
      word,
      label: `${word.gujarati} — ${word.english}`,
      onSelect: () => {
        if (onSelectWord) onSelectWord(word);
        onNavigate("vocabulary");
        onOpenChange(false);
      },
    })),
    ...filteredSentences.map((sent: any, idx) => ({
      type: "sentence" as const,
      id: `sent-${idx}`,
      sent,
      label: `${sent.gujarati} — ${sent.english}`,
      onSelect: () => {
        onNavigate("sentence");
        onOpenChange(false);
      },
    })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSlashKey = e.key === "/" || e.code === "Slash";
      const isKKey = e.key.toLowerCase() === "k";
      const target = e.target as HTMLElement | null;
      const isInputActive =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      // ⌘1..9 / Ctrl+1..9 quick module jumping
      if ((e.metaKey || e.ctrlKey || e.altKey) && !open) {
        const numMap: Record<string, () => void> = {
          "1": () => onNavigate("dashboard"),
          "2": () => onNavigate("vocabulary"),
          "3": () => onNavigate("sentence"),
          "4": () => onNavigate("sentence-reading" as any),
          "5": () => onNavigate("mixed"),
          "6": () => onNavigate("progress"),
          "7": () => onNavigate("mistakes"),
          "8": () => onNavigate("favorites"),
          "9": () => onNavigate("settings"),
        };
        const digit = e.key >= "1" && e.key <= "9" ? e.key : e.code.replace("Digit", "").replace("Numpad", "");
        if (numMap[digit]) {
          e.preventDefault();
          numMap[digit]();
          onOpenChange(false);
          return;
        }
      }

      // Ctrl+K / Cmd+K shortcut
      if ((e.metaKey || e.ctrlKey) && isKKey) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }

      // "/" shortcut
      if (isSlashKey && !open && !isInputActive && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onOpenChange(true);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, allItems, selectedIndex, onNavigate]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (open && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex, open]);

  let navIndexOffset = 0;
  let vocabIndexOffset = filteredNav.length;
  let sentenceIndexOffset = filteredNav.length + filteredVocab.length;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/75 z-40"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[6px] border-[3px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] shadow-[4px_4px_0px_#121212] sm:shadow-[8px_8px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] sm:dark:shadow-[8px_8px_0px_#ffffff] z-50"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b-2 border-black dark:border-white px-5 py-4 bg-white dark:bg-zinc-900">
              <Search className="h-5 w-5 text-black dark:text-white stroke-[2.5]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search words, Gujarati sentences, commands... (Esc to exit)"
                autoFocus
                className="flex-1 bg-transparent text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground outline-none"
              />
              <div className="flex items-center gap-1.5">
                <kbd className="hidden sm:inline-flex items-center rounded-[2px] border-2 border-black dark:border-white bg-[#FFE600] px-2 py-0.5 text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#121212]">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
              {/* Quick Actions */}
              {filteredNav.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Navigation & Actions
                  </div>
                  <div className="space-y-1">
                    {filteredNav.map((cmd, i) => {
                      const itemIndex = navIndexOffset + i;
                      const isSelected = selectedIndex === itemIndex;
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          ref={(el) => {
                            itemRefs.current[itemIndex] = el;
                          }}
                          onClick={() => {
                            cmd.action();
                            onOpenChange(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[3px] px-3.5 py-2.5 text-xs font-bold transition-all text-left group cursor-pointer",
                            isSelected
                              ? "bg-[#FFE600] text-black border-2 border-black shadow-[2.5px_2.5px_0px_#121212] font-black"
                              : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                "h-4 w-4 stroke-[2.5]",
                                isSelected ? "text-black" : "text-foreground"
                              )}
                            />
                            <span>{cmd.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cmd.shortcut && (
                              <kbd
                                className={cn(
                                  "hidden sm:inline-flex items-center rounded-[2px] border border-black px-1.5 py-0.2 text-[10px] font-black shadow-[1px_1px_0px_#121212]",
                                  isSelected
                                    ? "bg-white text-black"
                                    : "bg-white dark:bg-black text-foreground"
                                )}
                              >
                                {isMac ? `⌘${cmd.shortcut}` : `Ctrl+${cmd.shortcut}`}
                              </kbd>
                            )}
                            <ArrowRight
                              className={cn(
                                "h-4 w-4 stroke-[3]",
                                isSelected ? "opacity-100 text-black" : "opacity-0 group-hover:opacity-100"
                              )}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vocabulary Results */}
              {filteredVocab.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Vocabulary Words ({filteredVocab.length})
                  </div>
                  <div className="space-y-1">
                    {filteredVocab.map((word, i) => {
                      const itemIndex = vocabIndexOffset + i;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <button
                          key={word.id}
                          ref={(el) => {
                            itemRefs.current[itemIndex] = el;
                          }}
                          onClick={() => {
                            if (onSelectWord) onSelectWord(word);
                            onNavigate("vocabulary");
                            onOpenChange(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[3px] px-3.5 py-2.5 text-xs transition-all text-left cursor-pointer",
                            isSelected
                              ? "bg-[#FFE600] text-black border-2 border-black shadow-[2.5px_2.5px_0px_#121212] font-black"
                              : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-black text-sm">
                              {word.gujarati}
                            </span>
                            <span className="text-muted-foreground">—</span>
                            <span className="font-bold">{word.english}</span>
                          </div>
                          <span className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-black uppercase text-foreground">
                            {word.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sentence Results */}
              {filteredSentences.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Sentences ({filteredSentences.length})
                  </div>
                  <div className="space-y-1">
                    {filteredSentences.map((sent: any, i) => {
                      const itemIndex = sentenceIndexOffset + i;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <button
                          key={sent.id}
                          ref={(el) => {
                            itemRefs.current[itemIndex] = el;
                          }}
                          onClick={() => {
                            onNavigate("sentence");
                            onOpenChange(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-[3px] px-3.5 py-2.5 text-xs transition-all text-left cursor-pointer",
                            isSelected
                              ? "bg-[#FFE600] text-black border-2 border-black shadow-[2.5px_2.5px_0px_#121212] font-black"
                              : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="font-black text-sm">{sent.gujarati}</span>
                            <span className="text-xs font-bold text-muted-foreground">{sent.english}</span>
                          </div>
                          <span className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-black uppercase text-foreground">
                            {sent.topic}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {query && filteredVocab.length === 0 && filteredSentences.length === 0 && filteredNav.length === 0 && (
                <div className="p-8 text-center text-xs font-bold text-muted-foreground uppercase">
                  No matching words or commands found for "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-black dark:border-white px-5 py-3 text-[11px] font-bold text-foreground bg-[#EFE8DD] dark:bg-zinc-900">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="uppercase">Jump:</span>
                <kbd className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-1.5 py-0.2 font-black shadow-[1px_1px_0px_#121212]">
                  {isMac ? "⌘1..9" : "Ctrl+1..9"}
                </kbd>
                <span className="mx-1">•</span>
                <span className="uppercase">Search:</span>
                <kbd className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-1.5 py-0.2 font-black shadow-[1px_1px_0px_#121212]">
                  {isMac ? "⌘K" : "Ctrl+K"}
                </kbd>
              </div>
              <div className="flex items-center gap-2">
                <span className="uppercase">Navigate</span>
                <kbd className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-1 py-0.2 font-black">↑↓</kbd>
                <span className="uppercase">Select</span>
                <kbd className="rounded-[2px] border border-black bg-white dark:bg-zinc-800 px-1 py-0.2 font-black">↵</kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

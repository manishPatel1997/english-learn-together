"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Target, Volume2, Clock, Trash2, Moon, Sun, RefreshCw, Sparkles } from "lucide-react";
import { Select } from "@/components/beui/select";
import { StatefulButton } from "@/components/beui/stateful-button";
import { MorphingModal } from "@/components/beui/morphing-modal";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type UserStats } from "@/lib/storage";
import { getStoredGeminiKey, saveStoredGeminiKey } from "@/lib/gemini-client";

interface SettingsViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export function SettingsView({ stats, onUpdateStats }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [dailyGoal, setDailyGoal] = useState(stats.dailyGoal.toString());
  const [autoAdvance, setAutoAdvance] = useState("700");
  const [soundEnabled, setSoundEnabled] = useState("true");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());

  const { toast } = useToast();

  const handleSaveGeminiKey = () => {
    saveStoredGeminiKey(geminiKey);
    toast({
      title: "Gemini API Key Saved ✨",
      description: "Your free Google Gemini API key has been stored locally.",
      type: "success",
    });
  };

  const handleGoalChange = (val: string) => {
    setDailyGoal(val);
    const num = parseInt(val, 10);
    const updated = { ...stats, dailyGoal: num };
    storage.saveStats(updated);
    onUpdateStats(updated);
    toast({
      title: "Daily Goal Updated",
      description: `Target set to ${num} questions per day.`,
      type: "success",
    });
  };

  const handleResetData = () => {
    localStorage.clear();
    const freshStats = storage.getStats();
    onUpdateStats(freshStats);
    setResetModalOpen(false);
    toast({
      title: "Data Reset Complete",
      description: "Progress, XP, and mistakes have been reset.",
      type: "info",
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4 select-none pb-12">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Settings className="h-3.5 w-3.5" /> App Preferences
        </span>
        <h2 className="text-3xl font-black text-foreground tracking-tight mt-1">
          Settings & Preferences
        </h2>
        <p className="text-xs text-muted-foreground">
          Configure your daily targets, theme appearance, and learning preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Daily Goal Target */}
        <div className="flex items-center justify-between rounded-[22px] border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              <span className="text-base font-bold text-foreground">Daily Practice Goal</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Target number of questions to answer per day to maintain your streak
            </p>
          </div>

          <div className="w-44">
            <Select
              value={dailyGoal}
              onChange={handleGoalChange}
              options={[
                { value: "5", label: "5 Questions (Casual)" },
                { value: "10", label: "10 Questions (Regular)" },
                { value: "15", label: "15 Questions (Master)" },
                { value: "25", label: "25 Questions (Intense)" },
              ]}
            />
          </div>
        </div>

        {/* Theme Preference */}
        <div className="flex items-center justify-between rounded-[22px] border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
              <span className="text-base font-bold text-foreground">Appearance Theme</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Switch between Light Mode and Dark Mode interface
            </p>
          </div>

          <div className="w-44">
            <Select
              value={theme || "light"}
              onChange={(val) => setTheme(val)}
              options={[
                { value: "light", label: "☀️ Light Mode" },
                { value: "dark", label: "🌙 Dark Mode" },
                { value: "system", label: "💻 System Default" },
              ]}
            />
          </div>
        </div>

        {/* Auto Advance Speed */}
        <div className="flex items-center justify-between rounded-[22px] border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <span className="text-base font-bold text-foreground">Auto-Advance Delay</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Delay before moving to next question after correct answer
            </p>
          </div>

          <div className="w-44">
            <Select
              value={autoAdvance}
              onChange={setAutoAdvance}
              options={[
                { value: "500", label: "500ms (Fast)" },
                { value: "700", label: "700ms (Recommended)" },
                { value: "1200", label: "1200ms (Relaxed)" },
              ]}
            />
          </div>
        </div>

        {/* Sound Feedback */}
        <div className="flex items-center justify-between rounded-[22px] border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-emerald-500" />
              <span className="text-base font-bold text-foreground">Audio Sound Effects</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Enable celebration audio and feedback chimes
            </p>
          </div>

          <div className="w-44">
            <Select
              value={soundEnabled}
              onChange={setSoundEnabled}
              options={[
                { value: "true", label: "🔊 Audio Enabled" },
                { value: "false", label: "🔇 Muted" },
              ]}
            />
          </div>
        </div>

        {/* Google Gemini AI Settings */}
        <div className="rounded-[22px] border border-purple-500/30 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-blue-500/5 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-base font-bold text-foreground">Google Gemini AI Tutor API</span>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  Free Tier
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your free Gemini API Key from Google AI Studio to power real-time AI explanations and chat tutor.
              </p>
            </div>

            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors shrink-0"
            >
              Get Free Key ↗
            </a>
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Paste Google Gemini API Key)"
              className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-xs font-semibold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              type="button"
              onClick={handleSaveGeminiKey}
              className="rounded-2xl bg-purple-600 px-5 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/20"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-[22px] border border-rose-500/30 bg-rose-500/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 block">
                Reset All Learning Progress
              </span>
              <p className="text-xs text-muted-foreground">
                Clears XP, streak counters, saved mistakes, and local storage data
              </p>
            </div>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Morphing Modal */}
      <MorphingModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        title="Confirm Data Reset"
      >
        <div className="space-y-5 pt-2 text-center">
          <div className="rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 p-4 text-rose-700 dark:text-rose-300 text-xs font-bold leading-relaxed">
            ⚠️ Warning: This will permanently delete your practice streak, earned XP, saved mistakes, and custom settings.
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Are you sure you want to reset all progress? This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="inline-flex h-11 items-center rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-6 text-xs font-extrabold text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </MorphingModal>
    </div>
  );
}

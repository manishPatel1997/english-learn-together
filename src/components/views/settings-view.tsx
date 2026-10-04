"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Settings, Target, Volume2, Clock, Trash2, Moon, Sun, Sparkles } from "lucide-react";
import { Select } from "@/components/beui/select";
import { MorphingModal } from "@/components/beui/morphing-modal";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type UserStats } from "@/lib/storage";
import { getStoredGeminiKey, saveStoredGeminiKey } from "@/lib/gemini-client";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

interface SettingsViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export function SettingsView({ stats, onUpdateStats }: SettingsViewProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(stats.dailyGoal.toString());
  const [autoAdvance, setAutoAdvance] = useState("700");
  const [soundEnabled, setSoundEnabled] = useState("true");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());

  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      apiClient.settings
        .getSettings()
        .then((res) => {
          if (res.success && res.settings) {
            if (res.settings.dailyGoal) setDailyGoal(res.settings.dailyGoal.toString());
            if (res.settings.autoAdvanceMs) setAutoAdvance(res.settings.autoAdvanceMs.toString());
            if (res.settings.soundEnabled !== undefined) setSoundEnabled(res.settings.soundEnabled ? "true" : "false");
            if (res.settings.geminiKey) {
              setGeminiKey(res.settings.geminiKey);
              saveStoredGeminiKey(res.settings.geminiKey);
            }
          }
        })
        .catch(() => {});
    }
  }, [isLoggedIn]);

  const handleSaveGeminiKey = async () => {
    saveStoredGeminiKey(geminiKey);
    if (isLoggedIn) {
      try {
        await apiClient.settings.saveSettings({ geminiKey });
      } catch (e) {}
    }
    toast({
      title: "Gemini API Key Saved ✨",
      description: "Your free Google Gemini API key has been stored locally and synced to your cloud profile.",
      type: "success",
    });
  };

  const handleGoalChange = async (val: string) => {
    setDailyGoal(val);
    const num = parseInt(val, 10);
    const updated = { ...stats, dailyGoal: num };
    storage.saveStats(updated);
    onUpdateStats(updated);

    if (isLoggedIn) {
      try {
        await apiClient.settings.saveSettings({ dailyGoal: num });
      } catch (e) {}
    }

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
    <div className="space-y-7 w-full max-w-5xl mx-auto select-none pb-12">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-white pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212]">
          <Settings className="h-3.5 w-3.5 stroke-[2.5]" /> App Preferences
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2">
          Settings & Preferences
        </h2>
        <p className="text-xs font-bold text-muted-foreground">
          Configure your daily targets, theme appearance, and learning preferences.
        </p>
      </div>

      <div className="space-y-5">
        {/* Daily Goal Target */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#FF6B00] stroke-[2.5]" />
              <span className="text-sm font-black uppercase text-foreground">Daily Practice Goal</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              Target number of questions to answer per day to maintain your streak
            </p>
          </div>

          <div className="w-full sm:w-52">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {resolvedTheme === "dark" ? <Moon className="h-5 w-5 text-yellow-400 stroke-[2.5]" /> : <Sun className="h-5 w-5 text-black stroke-[2.5]" />}
              <span className="text-sm font-black uppercase text-foreground">Appearance Theme</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              Switch between Light Mode and Dark Mode interface
            </p>
          </div>

          <div className="w-full sm:w-52">
            <Select
              value={theme || "system"}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-black dark:text-white stroke-[2.5]" />
              <span className="text-sm font-black uppercase text-foreground">Auto-Advance Delay</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              Delay before moving to next question after correct answer
            </p>
          </div>

          <div className="w-full sm:w-52">
            <Select
              value={autoAdvance}
              onChange={setAutoAdvance}
              options={[
                { value: "500", label: "500ms (Fast)" },
                { value: "700", label: "700ms (Normal)" },
                { value: "1200", label: "1200ms (Relaxed)" },
              ]}
            />
          </div>
        </div>

        {/* Sound Feedback */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-[#22C55E] stroke-[2.5]" />
              <span className="text-sm font-black uppercase text-foreground">Audio Sound Effects</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              Enable celebration audio and feedback chimes
            </p>
          </div>

          <div className="w-full sm:w-52">
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
        <div className="rounded-[4px] border-2 border-black dark:border-white bg-[#FFFDE6] dark:bg-zinc-900 p-5 sm:p-6 space-y-4 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 dark:border-white/10 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#FF6B00] stroke-[2.5]" />
                <span className="text-sm font-black uppercase text-foreground">Google Gemini AI Tutor API</span>
                <span className="rounded-[2px] border border-black bg-[#FFE600] px-1.5 py-0.2 text-[9px] font-black uppercase text-black">
                  Free Tier
                </span>
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                Enter your free Gemini API Key from Google AI Studio to power real-time AI explanations and chat tutor.
              </p>
            </div>

            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-3 text-xs font-black uppercase text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] transition-colors shrink-0"
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
              className="flex-1 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-3.5 py-2 text-xs font-bold outline-none shadow-[2px_2px_0px_#121212]"
            />
            <button
              type="button"
              onClick={handleSaveGeminiKey}
              className="inline-flex items-center justify-center min-h-[44px] rounded-[3px] border-2 border-black bg-[#FFE600] px-4 text-xs font-black uppercase text-black hover:bg-[#FACC15] shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-[4px] border-2 border-black bg-[#FFEAEA] dark:bg-rose-950/60 p-5 space-y-4 shadow-[4px_4px_0px_#121212]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-sm font-black uppercase text-[#FF4D4D] block">
                Reset All Learning Progress
              </span>
              <p className="text-xs font-bold text-muted-foreground">
                Clears XP, streak counters, saved mistakes, and local storage data
              </p>
            </div>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FF4D4D] px-4 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" /> Reset Data
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
        <div className="space-y-5 pt-2 text-center select-none">
          <div className="rounded-[4px] bg-[#FFEAEA] border-2 border-black p-4 text-black text-xs font-black uppercase leading-relaxed shadow-[3px_3px_0px_#121212]">
            ⚠️ Warning: This will permanently delete your practice streak, earned XP, saved mistakes, and custom settings.
          </div>
          <p className="text-sm font-bold text-foreground">
            Are you sure you want to reset all progress? This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="inline-flex h-10 items-center rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-5 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_#121212] hover:bg-neutral-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex h-10 items-center justify-center rounded-[3px] border-2 border-black bg-[#FF4D4D] text-white font-black uppercase text-xs px-5 shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </MorphingModal>
    </div>
  );
}

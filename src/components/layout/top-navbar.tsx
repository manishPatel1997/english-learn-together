"use client";

import React, { useState } from "react";
import { Search, Bell, Sparkles, User, Check, Flame, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/beui/theme-toggle";
import { Drawer } from "@/components/beui/drawer";
import { type NavItem } from "@/components/beui/bounce-sidebar";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  currentNav: NavItem;
  onOpenCommandPalette: () => void;
  onOpenAiTutor?: () => void;
  onToggleMobileMenu?: () => void;
}

export function TopNavbar({
  currentNav,
  onOpenCommandPalette,
  onOpenAiTutor,
  onToggleMobileMenu,
}: TopNavbarProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
          navigator.userAgent.includes("Mac")
      );
    }
  }, []);

  const moduleTitles: Record<NavItem, { title: string; desc: string }> = {
    dashboard: { title: "Home Dashboard", desc: "Welcome back! Ready to master Gujarati today?" },
    vocabulary: { title: "Vocabulary Practice", desc: "Practice Gujarati to English word spellings" },
    sentence: { title: "Sentence Practice", desc: "Practice Gujarati sentence translation and grammar" },
    "sentence-reading": { title: "Sentence Reading AI", desc: "Listen, read aloud, and breakdown Gujarati sentence phonetics" },
    mixed: { title: "Mixed Practice Mode", desc: "Randomized vocabulary and sentence challenges" },
    progress: { title: "Analytics & Progress", desc: "Track your learning curves, accuracy, and practice streaks" },
    mistakes: { title: "Mistakes Review", desc: "Turn your past errors into solid knowledge" },
    favorites: { title: "Saved Favorites", desc: "Your personal collection of bookmarked words & sentences" },
    settings: { title: "App Settings", desc: "Customize daily goals, audio feedback, and preferences" },
  };

  const currentModule = moduleTitles[currentNav] || moduleTitles.dashboard;

  const notifications = [
    { id: 1, title: "5 Day Streak Achieved!", desc: "You earned +50 Bonus XP for practicing 5 days in a row.", time: "10m ago", icon: Flame, color: "text-amber-500" },
    { id: 2, title: "New Vocabulary Mastered", desc: "You completed 25 words with 95% accuracy.", time: "2h ago", icon: Check, color: "text-emerald-500" },
    { id: 3, title: "Daily Practice Reminder", desc: "You need 6 more correct answers to reach today's goal.", time: "5h ago", icon: Sparkles, color: "text-indigo-500" },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-3 sm:px-6 backdrop-blur-md gap-2">
      {/* Left Section: Mobile Menu Toggle & Current Module Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors lg:hidden shrink-0 shadow-xs"
            aria-label="Open Navigation Drawer"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-foreground truncate">
            {currentModule.title}
          </h1>
          <p className="hidden md:block text-[11px] font-medium text-muted-foreground truncate">
            {currentModule.desc}
          </p>
        </div>
      </div>

      {/* Center: Command Palette Trigger Search */}
      <div className="flex-1 max-w-md mx-1 sm:mx-4">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Open search & command palette (Ctrl+K or /)"
          className="flex h-9 sm:h-10 w-full items-center justify-between rounded-full border border-border bg-muted/50 px-3 sm:px-4 text-xs text-muted-foreground hover:bg-muted hover:border-indigo-500/50 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
            <span className="truncate hidden sm:inline">Search Gujarati words, sentences...</span>
            <span className="truncate sm:hidden text-[11px]">Search...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <kbd className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-foreground shadow-xs">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
            <kbd className="inline-flex items-center justify-center rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground shadow-xs">
              /
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {onOpenAiTutor && (
          <button
            type="button"
            onClick={onOpenAiTutor}
            className="flex h-9 items-center gap-1 sm:gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 sm:px-3.5 text-xs font-extrabold text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
            title="Ask AI Tutor"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        )}

        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setNotificationOpen(true)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        {/* Profile Avatar Trigger */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-card p-1 sm:pr-3 hover:bg-muted transition-colors"
          title="Profile settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs shadow-sm">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden md:inline-block text-xs font-bold text-foreground">
            Gujarati Master
          </span>
        </button>
      </div>

      <Drawer open={notificationOpen} onOpenChange={setNotificationOpen} title="Notifications & Activity" side="right">
        <div className="space-y-3 pt-2">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors shadow-sm">
                <div className={cn("mt-0.5 rounded-full p-2.5 bg-white dark:bg-slate-800 shadow-xs", n.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">{n.title}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Drawer>

      {/* Profile Drawer */}
      <Drawer open={profileOpen} onOpenChange={setProfileOpen} title="User Profile" side="right">
        <div className="space-y-6 pt-2 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-2xl shadow-xl mb-3">
              GM
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Gujarati Learner</h3>
            <p className="text-xs font-medium text-muted-foreground">Pro Master Tier • Member since 2026</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground block">Target Language</span>
              <span className="text-sm font-bold text-foreground">Gujarati → English</span>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground block">Mastery Level</span>
              <span className="text-sm font-bold text-indigo-500">Intermediate B2</span>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}


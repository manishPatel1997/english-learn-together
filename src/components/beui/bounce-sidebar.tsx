"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Shuffle,
  BarChart3,
  AlertCircle,
  Star,
  Settings,
  Flame,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Volume2,
} from "lucide-react";
import { TodaysGoalCard } from "./todays-goal-card";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/storage";

export type NavItem =
  | "dashboard"
  | "vocabulary"
  | "sentence"
  | "sentence-reading"
  | "mixed"
  | "progress"
  | "mistakes"
  | "favorites"
  | "settings";

interface BounceSidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  streak: number;
  xp: number;
  accuracy: number;
  todayCompleted: number;
  dailyGoal: number;
}

export function BounceSidebar({
  currentNav,
  onNavigate,
  streak,
  xp,
  accuracy,
  todayCompleted,
  dailyGoal,
}: BounceSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
          navigator.userAgent.includes("Mac")
      );
    }
  }, []);

  React.useEffect(() => {
    // Update mistake count dynamically from storage
    const updateCount = () => {
      const list = storage.getMistakes();
      setMistakesCount(list.length);
    };

    updateCount();
    window.addEventListener("focus", updateCount);
    return () => window.removeEventListener("focus", updateCount);
  }, [currentNav]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "1" },
    { id: "vocabulary", label: "Vocabulary Practice", icon: BookOpen, shortcut: "2" },
    { id: "sentence", label: "Sentence Practice", icon: MessageSquare, shortcut: "3" },
    { id: "sentence-reading", label: "Sentence Reading AI", icon: Volume2, badge: "AI", shortcut: "4" },
    { id: "mixed", label: "Mixed Practice", icon: Shuffle, shortcut: "5" },
    { id: "progress", label: "Progress", icon: BarChart3, shortcut: "6" },
    { id: "mistakes", label: "Mistakes", icon: AlertCircle, badge: mistakesCount > 0 ? String(mistakesCount) : undefined, shortcut: "7" },
    { id: "favorites", label: "Favorites", icon: Star, shortcut: "8" },
    { id: "settings", label: "Settings", icon: Settings, shortcut: "9" },
  ];

  const goalPercentage = Math.min(100, Math.round((todayCompleted / dailyGoal) * 100));

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="relative flex flex-col h-screen border-r border-border bg-card text-card-foreground select-none z-30 shrink-0 shadow-sm"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col truncate"
            >
              <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Gujarati English
              </span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Master SaaS
              </span>
            </motion.div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id as NavItem)}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              title={`Go to ${item.label} (${isMac ? `⌘${item.shortcut}` : `Ctrl+${item.shortcut}`})`}
              className={cn(
                "relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors outline-none group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-indigo-500/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bounce-active-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-primary -z-10"
                />
              )}

              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                    isActive ? "bg-white/20 text-white" : "bg-destructive/15 text-destructive"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {!collapsed && item.shortcut && (
                <kbd
                  className={cn(
                    "hidden xl:inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold transition-opacity",
                    isActive
                      ? "bg-white/20 text-white"
                      : "border border-border bg-background text-muted-foreground opacity-60 group-hover:opacity-100"
                  )}
                >
                  {isMac ? `⌘${item.shortcut}` : `Ctrl+${item.shortcut}`}
                </kbd>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Section Widget */}
      <div className="m-3">
        <TodaysGoalCard
          streak={streak}
          xp={xp}
          accuracy={accuracy}
          todayCompleted={todayCompleted}
          dailyGoal={dailyGoal}
          onClick={() => onNavigate("progress")}
          variant={collapsed ? "compact" : "default"}
        />
      </div>
    </motion.aside>
  );
}

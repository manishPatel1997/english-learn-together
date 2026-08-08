"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Volume2,
  X,
  ShieldCheck,
} from "lucide-react";
import { TodaysGoalCard } from "./todays-goal-card";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { useAuth } from "@/context/auth-context";

export type NavItem =
  | "dashboard"
  | "vocabulary"
  | "sentence"
  | "sentence-reading"
  | "mixed"
  | "progress"
  | "mistakes"
  | "favorites"
  | "settings"
  | "admin";

interface BounceSidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  streak: number;
  xp: number;
  accuracy: number;
  todayCompleted: number;
  dailyGoal: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function BounceSidebar({
  currentNav,
  onNavigate,
  streak,
  xp,
  accuracy,
  todayCompleted,
  dailyGoal,
  collapsed: propCollapsed,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}: BounceSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
          navigator.userAgent.includes("Mac")
      );
    }
  }, []);

  useEffect(() => {
    // Update mistake count dynamically from storage
    const updateCount = () => {
      const list = storage.getMistakes();
      setMistakesCount(list.length);
    };

    updateCount();
    window.addEventListener("focus", updateCount);
    return () => window.removeEventListener("focus", updateCount);
  }, [currentNav]);

  const { user } = useAuth();

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
    ...(user?.role === "admin"
      ? [{ id: "admin", label: "Admin Panel", icon: ShieldCheck, badge: "Admin", shortcut: "0" }]
      : []),
  ];

  return (
    <motion.aside
      animate={{ width: isMobile ? "100%" : collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={cn(
        "relative flex flex-col h-full border-r border-border bg-card text-card-foreground select-none z-30 shrink-0 shadow-sm overflow-hidden",
        isMobile ? "w-full" : "h-screen"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          {(!collapsed || isMobile) && (
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

        {/* Action Toggle Button */}
        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Close navigation drawer"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background hover:bg-muted text-muted-foreground transition-colors shadow-xs"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id as NavItem)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              title={`${item.label} (${isMac ? `⌘${item.shortcut}` : `Ctrl+${item.shortcut}`})`}
              className={cn(
                "relative flex w-full items-center rounded-xl py-3 text-sm font-medium transition-colors outline-none group",
                collapsed && !isMobile ? "justify-center px-0" : "gap-3.5 px-3.5",
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

              <div className="relative flex items-center justify-center shrink-0">
                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {collapsed && !isMobile && item.badge && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </div>

              {(!collapsed || isMobile) && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {(!collapsed || isMobile) && item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                    isActive ? "bg-white/20 text-white" : "bg-destructive/15 text-destructive"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {(!collapsed || isMobile) && item.shortcut && (
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
      <div className="p-3 shrink-0 border-t border-border/50">
        <TodaysGoalCard
          streak={streak}
          xp={xp}
          accuracy={accuracy}
          todayCompleted={todayCompleted}
          dailyGoal={dailyGoal}
          onClick={() => onNavigate("progress")}
          variant={collapsed && !isMobile ? "compact" : "default"}
        />
      </div>
    </motion.aside>
  );
}


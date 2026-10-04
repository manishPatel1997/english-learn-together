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
import { ThemeToggle } from "./theme-toggle";
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
    { id: "progress", label: "Progress & Stats", icon: BarChart3, shortcut: "6" },
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
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      className={cn(
        "relative flex flex-col h-full border-r-[2.5px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] text-card-foreground select-none z-30 shrink-0 overflow-hidden",
        isMobile ? "w-full" : "h-screen"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b-[2.5px] border-black dark:border-white shrink-0 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff]">
            <GraduationCap className="h-5 w-5 stroke-[2.5]" />
          </div>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex flex-col truncate"
            >
              <span className="text-sm font-black tracking-tight text-foreground uppercase">
                Gujarati English
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Neo Master
              </span>
            </motion.div>
          )}
        </div>

        {/* Action Toggle Button */}
        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X className="h-5 w-5 stroke-[3]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-7 w-7 items-center justify-center rounded-[3px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4 stroke-[3]" /> : <ChevronLeft className="h-4 w-4 stroke-[3]" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavItem)}
              title={`${item.label} (${isMac ? `⌘${item.shortcut}` : `Ctrl+${item.shortcut}`})`}
              className={cn(
                "relative flex w-full items-center rounded-[4px] py-2.5 text-xs font-bold transition-all outline-none cursor-pointer",
                collapsed && !isMobile ? "justify-center px-0" : "gap-3 px-3",
                isActive
                  ? "border-[2.5px] border-black dark:border-white bg-[#FFE600] text-black font-black shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] translate-x-0"
                  : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[3px_3px_0px_#121212] dark:hover:shadow-[3px_3px_0px_#ffffff]"
              )}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <Icon className={cn("h-4.5 w-4.5 stroke-[2.5]", isActive ? "text-black" : "text-foreground")} />
                {collapsed && !isMobile && item.badge && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 border border-black bg-[#FF4D4D]" />
                )}
              </div>

              {(!collapsed || isMobile) && (
                <span className="truncate flex-1 text-left tracking-tight font-extrabold">{item.label}</span>
              )}

              {(!collapsed || isMobile) && item.badge && (
                <span
                  className={cn(
                    "rounded-[2px] border-2 border-black px-1.5 py-0.2 text-[9px] font-black uppercase shadow-[1.5px_1.5px_0px_#121212]",
                    isActive ? "bg-black text-white" : "bg-[#FF4D4D] text-white"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {(!collapsed || isMobile) && item.shortcut && (
                <kbd
                  className={cn(
                    "hidden xl:inline-flex items-center rounded-[2px] border-2 border-black px-1 py-0.2 text-[9px] font-black shadow-[1px_1px_0px_#121212]",
                    isActive
                      ? "bg-white text-black"
                      : "bg-white dark:bg-black text-foreground"
                  )}
                >
                  {isMac ? `⌘${item.shortcut}` : `Ctrl+${item.shortcut}`}
                </kbd>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section Widget */}
      <div className="p-3 shrink-0 border-t-[2.5px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] space-y-2">
        {isMobile && (
          <div className="flex items-center justify-between p-2 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]">
            <span className="text-xs font-black uppercase text-foreground">Theme Mode</span>
            <ThemeToggle />
          </div>
        )}
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

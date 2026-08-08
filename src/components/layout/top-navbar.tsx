"use client";

import React, { useState } from "react";
import { Search, Bell, Sparkles, User, Check, Flame, Menu, Unlock, CheckCheck } from "lucide-react";
import { ThemeToggle } from "@/components/beui/theme-toggle";
import { Drawer } from "@/components/beui/drawer";
import { type NavItem } from "@/components/beui/bounce-sidebar";
import { cn } from "@/lib/utils";
import { apiClient, AppNotification } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";
import { LogIn, LogOut, ShieldCheck, UserCheck } from "lucide-react";

interface TopNavbarProps {
  currentNav: NavItem;
  onOpenCommandPalette: () => void;
  onOpenAiTutor?: () => void;
  onToggleMobileMenu?: () => void;
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const { user, isLoggedIn, logout, openAuthModal } = useAuth();

  const fetchNotifications = React.useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }
    try {
      setLoadingNotifs(true);
      const res = await apiClient.notifications.getUnread();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await apiClient.notifications.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications([]);
    try {
      await apiClient.notifications.markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

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
    admin: { title: "Admin Panel & Module Unlocking", desc: "View all user performance metrics and configure module permissions" },
  };

  const currentModule = moduleTitles[currentNav] || moduleTitles.dashboard;

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
          onClick={() => {
            setNotificationOpen(true);
            fetchNotifications();
          }}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <>
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-extrabold text-white shadow-sm animate-pulse">
                {notifications.length}
              </span>
            </>
          )}
        </button>

        {/* Auth / Profile Trigger */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 p-1 sm:pr-3 hover:bg-indigo-500/20 transition-colors"
            title="Profile settings"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span className="hidden md:inline-block text-xs font-bold text-foreground">
              {user?.name || "User"}
            </span>
            {user?.role === "admin" && (
              <span className="hidden sm:inline-block rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-600 dark:text-amber-400">
                ADMIN
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="flex h-9 items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-xs"
          >
            <LogIn className="h-3.5 w-3.5" /> Sign In
          </button>
        )}
      </div>

      <Drawer open={notificationOpen} onOpenChange={setNotificationOpen} title="Notifications & Activity" side="right">
        <div className="space-y-3 pt-2">
          {notifications.length > 0 && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {notifications.length} Unread {notifications.length === 1 ? "Notification" : "Notifications"}
              </span>
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 dark:text-slate-400 space-y-2.5">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800/80 p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                <Bell className="h-6 w-6 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">No unread notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                You are all caught up! Notifications marked as read are archived automatically.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3.5 bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-xs"
              >
                <div className="mt-0.5 rounded-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex items-center justify-center shrink-0">
                  {n.type === "module_unlock" ? (
                    <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : n.type === "achievement" ? (
                    <Flame className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="pt-1.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <Check className="h-3 w-3" /> Mark as read
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Profile Drawer */}
      <Drawer open={profileOpen} onOpenChange={setProfileOpen} title="User Account Profile" side="right">
        <div className="space-y-6 pt-2">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-2xl shadow-xl mb-3">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-1.5">
              {user?.name || "Gujarati Learner"}
              {user?.role === "admin" && <ShieldCheck className="h-4 w-4 text-amber-500" />}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <UserCheck className="h-3.5 w-3.5" />
              Role: <span className="uppercase">{user?.role || "USER"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground block">Unlocked Sections</span>
              <span className="text-sm font-bold text-foreground">
                {user?.unlockedSections ? `${user.unlockedSections.length} Sections` : "Section 1"}
              </span>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground block">Total Earned XP</span>
              <span className="text-sm font-bold text-indigo-500">⚡ {user?.xp || 0} XP</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                logout();
                setProfileOpen(false);
              }}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs hover:bg-rose-500/20 transition-all shadow-xs"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </Drawer>
    </header>
  );
}


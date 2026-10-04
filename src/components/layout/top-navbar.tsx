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

export interface ModuleTitleConfig {
  desktopTitle: string;
  mobileTitle: string;
  desc: string;
}

export const MODULE_NAV_TITLES: Record<NavItem, ModuleTitleConfig> = {
  dashboard: {
    desktopTitle: "DASHBOARD",
    mobileTitle: "DASHBOARD",
    desc: "Ready to master Gujarati today?",
  },
  vocabulary: {
    desktopTitle: "VOCABULARY PRACTICE",
    mobileTitle: "VOCABULARY",
    desc: "Practice Gujarati to English word spellings",
  },
  sentence: {
    desktopTitle: "SENTENCE PRACTICE",
    mobileTitle: "SENTENCES",
    desc: "Practice Gujarati sentence translation and grammar",
  },
  "sentence-reading": {
    desktopTitle: "SENTENCE READING AI",
    mobileTitle: "READING AI",
    desc: "Listen, read aloud, and breakdown Gujarati sentence phonetics",
  },
  mixed: {
    desktopTitle: "MIXED PRACTICE MODE",
    mobileTitle: "MIXED",
    desc: "Randomized vocabulary and sentence challenges",
  },
  progress: {
    desktopTitle: "PROGRESS & ANALYTICS",
    mobileTitle: "PROGRESS",
    desc: "Track your learning curves, accuracy, and practice streaks",
  },
  mistakes: {
    desktopTitle: "MISTAKES REVIEW",
    mobileTitle: "MISTAKES",
    desc: "Turn your past errors into solid knowledge",
  },
  favorites: {
    desktopTitle: "SAVED FAVORITES & FLASHCARDS",
    mobileTitle: "FAVORITES",
    desc: "Your personal collection of bookmarked words & sentences",
  },
  settings: {
    desktopTitle: "SETTINGS & PREFERENCES",
    mobileTitle: "SETTINGS",
    desc: "Customize daily goals, audio feedback, and preferences",
  },
  admin: {
    desktopTitle: "ADMIN PANEL & MODULE UNLOCKING",
    mobileTitle: "ADMIN",
    desc: "View all user performance metrics and configure module permissions",
  },
};

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

  const currentModule = MODULE_NAV_TITLES[currentNav] || MODULE_NAV_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b-[2.5px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] px-2.5 sm:px-6 gap-1.5 sm:gap-2 select-none shadow-[0px_3px_0px_#121212] dark:shadow-[0px_3px_0px_#ffffff]">
      {/* Left Section: Mobile Menu Toggle & Current Module Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#121212] dark:hover:shadow-[3px_3px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:hidden shrink-0 cursor-pointer transition-all"
            aria-label="Open Navigation Drawer"
            title="Open Menu"
          >
            <Menu className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}

        <div className="flex flex-col min-w-0 flex-1 sm:flex-initial justify-center">
          <h1 className="text-[13px] sm:text-base font-black tracking-tight text-foreground uppercase truncate sm:whitespace-normal">
            <span className="inline sm:hidden">{currentModule.mobileTitle}</span>
            <span className="hidden sm:inline">{currentModule.desktopTitle}</span>
          </h1>
          <p className="hidden md:block text-[11px] font-bold text-muted-foreground truncate">
            {currentModule.desc}
          </p>
        </div>
      </div>

      {/* Center: Command Palette Trigger Search */}
      <div className="shrink-0 sm:flex-1 sm:max-w-md sm:mx-4 flex justify-end sm:justify-stretch">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Open search & command palette (Ctrl+K or /)"
          className="flex h-10 sm:h-10 items-center justify-center sm:justify-between rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 px-2.5 sm:px-4 text-xs font-bold text-muted-foreground hover:text-foreground shadow-[2px_2px_0px_#121212] sm:shadow-[3px_3px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#121212] transition-all min-h-[44px] sm:min-h-0 min-w-[44px] sm:w-full group cursor-pointer shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="h-4 w-4 shrink-0 text-black dark:text-white stroke-[2.5]" />
            <span className="truncate hidden md:inline text-foreground font-bold">Search Gujarati words, sentences...</span>
            <span className="truncate hidden sm:inline md:hidden text-[11px] text-foreground font-bold">Search...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <kbd className="inline-flex items-center gap-0.5 rounded-[2px] border-2 border-black dark:border-white bg-[#FFE600] px-1.5 py-0.2 text-[10px] font-black text-black shadow-[1px_1px_0px_#121212]">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
            <kbd className="inline-flex items-center justify-center rounded-[2px] border-2 border-black dark:border-white bg-white px-1.5 py-0.2 text-[10px] font-black text-black shadow-[1px_1px_0px_#121212]">
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
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FF6B00] px-2.5 sm:px-3 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#121212] dark:hover:shadow-[4px_4px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#121212] dark:active:shadow-[1px_1px_0px_#ffffff] transition-all cursor-pointer min-h-[40px]"
            title="Ask AI Tutor"
          >
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>
        )}

        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => {
            setNotificationOpen(true);
            fetchNotifications();
          }}
          className="relative flex h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:bg-[#FFE600] dark:hover:bg-zinc-700 hover:text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#121212] dark:hover:shadow-[3px_3px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4 stroke-[2.5]" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-[2px] border border-black bg-[#FF4D4D] px-1 text-[9px] font-black text-white shadow-[1px_1px_0px_#121212]">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Auth / Profile Trigger */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-[4px] border-2 border-black dark:border-white bg-[#FFE600] p-1.5 sm:pr-3 text-black shadow-[2px_2px_0px_#121212] sm:shadow-[3px_3px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#121212] dark:hover:shadow-[4px_4px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#121212] dark:active:shadow-[1px_1px_0px_#ffffff] transition-all cursor-pointer min-h-[44px]"
            title="Profile settings"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-black bg-black text-white font-black text-xs">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span className="hidden md:inline-block text-xs font-black">
              {user?.name || "User"}
            </span>
            {user?.role === "admin" && (
              <span className="hidden lg:inline-block rounded-[2px] border border-black bg-[#FF4D4D] px-1 py-0.2 text-[9px] font-black text-white">
                ADMIN
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="flex h-10 sm:h-9 min-h-[44px] items-center gap-1.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FFE600] px-2.5 sm:px-3 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212] sm:shadow-[3px_3px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#121212] dark:hover:shadow-[4px_4px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#121212] dark:active:shadow-[1px_1px_0px_#ffffff] transition-all cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5 stroke-[2.5]" /> <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
      {/* Notifications Drawer */}
      <Drawer open={notificationOpen} onOpenChange={setNotificationOpen} title="Notifications & Activity" side="right">
        <div className="space-y-3 pt-2">
          {notifications.length > 0 && (
            <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-white">
              <span className="text-xs font-black uppercase text-muted-foreground">
                {notifications.length} Unread {notifications.length === 1 ? "Notification" : "Notifications"}
              </span>
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-black text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5 stroke-[3]" /> Mark all as read
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
              <div className="rounded-[4px] bg-white dark:bg-zinc-800 p-4 border-2 border-black dark:border-white shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff]">
                <Bell className="h-6 w-6 text-foreground stroke-[2.5]" />
              </div>
              <p className="text-sm font-black text-foreground uppercase">No unread notifications</p>
              <p className="text-xs font-bold text-muted-foreground max-w-xs">
                You are all caught up! Notifications marked as read are archived automatically.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-[4px] border-2 border-black dark:border-white p-3.5 bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff]"
              >
                <div className="mt-0.5 rounded-[2px] p-2 bg-[#FFE600] border-2 border-black text-black shadow-[1.5px_1.5px_0px_#121212] flex items-center justify-center shrink-0">
                  {n.type === "module_unlock" ? (
                    <Unlock className="h-4 w-4 stroke-[2.5]" />
                  ) : n.type === "achievement" ? (
                    <Flame className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <Sparkles className="h-4 w-4 stroke-[2.5]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-foreground truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground shrink-0">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                  <div className="pt-1.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] font-black text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3 stroke-[3]" /> Mark as read
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
            <div className="flex h-18 w-18 items-center justify-center rounded-[4px] border-2 border-black dark:border-white bg-[#FFE600] text-black font-black text-2xl shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] mb-3">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <h3 className="text-lg font-black text-foreground flex items-center gap-1.5 uppercase">
              {user?.name || "Gujarati Learner"}
              {user?.role === "admin" && <ShieldCheck className="h-4 w-4 text-[#FF6B00]" />}
            </h3>
            <p className="text-xs font-bold text-muted-foreground">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-white dark:bg-zinc-800 px-3 py-1 text-xs font-black text-foreground shadow-[2px_2px_0px_#121212]">
              <UserCheck className="h-3.5 w-3.5 stroke-[2.5]" />
              Role: <span className="uppercase text-[#FF6B00]">{user?.role || "USER"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-[4px] border-2 border-black dark:border-white p-3.5 bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#121212]">
              <span className="text-xs font-black uppercase text-muted-foreground block">Unlocked Sections</span>
              <span className="text-sm font-black text-foreground">
                {user?.unlockedSections ? `${user.unlockedSections.length} Sections` : "Section 1"}
              </span>
            </div>
            <div className="rounded-[4px] border-2 border-black dark:border-white p-3.5 bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#121212]">
              <span className="text-xs font-black uppercase text-muted-foreground block">Total XP</span>
              <span className="text-sm font-black text-[#FF6B00]">⚡ {user?.xp || 0} XP</span>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black dark:border-white">
            <button
              type="button"
              onClick={() => {
                logout();
                setProfileOpen(false);
              }}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-[4px] border-2 border-black dark:border-white bg-[#FF4D4D] text-white font-black text-xs uppercase shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4 stroke-[3]" /> Sign Out
            </button>
          </div>
        </div>
      </Drawer>
    </header>
  );
}

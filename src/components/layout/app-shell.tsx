"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BounceSidebar, type NavItem } from "@/components/beui/bounce-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/beui/command-palette";
import { PreviewRail } from "@/components/beui/preview-rail";
import { ToastProvider } from "@/components/beui/animated-toast-stack";
import { AITutorModal } from "@/components/beui/ai-tutor-modal";
import { storage, type UserStats } from "@/lib/storage";

export const NAV_ROUTES: Record<NavItem, string> = {
  dashboard: "/",
  vocabulary: "/vocabulary",
  sentence: "/sentence",
  "sentence-reading": "/sentence-reading",
  mixed: "/mixed",
  progress: "/progress",
  mistakes: "/mistakes",
  favorites: "/favorites",
  settings: "/settings",
};

export function getNavFromPathname(pathname: string): NavItem {
  if (pathname.startsWith("/vocabulary")) return "vocabulary";
  if (pathname.startsWith("/sentence-reading")) return "sentence-reading";
  if (pathname.startsWith("/sentence")) return "sentence";
  if (pathname.startsWith("/mixed")) return "mixed";
  if (pathname.startsWith("/progress")) return "progress";
  if (pathname.startsWith("/mistakes")) return "mistakes";
  if (pathname.startsWith("/favorites")) return "favorites";
  if (pathname.startsWith("/settings")) return "settings";
  return "dashboard";
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentNav = getNavFromPathname(pathname);
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  // Command palette & AI Tutor state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);

  // Preview rail state
  const [previewWord, setPreviewWord] = useState<any | null>(null);

  useEffect(() => {
    // Sync localStorage stats whenever pathname changes or client mounts
    setStats(storage.getStats());
  }, [pathname]);

  const handleNavigate = (nav: NavItem) => {
    const route = NAV_ROUTES[nav] || "/";
    router.push(route);
  };

  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const numMap: Record<string, NavItem> = {
          "1": "dashboard",
          "2": "vocabulary",
          "3": "sentence",
          "4": "sentence-reading",
          "5": "mixed",
          "6": "progress",
          "7": "mistakes",
          "8": "favorites",
          "9": "settings",
        };
        const digit = e.key >= "1" && e.key <= "9" ? e.key : e.code.replace("Digit", "").replace("Numpad", "");
        if (numMap[digit]) {
          e.preventDefault();
          handleNavigate(numMap[digit]);
          setCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [router]);

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* Left Bounce Sidebar */}
        <BounceSidebar
          currentNav={currentNav}
          onNavigate={handleNavigate}
          streak={stats.streak}
          xp={stats.xp}
          accuracy={stats.accuracy}
          todayCompleted={stats.todayCompleted}
          dailyGoal={stats.dailyGoal}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <TopNavbar
            currentNav={currentNav}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenAiTutor={() => setAiTutorOpen(true)}
          />

          {/* Scrollable View Container */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            {children}
          </main>
        </div>

        {/* Command Palette Modal */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigate={handleNavigate}
          onSelectWord={(word) => setPreviewWord(word)}
        />

        {/* Gemini AI Tutor Modal */}
        <AITutorModal
          isOpen={aiTutorOpen}
          onClose={() => setAiTutorOpen(false)}
        />

        {/* Preview Rail */}
        <PreviewRail
          open={!!previewWord}
          onClose={() => setPreviewWord(null)}
          title={previewWord?.gujarati || "Word Preview"}
          categoryOrTopic={previewWord?.category}
          gujaratiText={previewWord?.gujarati}
          englishTranslation={previewWord?.english}
          phonetic={previewWord?.phonetic}
          exampleSentence={previewWord?.example}
        />
      </div>
    </ToastProvider>
  );
}

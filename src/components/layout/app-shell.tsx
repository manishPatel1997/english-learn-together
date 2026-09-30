"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BounceSidebar, type NavItem } from "@/components/beui/bounce-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/beui/command-palette";
import { PreviewRail } from "@/components/beui/preview-rail";
import { ToastProvider } from "@/components/beui/animated-toast-stack";
import { AITutorModal } from "@/components/beui/ai-tutor-modal";
import { storage, type UserStats } from "@/lib/storage";

import { ThemeLoader } from "@/components/beui/loader";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthLandingGate } from "@/components/auth/auth-landing-gate";

import { SmoothScrollContainer } from "@/components/beui/smooth-scroll";

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
  admin: "/admin",
};

export function getNavFromPathname(pathname: string): NavItem {
  if (pathname.startsWith("/admin")) return "admin";
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
  const { isLoggedIn, isLoading } = useAuth();

  const currentNav = getNavFromPathname(pathname);
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  // Sidebar collapse & mobile menu state
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Command palette & AI Tutor state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);

  // Preview rail state
  const [previewWord, setPreviewWord] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    // Sync localStorage stats whenever pathname changes or client mounts
    setStats(storage.getStats());
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavigate = (nav: NavItem) => {
    const route = NAV_ROUTES[nav] || "/";
    router.push(route);
    setMobileMenuOpen(false);
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

  if (isLoading) {
    return (
      <ThemeLoader
        variant="fullscreen"
        title="Verifying Account Authentication"
        subtitle="Syncing profile data, streak counters, and unlocked sections..."
        icon={<ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
      />
    );
  }

  if (!isLoggedIn) {
    return <AuthLandingGate />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* Desktop Sidebar (hidden on screens < lg) */}
        <div className="hidden lg:flex shrink-0">
          <BounceSidebar
            currentNav={currentNav}
            onNavigate={handleNavigate}
            streak={stats.streak}
            xp={stats.xp}
            accuracy={stats.accuracy}
            todayCompleted={stats.todayCompleted}
            dailyGoal={stats.dailyGoal}
            collapsed={collapsed}
            onToggleCollapse={handleToggleCollapse}
          />
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-card lg:hidden shadow-2xl"
              >
                <BounceSidebar
                  currentNav={currentNav}
                  onNavigate={handleNavigate}
                  streak={stats.streak}
                  xp={stats.xp}
                  accuracy={stats.accuracy}
                  todayCompleted={stats.todayCompleted}
                  dailyGoal={stats.dailyGoal}
                  collapsed={false}
                  isMobile={true}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Top Navbar */}
          <TopNavbar
            currentNav={currentNav}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenAiTutor={() => setAiTutorOpen(true)}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          />

          {/* Smooth Scrollable View Container */}
          <SmoothScrollContainer className="p-4 sm:p-6 lg:p-8">
            {children}
          </SmoothScrollContainer>
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


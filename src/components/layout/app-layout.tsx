"use client";

import React, { useState, useEffect } from "react";
import { BounceSidebar, type NavItem } from "@/components/beui/bounce-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/beui/command-palette";
import { PreviewRail } from "@/components/beui/preview-rail";
import { ToastProvider } from "@/components/beui/animated-toast-stack";
import { AITutorModal } from "@/components/beui/ai-tutor-modal";
import { storage, type UserStats } from "@/lib/storage";

// Import Views
import { DashboardView } from "@/components/views/dashboard-view";
import { PracticeSelectView } from "@/components/views/practice-select-view";
import { TopicSelectView } from "@/components/views/topic-select-view";
import { VocabularyPracticeView } from "@/components/views/vocabulary-practice-view";
import { SentencePracticeView } from "@/components/views/sentence-practice-view";
import { ResultView } from "@/components/views/result-view";
import { ProgressView } from "@/components/views/progress-view";
import { MistakesView } from "@/components/views/mistakes-view";
import { FavoritesView } from "@/components/views/favorites-view";
import { SettingsView } from "@/components/views/settings-view";

// Import Static JSON Data
import vocabularyData from "@/data/vocabulary.json";
import sentenceData from "@/data/sentences.json";

export function AppLayout() {
  const [currentNav, setCurrentNav] = useState<NavItem>("dashboard");
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  // Command palette & AI Tutor state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);

  // Practice session state
  const [practiceStep, setPracticeStep] = useState<"idle" | "topic_select" | "in_practice" | "result">("idle");
  const [activePracticeType, setActivePracticeType] = useState<"vocabulary" | "sentence" | "sentence-reading" | "mixed">("vocabulary");
  const [selectedTopicKeys, setSelectedTopicKeys] = useState<string[]>(["whose_section", "which_section"]);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);

  // Result summary state
  const [resultSummary, setResultSummary] = useState({
    score: 0,
    accuracy: 100,
    xp: 0,
    mistakes: [] as any[],
  });

  // Preview rail state
  const [previewWord, setPreviewWord] = useState<any | null>(null);

  useEffect(() => {
    // Sync localStorage stats after client mount
    setStats(storage.getStats());
  }, [currentNav, practiceStep]);

  const handleNavigate = (nav: NavItem) => {
    setCurrentNav(nav);
    setPracticeStep("idle");
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
  }, []);

  const handleStartPracticeChoice = (mode: "vocabulary" | "sentence" | "sentence-reading" | "mixed") => {
    if (mode === "sentence-reading") {
      handleNavigate("sentence-reading");
      return;
    }

    setActivePracticeType(mode);

    if (mode === "vocabulary") {
      setCurrentQuestions(vocabularyData);
      setPracticeStep("in_practice");
      setCurrentNav("vocabulary");
    } else if (mode === "sentence") {
      setPracticeStep("topic_select");
      setCurrentNav("sentence");
    } else if (mode === "mixed") {
      // Mix vocabulary and sentences
      const vocabItems = [...vocabularyData].map((v) => ({ ...v, type: "vocabulary" }));
      const sentenceItems = Object.values(sentenceData)
        .flat()
        .map((s: any) => ({ ...s, type: "sentence" }));
      const combined = [...vocabItems, ...sentenceItems].sort(() => 0.5 - Math.random());
      setCurrentQuestions(combined);
      setPracticeStep("in_practice");
      setCurrentNav("mixed");
    }
  };

  const handleStartSelectedSentenceTopics = (selectedKeys: string[]) => {
    setSelectedTopicKeys(selectedKeys);

    let questions: any[] = [];
    selectedKeys.forEach((key) => {
      const list = (sentenceData as any)[key] || [];
      questions = [...questions, ...list];
    });

    // Shuffle questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled);
    setPracticeStep("in_practice");
  };

  const handlePracticeComplete = (score: number, accuracy: number, xp: number, mistakes: any[]) => {
    setResultSummary({ score, accuracy, xp, mistakes });
    setPracticeStep("result");
    setStats(storage.getStats());
  };

  const renderMainContent = () => {
    // If we are in an active practice session
    if (practiceStep === "in_practice") {
      if (activePracticeType === "sentence") {
        return (
          <SentencePracticeView
            questions={currentQuestions}
            onComplete={handlePracticeComplete}
          />
        );
      } else {
        return (
          <VocabularyPracticeView
            questions={currentQuestions}
            onComplete={handlePracticeComplete}
          />
        );
      }
    }

    if (practiceStep === "topic_select") {
      return <TopicSelectView onStartSelectedTopics={handleStartSelectedSentenceTopics} />;
    }

    if (practiceStep === "result") {
      return (
        <ResultView
          score={resultSummary.score}
          accuracy={resultSummary.accuracy}
          xp={resultSummary.xp}
          mistakes={resultSummary.mistakes}
          onNavigate={handleNavigate}
          onRestartPractice={() => handleStartPracticeChoice(activePracticeType)}
        />
      );
    }

    // Standard Tab Navigation Views
    switch (currentNav) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            onNavigate={handleNavigate}
            onStartPractice={handleStartPracticeChoice}
          />
        );
      case "vocabulary":
        return <PracticeSelectView onSelectMode={handleStartPracticeChoice} />;
      case "sentence":
        return <TopicSelectView onStartSelectedTopics={handleStartSelectedSentenceTopics} />;
      case "mixed":
        return <PracticeSelectView onSelectMode={handleStartPracticeChoice} />;
      case "progress":
        return <ProgressView stats={stats} />;
      case "mistakes":
        return <MistakesView />;
      case "favorites":
        return <FavoritesView />;
      case "settings":
        return <SettingsView stats={stats} onUpdateStats={setStats} />;
      default:
        return (
          <DashboardView
            stats={stats}
            onNavigate={handleNavigate}
            onStartPractice={handleStartPracticeChoice}
          />
        );
    }
  };

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
            {renderMainContent()}
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

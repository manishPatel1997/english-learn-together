"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  Sparkles,
  HelpCircle,
  SkipForward,
  CheckCircle2,
  XCircle,
  Star,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { StatefulButton, type ButtonState } from "@/components/beui/stateful-button";
import { DynamicIsland } from "@/components/beui/dynamic-island";
import { Drawer } from "@/components/beui/drawer";
import { storage, type FavoriteItem } from "@/lib/storage";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export interface VocabQuestion {
  id: number;
  gujarati: string;
  english: string;
  phonetic?: string;
  category?: string;
  difficulty?: string;
  example?: string;
}

interface VocabularyPracticeViewProps {
  questions: VocabQuestion[];
  initialPageMode?: "selection" | "study" | "exam";
  onComplete: (score: number, accuracy: number, xp: number, mistakes: any[]) => void;
  onModeChange?: (mode: "selection" | "study" | "exam") => void;
}

export function VocabularyPracticeView({
  questions,
  initialPageMode = "selection",
  onComplete,
  onModeChange,
}: VocabularyPracticeViewProps) {
  const router = useRouter();
  const [pageMode, setPageMode] = useState<"selection" | "study" | "exam">(initialPageMode);
  const [hideEnglishOnStudy, setHideEnglishOnStudy] = useState(false);
  const [studyColumns, setStudyColumns] = useState<1 | 2>(2);

  useEffect(() => {
    if (initialPageMode) {
      setPageMode(initialPageMode);
    }
  }, [initialPageMode]);

  const switchPageMode = (mode: "selection" | "study" | "exam") => {
    setPageMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    } else {
      if (mode === "selection") router.push("/vocabulary");
      else if (mode === "study") router.push("/vocabulary/study");
      else if (mode === "exam") router.push("/vocabulary/exam");
    }
  };

  const [studyIndex, setStudyIndex] = useState(0);
  const [revealSpelling, setRevealSpelling] = useState(false);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Reset reveal state when studyIndex changes
  useEffect(() => {
    setRevealSpelling(false);
  }, [studyIndex]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "revealed">("idle");
  const [btnState, setBtnState] = useState<ButtonState>("idle");
  const [shake, setShake] = useState(false);

  // Session counters
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(storage.getStats().streak);
  const [islandMsg, setIslandMsg] = useState<string | null>(null);
  const [mistakesList, setMistakesList] = useState<any[]>([]);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Favorites state
  const [isFav, setIsFav] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Preserve exact JSON order by ID for Study / Reading Mode
  const studyQuestions = React.useMemo(() => {
    return [...questions].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [questions]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const studyQuestion = studyQuestions[studyIndex] || studyQuestions[0];

  // Auto focus input on index or status change in exam mode
  useEffect(() => {
    if (pageMode === "exam" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status, pageMode]);

  // Check initial favorite status
  useEffect(() => {
    const q = pageMode === "study" ? studyQuestion : currentQuestion;
    if (q) {
      const favs = storage.getFavorites();
      setIsFav(favs.some((f) => f.id === q.id));
    }
  }, [currentQuestion, studyQuestion, pageMode]);

  const speakWord = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleFavorite = (q: VocabQuestion) => {
    if (!q) return;
    const item: FavoriteItem = {
      id: q.id,
      gujarati: q.gujarati,
      english: q.english,
      categoryOrTopic: q.category || "General",
      type: "vocabulary",
      phonetic: q.phonetic,
      example: q.example,
    };
    const added = storage.toggleFavorite(item);
    setIsFav(added);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim() || status === "correct") return;

    const formattedUser = userAnswer.trim().toLowerCase();
    const formattedCorrect = currentQuestion.english.trim().toLowerCase();

    if (formattedUser === formattedCorrect) {
      // Correct!
      setStatus("correct");
      setBtnState("success");
      setCorrectCount((prev) => prev + 1);

      const gainedXP = 15;
      setSessionXP((prev) => prev + gainedXP);
      setSessionStreak((prev) => prev + 1);

      // Record to storage
      storage.addXP(gainedXP, true);

      fireConfetti();
      setIslandMsg("Correct! +15 XP 🎉");

      // Auto advance after 700ms
      setTimeout(() => {
        setIslandMsg(null);
        nextQuestion();
      }, 700);
    } else {
      // Wrong!
      setStatus("wrong");
      setBtnState("error");
      setShake(true);
      setSessionStreak(0);

      // Record mistake
      const mistake = {
        id: currentQuestion.id,
        gujarati: currentQuestion.gujarati,
        correctEnglish: currentQuestion.english,
        userAnswer: userAnswer.trim(),
        topic: currentQuestion.category || "Vocabulary",
        type: "vocabulary",
        timestamp: Date.now(),
      };
      storage.addMistake(mistake as any);
      setMistakesList((prev) => [...prev, mistake]);
      storage.addXP(0, false);

      setIslandMsg("Incorrect spelling. Try again!");

      setTimeout(() => {
        setShake(false);
        setBtnState("idle");
      }, 500);
    }
  };

  const handleSkip = () => {
    setStatus("idle");
    setUserAnswer("");
    setBtnState("idle");
    nextQuestion();
  };

  const handleShowAnswer = () => {
    setStatus("revealed");
    setUserAnswer(currentQuestion.english);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // Finished! Calculate final scores
      const total = questions.length;
      const acc = Math.round((correctCount / total) * 100);
      onComplete(correctCount, acc, sessionXP, mistakesList);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setStatus("idle");
      setBtnState("idle");
    }
  };

  // Keyboard navigation listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (status === "correct" || status === "revealed") {
        nextQuestion();
      } else {
        checkAnswer();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleSkip();
    }
  };

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  // SELECTION PAGE: Choose Page 1 (Read & Study) OR Page 2 (Take Exam)
  if (pageMode === "selection") {
    return (
      <div className="space-y-8 max-w-4xl mx-auto py-8 select-none">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" /> Vocabulary Learning Center
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
            Choose Vocabulary Page Mode
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Select whether you want to read & study spellings first or take the exam directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Page 1: Read & Study Page Card */}
          <div
            onClick={() => switchPageMode("study")}
            className="cursor-pointer rounded-[32px] border border-indigo-500/30 bg-card p-8 shadow-xl hover:border-indigo-500 hover:shadow-2xl transition-all space-y-6 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7" />
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 inline-block">
                Page 1 • Study Mode
              </span>
              <h3 className="text-2xl font-black text-foreground group-hover:text-indigo-600 transition-colors">
                📖 Read & Study Spellings
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Read, listen to audio pronunciations, and review all Gujarati to English spellings at your own pace before taking the exam.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Audio Pronunciation 🔊</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Flashcards & Example Sentences</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Full Session Overview List</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="w-full rounded-2xl bg-indigo-600 py-3.5 text-xs font-extrabold text-white group-hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Study Page</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Page 2: Take Exam Card */}
          <div
            onClick={() => switchPageMode("exam")}
            className="cursor-pointer rounded-[32px] border border-purple-500/30 bg-card p-8 shadow-xl hover:border-purple-500 hover:shadow-2xl transition-all space-y-6 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 inline-block">
                Page 2 • Exam Mode
              </span>
              <h3 className="text-2xl font-black text-foreground group-hover:text-purple-600 transition-colors">
                ✍️ Take Vocabulary Exam
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Test your spelling memory! Type English translations under exam conditions to earn XP, maintain streaks, and track accuracy.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Typing Exam & Auto-Check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>XP & Streak Counter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Instant Feedback & Confetti</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="w-full rounded-2xl bg-purple-600 py-3.5 text-xs font-extrabold text-white group-hover:bg-purple-700 shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Start Exam Page</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-between py-6 max-w-3xl mx-auto select-none space-y-6">
      {/* Dynamic Island Header */}
      <DynamicIsland
        streak={sessionStreak}
        xp={sessionXP}
        currentQuestion={pageMode === "study" ? studyIndex + 1 : currentIndex + 1}
        totalQuestions={questions.length}
        activeMessage={islandMsg}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Top Header Navigation Bar */}
      <div className="pt-12 flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={() => switchPageMode("selection")}
          className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>← Back to Mode Select</span>
        </button>

        {pageMode === "study" ? (
          <button
            type="button"
            onClick={() => switchPageMode("exam")}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-purple-700 transition-colors shadow-md"
          >
            <span>Finished Studying? Take Exam 🚀</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchPageMode("study")}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-extrabold text-foreground hover:bg-muted transition-colors"
          >
            <span>📖 Read Spellings First</span>
          </button>
        )}
      </div>

      {/* MODE 1: STUDY & READ SPELLINGS LIST */}
      {pageMode === "study" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
            <span>Gujarati & English Vocabulary Directory ({questions.length} Words)</span>

            <div className="flex flex-wrap items-center gap-3">
              {/* Column Layout Selector (1 or 2 Columns) */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm select-none">
                <span className="text-[11px] font-bold text-muted-foreground px-1.5 hidden sm:inline">Grid:</span>
                <button
                  type="button"
                  onClick={() => setStudyColumns(1)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all",
                    studyColumns === 1
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Show 1 Column"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  <span>1 Col</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudyColumns(2)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all",
                    studyColumns === 2
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Show 2 Columns"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>2 Cols</span>
                </button>
              </div>

              {/* Checkbox: Hide English (Hover to reveal) */}
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-border bg-card px-3.5 py-1.5 shadow-sm hover:border-indigo-500/50 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={hideEnglishOnStudy}
                  onChange={(e) => setHideEnglishOnStudy(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
                <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  {hideEnglishOnStudy ? (
                    <EyeOff className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  Hide English (Hover to reveal)
                </span>
              </label>
            </div>
          </div>

          {/* Full-Width Spellings List View */}
          <div className="rounded-[28px] border border-border bg-card p-6 shadow-xl space-y-3">
            <div className={cn("grid gap-3 transition-all", studyColumns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
              {studyQuestions.map((q, idx) => (
                <div
                  key={q.id !== undefined && q.id !== null ? `vocab-q-${q.id}-${idx}` : `vocab-q-${idx}`}
                  onClick={() => {
                    setStudyIndex(idx);
                    setRevealSpelling(true);
                    setDrawerOpen(true);
                  }}
                  className="cursor-pointer rounded-2xl border border-border bg-background p-4 flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-500/5 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="space-y-1 text-left min-w-0 flex-1">
                      <span className="text-base font-black text-foreground block group-hover:text-indigo-600 transition-colors leading-tight">
                        {q.gujarati}
                      </span>
                      {hideEnglishOnStudy ? (
                        <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                          {/* Revealed on hover */}
                          <span className="hidden group-hover:inline-block transition-all animate-in fade-in duration-150">
                            {q.english}
                          </span>
                          {/* Hidden hint shown by default when NOT hovering */}
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/75 group-hover:hidden select-none">
                            <EyeOff className="h-3 w-3 text-indigo-500 shrink-0" />
                            <span>Hover to reveal</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block leading-tight">
                          {q.english}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(q.english);
                      }}
                      title="Listen Audio Pronunciation"
                      className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md shrink-0"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-extrabold text-muted-foreground group-hover:text-indigo-600 transition-colors">
                      Details ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Exam Primary CTA */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => switchPageMode("exam")}
              className="w-full max-w-md rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-sm font-black text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl transition-all"
            >
              <span>I'm Ready! Start Exam Now 🚀</span>
            </button>
          </div>

          {/* Sidebar Drawer Modal for Word Details */}
          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="Word Details & Pronunciation"
            side="right"
          >
            <div className="space-y-6 pt-2 text-center">
              {/* Category Badge & Star Bookmark */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400">
                  {studyQuestion.category || "Vocabulary"}
                </span>

                <button
                  type="button"
                  onClick={() => handleFavorite(studyQuestion)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                    isFav
                      ? "bg-amber-500/20 border-amber-500 text-amber-500"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
                </button>
              </div>

              {/* Gujarati Word */}
              <div className="space-y-2 py-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Gujarati Word
                </span>
                <h2 className="text-4xl font-black text-foreground">
                  {studyQuestion.gujarati}
                </h2>
              </div>

              {/* English Spelling & Audio Pronunciation */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 space-y-4">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                  English Spelling to Remember
                </span>

                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-300">
                    {studyQuestion.english}
                  </h1>
                  <button
                    type="button"
                    onClick={() => speakWord(studyQuestion.english)}
                    title="Listen Pronunciation"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>

                {studyQuestion.phonetic && (
                  <p className="text-xs italic text-indigo-700 dark:text-indigo-300 font-semibold">
                    Phonetic: "{studyQuestion.phonetic}"
                  </p>
                )}
              </div>

              {/* Example Sentence */}
              {studyQuestion.example && (
                <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left">
                  <span className="text-[11px] font-bold text-muted-foreground block mb-1">Example Sentence:</span>
                  <p className="text-xs font-medium text-foreground italic">"{studyQuestion.example}"</p>
                </div>
              )}

              {/* Sidebar Word Navigators */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={studyIndex === 0}
                  onClick={() => setStudyIndex((prev) => Math.max(0, prev - 1))}
                  className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  ← Previous Word
                </button>

                <button
                  type="button"
                  disabled={studyIndex >= questions.length - 1}
                  onClick={() => setStudyIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Next Word →
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    switchPageMode("exam");
                  }}
                  className="w-full rounded-2xl bg-purple-600 py-3.5 text-xs font-extrabold text-white hover:bg-purple-700 shadow-md transition-colors"
                >
                  Start Exam Now 🚀
                </button>
              </div>
            </div>
          </Drawer>
        </div>
      ) : (
        /* MODE 2: EXAM / QUIZ MODE */
        <div>
          {/* Progress Bar & Header */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>
                Exam Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{progressPct}% Complete</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
              />
            </div>
          </div>

          {/* Main Large Practice Card */}
          <motion.div
            animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`relative my-4 rounded-[32px] border p-8 sm:p-12 shadow-2xl transition-colors bg-card ${
              status === "correct"
                ? "border-emerald-500 bg-emerald-500/5 shadow-emerald-500/20"
                : status === "wrong"
                ? "border-rose-500 bg-rose-500/5 shadow-rose-500/20"
                : "border-border"
            }`}
          >
            {/* Card Header: Category & Favorite */}
            <div className="flex items-center justify-between mb-8">
              <span className="rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {currentQuestion.category || "Vocabulary"}
              </span>

              <button
                type="button"
                onClick={() => handleFavorite(currentQuestion)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  isFav
                    ? "bg-amber-500/20 border-amber-500 text-amber-500"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
              </button>
            </div>

            {/* Gujarati Display */}
            <div className="text-center space-y-3 mb-10">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                Translate Gujarati Word to English
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-wide font-sans">
                {currentQuestion.gujarati}
              </h1>

              {currentQuestion.phonetic && (
                <p className="text-sm italic text-muted-foreground">
                  Phonetic: "{currentQuestion.phonetic}"
                </p>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (status === "wrong") setStatus("idle");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type English spelling... (Press Enter)"
                  disabled={status === "correct"}
                  className={`w-full rounded-2xl border px-6 py-4 text-center text-xl font-bold text-foreground placeholder:text-muted-foreground/60 outline-none transition-all shadow-inner ${
                    status === "correct"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : status === "wrong"
                      ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "border-border bg-background focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  }`}
                />

                {status === "correct" && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-500" />
                )}
                {status === "wrong" && (
                  <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-rose-500" />
                )}
              </div>

              {/* Answer Feedback Banner */}
              <AnimatePresence>
                {status === "revealed" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center space-y-1"
                  >
                    <span className="text-xs font-semibold text-indigo-500 block">Correct English Answer:</span>
                    <span className="text-xl font-black text-foreground">{currentQuestion.english}</span>
                    {currentQuestion.example && (
                      <p className="text-xs italic text-muted-foreground pt-1">{currentQuestion.example}</p>
                    )}
                  </motion.div>
                )}

                {status === "wrong" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Incorrect. Try again, reveal answer, or skip!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                {status === "idle" || status === "wrong" ? (
                  <>
                    <StatefulButton
                      state={btnState}
                      variant="primary"
                      size="lg"
                      onClick={checkAnswer}
                      className="flex-1 min-w-[140px]"
                    >
                      <span>Submit Answer</span>
                    </StatefulButton>

                    <button
                      type="button"
                      onClick={handleShowAnswer}
                      className="inline-flex h-14 items-center gap-1.5 rounded-[18px] border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 text-indigo-500" /> Show Answer
                    </button>

                    <button
                      type="button"
                      onClick={handleSkip}
                      className="inline-flex h-14 items-center gap-1.5 rounded-[18px] border border-border bg-card px-5 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <SkipForward className="h-4 w-4" /> Skip
                    </button>
                  </>
                ) : (
                  <StatefulButton
                    variant="success"
                    size="lg"
                    onClick={nextQuestion}
                    className="w-full"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-5 w-5" />
                  </StatefulButton>
                )}
              </div>
            </div>
          </motion.div>

          {/* Footer Helper info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-4">
            <span>Keyboard shortcuts: <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Enter</kbd> = Submit, <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Esc</kbd> = Skip</span>
            <span>Auto-focus enabled</span>
          </div>
        </div>
      )}
    </div>
  );
}

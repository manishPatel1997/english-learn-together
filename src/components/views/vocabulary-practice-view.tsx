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
  Shuffle,
  ListOrdered,
} from "lucide-react";
import { StatefulButton, type ButtonState } from "@/components/beui/stateful-button";
import { DynamicIsland } from "@/components/beui/dynamic-island";
import { Drawer } from "@/components/beui/drawer";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type FavoriteItem } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { VOCABULARY_SECTIONS } from "@/lib/vocabulary-data";

import { useRouter } from "next/navigation";

export interface VocabQuestion {
  id: string | number;
  gujarati: string;
  english: string;
  pronunciation_gujarati?: string;
  phonetic?: string;
  english_pronunciation?: string;
  category?: string;
  difficulty?: string;
  example?: string;
  sectionId?: string;
  sectionName?: string;
}

interface VocabularyPracticeViewProps {
  questions: VocabQuestion[];
  initialPageMode?: "selection" | "study" | "exam";
  activeSectionId?: string;
  onSectionChange?: (sectionId: string) => void;
  onComplete: (score: number, accuracy: number, xp: number, mistakes: any[]) => void;
  onModeChange?: (mode: "selection" | "study" | "exam") => void;
}

export function VocabularyPracticeView({
  questions,
  initialPageMode = "selection",
  activeSectionId = "section1",
  onSectionChange,
  onComplete,
  onModeChange,
}: VocabularyPracticeViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [pageMode, setPageMode] = useState<"selection" | "study" | "exam">(initialPageMode);
  const [hideEnglishOnStudy, setHideEnglishOnStudy] = useState(false);
  const [hidePronunciationInExam, setHidePronunciationInExam] = useState(true);
  const [studyColumns, setStudyColumns] = useState<1 | 2>(2);

  // Active exam questions order (sequential step-by-step by default, or randomized)
  const [activeExamQuestions, setActiveExamQuestions] = useState<VocabQuestion[]>(questions);
  const [isRandomized, setIsRandomized] = useState(false);

  useEffect(() => {
    setActiveExamQuestions(questions);
    setIsRandomized(false);
  }, [questions]);

  const examQuestions = activeExamQuestions.length > 0 ? activeExamQuestions : questions;

  const handleRandomizeOrder = () => {
    const shuffled = [...examQuestions].sort(() => 0.5 - Math.random());
    setActiveExamQuestions(shuffled);
    setIsRandomized(true);
    setListUserAnswers({});
    setListStatuses({});
    setCurrentIndex(0);
    setUserAnswer("");
    setStatus("idle");
    setBtnState("idle");
    toast({
      title: "Exam Questions Randomized! 🔀",
      description: "Question list and index numbers have been shuffled.",
      type: "info",
    });
  };

  const handleResetStepByStep = () => {
    setActiveExamQuestions([...questions]);
    setIsRandomized(false);
    setListUserAnswers({});
    setListStatuses({});
    setCurrentIndex(0);
    setUserAnswer("");
    setStatus("idle");
    setBtnState("idle");
    toast({
      title: "Step-by-Step Order Restored 🔢",
      description: "Questions are back in original sequential order.",
      type: "info",
    });
  };

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

  // List Exam state
  const [examViewMode, setExamViewMode] = useState<"list" | "card">("list");
  const [listUserAnswers, setListUserAnswers] = useState<Record<number, string>>({});
  const [listStatuses, setListStatuses] = useState<Record<number, "idle" | "correct" | "wrong" | "revealed">>({});
  const [blinkingIndices, setBlinkingIndices] = useState<Record<number, boolean>>({});
  const listInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Auto focus first item on list mode load
  useEffect(() => {
    if (pageMode === "exam" && examViewMode === "list" && listInputRefs.current[0]) {
      listInputRefs.current[0]?.focus();
    }
  }, [pageMode, examViewMode]);

  // Preserve exact JSON order by ID for Study / Reading Mode
  const studyQuestions = React.useMemo(() => {
    return [...questions].sort((a, b) =>
      String(a.id ?? 0).localeCompare(String(b.id ?? 0), undefined, { numeric: true })
    );
  }, [questions]);

  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];
  const studyQuestion = studyQuestions[studyIndex] || studyQuestions[0];

  // Auto focus input on index or status change in card exam mode
  useEffect(() => {
    if (pageMode === "exam" && examViewMode === "card" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status, pageMode, examViewMode]);

  const handleListCheckAnswer = (index: number, autoAdvance: boolean = true) => {
    const question = examQuestions[index];
    if (!question) return;

    const rawUser = listUserAnswers[index] || "";
    if (!rawUser.trim()) return;

    const formattedUser = rawUser.trim().toLowerCase();
    const formattedCorrect = question.english.trim().toLowerCase();

    if (formattedUser === formattedCorrect) {
      const isAlreadyCorrect = listStatuses[index] === "correct";

      setListStatuses((prev) => ({ ...prev, [index]: "correct" }));

      if (!isAlreadyCorrect) {
        setCorrectCount((prev) => prev + 1);
        setSessionXP((prev) => prev + 15);
        setSessionStreak((prev) => prev + 1);
        storage.addXP(15, true);
      }

      // Auto jump to next field if requested
      if (autoAdvance) {
        const nextIdx = index + 1;
        if (nextIdx < examQuestions.length) {
          setTimeout(() => {
            if (listInputRefs.current[nextIdx]) {
              listInputRefs.current[nextIdx]?.focus();
              listInputRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        } else {
          fireConfetti();
        }
      }
    } else {
      // Wrong answer
      setListStatuses((prev) => ({ ...prev, [index]: "wrong" }));
      setBlinkingIndices((prev) => ({ ...prev, [index]: true }));

      const existing = mistakesList.find((m) => m.id === question.id);
      if (!existing) {
        const mistake = {
          id: question.id,
          gujarati: question.gujarati,
          correctEnglish: question.english,
          userAnswer: rawUser.trim(),
          topic: question.category || "Vocabulary",
          type: "vocabulary",
          timestamp: Date.now(),
        };
        storage.addMistake(mistake as any);
        setMistakesList((prev) => [...prev, mistake]);
        storage.addXP(0, false);
      }

      setTimeout(() => {
        setBlinkingIndices((prev) => ({ ...prev, [index]: false }));
      }, 700);

      // Auto jump to next field on wrong answer as well when hitting Enter
      if (autoAdvance) {
        const nextIdx = index + 1;
        if (nextIdx < examQuestions.length) {
          setTimeout(() => {
            if (listInputRefs.current[nextIdx]) {
              listInputRefs.current[nextIdx]?.focus();
              listInputRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      }
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleListCheckAnswer(index, true);
    }
  };

  const handleListBlur = (index: number) => {
    const rawUser = listUserAnswers[index] || "";
    const currentStatus = listStatuses[index];
    if (rawUser.trim() && (!currentStatus || currentStatus === "idle")) {
      handleListCheckAnswer(index, false);
    }
  };

  const handleListInputChange = (index: number, val: string) => {
    setListUserAnswers((prev) => ({ ...prev, [index]: val }));
    if (listStatuses[index] === "wrong") {
      setListStatuses((prev) => ({ ...prev, [index]: "idle" }));
    }
  };

  const handleListShowAnswer = (index: number) => {
    const question = examQuestions[index];
    if (!question) return;
    setListUserAnswers((prev) => ({ ...prev, [index]: question.english }));
    setListStatuses((prev) => ({ ...prev, [index]: "revealed" }));

    const nextIdx = index + 1;
    if (nextIdx < examQuestions.length && listInputRefs.current[nextIdx]) {
      listInputRefs.current[nextIdx]?.focus();
      listInputRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleFinishListExam = () => {
    const total = examQuestions.length;
    const answeredCorrect = Object.values(listStatuses).filter((s) => s === "correct").length;
    const acc = Math.round((answeredCorrect / total) * 100);
    onComplete(answeredCorrect, acc, sessionXP, mistakesList);
  };


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
    if (currentIndex + 1 >= examQuestions.length) {
      // Finished! Calculate final scores
      const total = examQuestions.length;
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

  const progressPct = Math.round(((currentIndex + 1) / examQuestions.length) * 100);

  // SELECTION PAGE: Choose Vocabulary Section & Mode (Compact High-Efficiency UI)
  if (pageMode === "selection") {
    return (
      <div className="space-y-4 max-w-3xl mx-auto py-2 select-none">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-0.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3 w-3" /> Vocabulary Hub
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-3xl">
            Select Vocabulary Section & Mode
          </h2>
        </motion.div>

        {/* Compact Segmented Section Selector */}
        <div className="rounded-2xl border border-border/80 bg-card p-1.5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {VOCABULARY_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSectionChange && onSectionChange(sec.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  activeSectionId === sec.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm shrink-0">{sec.icon}</span>
                  <span className="truncate font-black">{sec.shortName || sec.name}</span>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-extrabold shrink-0",
                    activeSectionId === sec.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {sec.count} words
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Mode Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Card 1: Read & Study Mode */}
          <div
            onClick={() => switchPageMode("study")}
            className="group cursor-pointer rounded-2xl border border-indigo-500/30 bg-card p-4 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                  Study Mode
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  📖 Read & Study
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  Review flashcards, listen to pronunciations, and learn spellings at your own pace.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Audio & Cards
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="h-3 w-3" /> Overview List
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-black text-white group-hover:bg-indigo-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <span>Start Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Take Exam Mode */}
          <div
            onClick={() => switchPageMode("exam")}
            className="group cursor-pointer rounded-2xl border border-purple-500/30 bg-card p-4 shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Star className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-purple-600 dark:text-purple-400">
                  Exam Mode
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-foreground group-hover:text-purple-600 transition-colors flex items-center gap-1.5">
                  ✍️ Take Exam
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  Test your spelling accuracy with instant checks, XP rewards, and streak tracking.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Auto-Check
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="h-3 w-3" /> XP & Streaks
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-black text-white group-hover:bg-purple-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <span>Start Exam</span>
              <ArrowRight className="h-3.5 w-3.5" />
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
      <div className="pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => switchPageMode("selection")}
            className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>← Back to Mode Select</span>
          </button>

          {/* Inline Section Selector Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card p-1 text-xs select-none">
            {VOCABULARY_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSectionChange && onSectionChange(sec.id)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all",
                  activeSectionId === sec.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={sec.description}
              >
                <span>{sec.icon}</span>
                <span>{sec.shortName}</span>
                <span className="text-[10px] opacity-75">({sec.count})</span>
              </button>
            ))}
          </div>
        </div>

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

              {/* Checkbox: Hide English & Pronunciation (Hover to reveal) */}
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
                  Hide Pronunciation & English (Hover to reveal)
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
                      {/* Gujarati Meaning (Always Visible Prompt) */}
                      <span className="text-base font-black text-foreground block group-hover:text-indigo-600 transition-colors leading-tight">
                        {q.gujarati}
                      </span>

                      {/* Hidden / Revealed Section */}
                      {hideEnglishOnStudy ? (
                        <div className="relative w-full mt-1">
                          {/* Revealed Content: Pronunciation Badge + English Spelling */}
                          {/* Pre-rendered in layout flow so card height is 100% fixed before & during hover */}
                          <div className="flex flex-col gap-1 transition-all duration-200 opacity-0 group-hover:opacity-100 select-none">
                            {q.pronunciation_gujarati && (
                              <div className="inline-flex">
                                <span className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                                  🗣️ {q.pronunciation_gujarati}
                                </span>
                              </div>
                            )}
                            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block leading-tight">
                              {q.english}
                            </span>
                          </div>

                          {/* Hidden Hint Badge (positioned absolutely inside container, fades out smoothly on hover) */}
                          <div className="absolute inset-y-0 left-0 flex items-center transition-all duration-200 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none select-none">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                              <EyeOff className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                              <span>Hover to reveal</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mt-1">
                          {q.pronunciation_gujarati && (
                            <div className="inline-flex">
                              <span className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                                🗣️ {q.pronunciation_gujarati}
                              </span>
                            </div>
                          )}
                          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block leading-tight">
                            {q.english}
                          </span>
                        </div>
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
                  Gujarati Meaning
                </span>
                <h2 className="text-4xl font-black text-foreground">
                  {studyQuestion.gujarati}
                </h2>
                {studyQuestion.pronunciation_gujarati && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mt-1">
                    <span>🗣️ Gujarati Pronunciation:</span>
                    <strong className="text-indigo-700 dark:text-indigo-300 font-black">{studyQuestion.pronunciation_gujarati}</strong>
                  </div>
                )}
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
        <div className="space-y-6">
          {/* Exam Header & Layout Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black text-sm">
                📝
              </span>
              <div>
                <h3 className="text-sm font-black text-foreground">Vocabulary Practice Exam</h3>
                <p className="text-xs text-muted-foreground">
                  {examViewMode === "list"
                    ? "Gujarati on left, type English on right & press Enter!"
                    : `Question ${currentIndex + 1} of ${examQuestions.length}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Order Mode Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 select-none">
                <button
                  type="button"
                  onClick={handleResetStepByStep}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all",
                    !isRandomized
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Step-by-Step Sequential Order (#1, #2, #3...)"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>Step-by-Step</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomizeOrder}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all",
                    isRandomized
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Randomize / Shuffle Order"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Randomize</span>
                </button>
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 select-none">
                <button
                  type="button"
                  onClick={() => setExamViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all",
                    examViewMode === "list"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="List Exam Mode (Left Gujarati, Right Input)"
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  <span>List View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExamViewMode("card")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all",
                    examViewMode === "card"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Single Card Exam Mode"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Card View</span>
                </button>
              </div>

              {/* Hide Pronunciation Toggle */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 select-none" title="Hide Gujarati pronunciation during exam to prevent answer hints">
                <EyeOff className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span className="text-xs font-extrabold text-foreground">Hide Pronunciation</span>
                <button
                  type="button"
                  onClick={() => setHidePronunciationInExam(!hidePronunciationInExam)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    hidePronunciationInExam ? "bg-purple-600" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      hidePronunciationInExam ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinishListExam}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Submit & View Results 🏁</span>
              </button>
            </div>
          </div>

          {examViewMode === "list" ? (
            /* LIST EXAM VIEW: LEFT GUJARATI LIST, RIGHT INPUT FIELD */
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="flex items-center justify-between text-xs font-extrabold text-muted-foreground px-2">
                <span>
                  Correct:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {Object.values(listStatuses).filter((s) => s === "correct").length}
                  </strong>{" "}
                  / {examQuestions.length}
                </span>
                <span>
                  XP Earned: <strong className="text-amber-500">+{sessionXP} XP</strong>
                </span>
              </div>

              {/* Multi-Row List */}
              <div className="rounded-[28px] border border-border bg-card p-4 sm:p-6 shadow-xl space-y-3">
                {examQuestions.map((q, idx) => {
                  const itemStatus = listStatuses[idx] || "idle";
                  const isBlinking = blinkingIndices[idx] || false;
                  const currentAnswer = listUserAnswers[idx] || "";

                  return (
                    <motion.div
                      key={q.id !== undefined ? `exam-item-${q.id}-${idx}` : `exam-item-${idx}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-2xl border p-4 sm:p-5 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                        itemStatus === "correct"
                          ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10"
                          : isBlinking
                          ? "animate-wrong-blink border-rose-500 bg-rose-500/10"
                          : itemStatus === "wrong"
                          ? "border-rose-500/40 bg-rose-500/5"
                          : itemStatus === "revealed"
                          ? "border-indigo-500/40 bg-indigo-500/5"
                          : "border-border bg-background hover:border-indigo-500/30"
                      )}
                    >
                      {/* Left Side: Index Badge, Gujarati Word, Audio Button */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-xs transition-colors",
                            itemStatus === "correct"
                              ? "bg-emerald-500 text-white"
                              : itemStatus === "wrong" || isBlinking
                              ? "bg-rose-500 text-white"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          )}
                        >
                          #{idx + 1}
                        </div>

                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xl sm:text-2xl font-black text-foreground tracking-wide block">
                              {q.gujarati}
                            </span>
                            {q.pronunciation_gujarati && (!hidePronunciationInExam || itemStatus === "correct" || itemStatus === "revealed") && (
                              <span className="inline-flex items-center rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-extrabold text-purple-600 dark:text-purple-400">
                                🗣️ {q.pronunciation_gujarati}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => speakWord(q.english)}
                              title="Listen Pronunciation"
                              className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shrink-0"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {q.phonetic && q.phonetic !== q.pronunciation_gujarati && (!hidePronunciationInExam || itemStatus === "correct" || itemStatus === "revealed") && (
                            <span className="text-xs italic text-muted-foreground block">
                              Phonetic: "{q.phonetic}"
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Answer Input & Controls */}
                      <div className="w-full sm:w-80 space-y-1.5 shrink-0">
                        <div className="relative flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              ref={(el) => {
                                listInputRefs.current[idx] = el;
                              }}
                              type="text"
                              enterKeyHint="next"
                              autoCapitalize="off"
                              autoCorrect="off"
                              spellCheck={false}
                              value={currentAnswer}
                              onChange={(e) => handleListInputChange(idx, e.target.value)}
                              onKeyDown={(e) => handleListKeyDown(e, idx)}
                              onBlur={() => handleListBlur(idx)}
                              placeholder={
                                itemStatus === "correct"
                                  ? "✓ Correct Answer!"
                                  : "Type English & hit Enter..."
                              }
                              disabled={itemStatus === "correct"}
                              className={cn(
                                "w-full rounded-xl border px-4 py-2.5 text-sm font-bold outline-none transition-all shadow-inner pr-9",
                                itemStatus === "correct"
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                  : isBlinking || itemStatus === "wrong"
                                  ? "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                  : "border-border bg-background focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                              )}
                            />

                            {itemStatus === "correct" && (
                              <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                            )}
                            {(isBlinking || itemStatus === "wrong") && (
                              <XCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                            )}
                          </div>

                          {itemStatus !== "correct" && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleListCheckAnswer(idx)}
                                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                                title="Check Answer"
                              >
                                Check
                              </button>
                              <button
                                type="button"
                                onClick={() => handleListShowAnswer(idx)}
                                className="rounded-xl border border-border bg-card p-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                title="Show Correct Answer"
                              >
                                <HelpCircle className="h-4 w-4 text-indigo-500" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Subtitle / Feedback */}
                        {itemStatus === "correct" && (
                          <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 block pl-1">
                            ✓ Correct! Jumped to next word.
                          </span>
                        )}
                        {itemStatus === "wrong" && !isBlinking && (
                          <span className="text-[11px] font-extrabold text-rose-500 block pl-1">
                            ✕ Incorrect spelling. Try again & hit Enter!
                          </span>
                        )}
                        {itemStatus === "revealed" && (
                          <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 block pl-1">
                            Answer: {q.english}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Finish Exam Button at Bottom */}
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={handleFinishListExam}
                  className="w-full max-w-md rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-sm font-black text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl transition-all"
                >
                  Finished Exam? View Full Results 🚀
                </button>
              </div>
            </div>
          ) : (
            /* CARD EXAM VIEW (Original single card) */
            <div>
              {/* Progress Bar & Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>
                    Exam Question {currentIndex + 1} of {examQuestions.length}
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

                  <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                    {currentQuestion.pronunciation_gujarati && (!hidePronunciationInExam || status === "correct" || status === "revealed") && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <span>🗣️ Pronunciation:</span>
                        <strong className="font-black text-indigo-700 dark:text-indigo-300">{currentQuestion.pronunciation_gujarati}</strong>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => speakWord(currentQuestion.english)}
                      title="Listen Audio Pronunciation"
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3.5 py-1 text-xs font-extrabold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Listen Audio</span>
                    </button>
                  </div>

                  {currentQuestion.phonetic && currentQuestion.phonetic !== currentQuestion.pronunciation_gujarati && (!hidePronunciationInExam || status === "correct" || status === "revealed") && (
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
                <span>
                  Keyboard shortcuts: <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Enter</kbd> = Submit,{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Esc</kbd> = Skip
                </span>
                <span>Auto-focus enabled</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

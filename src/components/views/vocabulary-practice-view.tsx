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
import { Select, type SelectOption } from "@/components/beui/select";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type FavoriteItem } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { VOCABULARY_SECTIONS } from "@/lib/vocabulary-data";
import { Layers, Lock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";

import { useRouter } from "next/navigation";

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

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
  const { user, unlockedSections, updateUnlockedSections } = useAuth();
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
  const registerInputRef = React.useCallback((idx: number, el: HTMLInputElement | null) => {
    listInputRefs.current[idx] = el;
  }, []);

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

  const examId = `vocab_${activeSectionId}`;
  const [activeDraft, setActiveDraft] = useState<any | null>(null);

  // Check for saved exam draft when pageMode is set to exam
  useEffect(() => {
    if (pageMode === "exam") {
      const draft = storage.getExamDraft(examId);
      if (draft && (draft.currentIndex > 0 || (draft.listUserAnswers && Object.keys(draft.listUserAnswers).length > 0))) {
        setActiveDraft(draft);
      }
    }
  }, [pageMode, activeSectionId, examId]);

  const handleResumeExamDraft = () => {
    if (!activeDraft) return;
    setCurrentIndex(activeDraft.currentIndex || 0);
    if (activeDraft.listUserAnswers) setListUserAnswers(activeDraft.listUserAnswers);
    if (activeDraft.listStatuses) setListStatuses(activeDraft.listStatuses);
    setCorrectCount(activeDraft.correctCount || 0);
    setSessionXP(activeDraft.sessionXP || 0);
    if (activeDraft.mistakesList) setMistakesList(activeDraft.mistakesList);
    setActiveDraft(null);
    toast({
      title: "Exam Progress Resumed 🚀",
      description: `Restored your session for section ${activeSectionId.toUpperCase()}.`,
      type: "success",
    });
  };

  const handleStartFreshExam = () => {
    storage.clearExamDraft(examId);
    setActiveDraft(null);
    setCurrentIndex(0);
    setUserAnswer("");
    setStatus("idle");
    setBtnState("idle");
    setListUserAnswers({});
    setListStatuses({});
    setCorrectCount(0);
    setSessionXP(0);
    setMistakesList([]);
    toast({
      title: "Fresh Exam Started 🔄",
      description: "Cleared previous session. Good luck on your attempt!",
      type: "info",
    });
  };

  // Auto-save exam draft as user answers questions (debounced by 1s to prevent typing lag)
  useEffect(() => {
    if (pageMode === "exam" && !activeDraft) {
      const hasAnswered = currentIndex > 0 || Object.keys(listUserAnswers).length > 0;
      if (hasAnswered) {
        const timer = setTimeout(() => {
          storage.saveExamDraft({
            examId,
            examType: "vocabulary",
            sectionId: activeSectionId,
            currentIndex,
            listUserAnswers,
            listStatuses,
            correctCount,
            sessionXP,
            mistakesList,
          });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [pageMode, activeSectionId, examId, currentIndex, listUserAnswers, listStatuses, correctCount, sessionXP, mistakesList, activeDraft]);

  // Auto focus first item on list mode load
  useEffect(() => {
    if (pageMode === "exam" && examViewMode === "list" && listInputRefs.current[0]) {
      listInputRefs.current[0]?.focus();
    }
  }, [pageMode, examViewMode]);

  // Preserve exact original JSON file array order for Study / Reading Mode (NO sorting)
  const studyQuestions = React.useMemo(() => {
    return questions;
  }, [questions]);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Extract unique categories for filtering while preserving appearance order
  const categoriesList = React.useMemo(() => {
    const cats = Array.from(new Set(studyQuestions.map((q) => q.category).filter(Boolean))) as string[];
    return cats;
  }, [studyQuestions]);

  const categoryFilterOptions: SelectOption[] = React.useMemo(() => {
    return [
      {
        value: "all",
        label: `All Sound Rules (${categoriesList.length} Rules)`,
        icon: "📂",
        count: studyQuestions.length,
        description: "Show all words grouped under textbook section header banners.",
      },
      ...categoriesList.map((cat, idx) => ({
        value: cat,
        label: cat,
        icon: "🔖",
        count: studyQuestions.filter((q) => q.category === cat).length,
        stepLabel: `#${idx + 1}`,
      })),
    ];
  }, [categoriesList, studyQuestions]);

  // Group study questions by category (combining items of the same category under one section)
  const groupedQuestions = React.useMemo(() => {
    const filtered =
      selectedCategoryFilter === "all"
        ? studyQuestions
        : studyQuestions.filter((q) => q.category === selectedCategoryFilter);

    const groupsMap = new Map<string, VocabQuestion[]>();
    filtered.forEach((q) => {
      const cat = q.category || "General Vocabulary";
      if (!groupsMap.has(cat)) {
        groupsMap.set(cat, []);
      }
      groupsMap.get(cat)!.push(q);
    });

    return Array.from(groupsMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [studyQuestions, selectedCategoryFilter]);

  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];
  const studyQuestion = studyQuestions[studyIndex] || studyQuestions[0];

  // Auto focus input on index or status change in card exam mode
  useEffect(() => {
    if (pageMode === "exam" && examViewMode === "card" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status, pageMode, examViewMode]);

  const handleListCheckAnswer = React.useCallback(
    (index: number, autoAdvance: boolean = true) => {
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
          setTimeout(() => {
            storage.addXP(15, true);
          }, 0);
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
            }, 80);
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
          setMistakesList((prev) => [...prev, mistake]);
          setTimeout(() => {
            storage.addMistake(mistake as any);
            storage.addXP(0, false);
          }, 0);
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
            }, 80);
          }
        }
      }
    },
    [examQuestions, listUserAnswers, listStatuses, mistakesList]
  );

  const handleListKeyDown = React.useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleListCheckAnswer(index, true);
      }
    },
    [handleListCheckAnswer]
  );

  const handleListBlur = React.useCallback(
    (index: number) => {
      const rawUser = listUserAnswers[index] || "";
      const currentStatus = listStatuses[index];
      if (rawUser.trim() && (!currentStatus || currentStatus === "idle")) {
        handleListCheckAnswer(index, false);
      }
    },
    [listUserAnswers, listStatuses, handleListCheckAnswer]
  );

  const handleListInputChange = React.useCallback((index: number, val: string) => {
    setListUserAnswers((prev) => ({ ...prev, [index]: val }));
    setListStatuses((prev) => {
      if (prev[index] === "wrong") {
        return { ...prev, [index]: "idle" };
      }
      return prev;
    });
  }, []);

  const handleListShowAnswer = React.useCallback(
    (index: number) => {
      const question = examQuestions[index];
      if (!question) return;
      setListUserAnswers((prev) => ({ ...prev, [index]: question.english }));
      setListStatuses((prev) => ({ ...prev, [index]: "revealed" }));

      const nextIdx = index + 1;
      if (nextIdx < examQuestions.length && listInputRefs.current[nextIdx]) {
        listInputRefs.current[nextIdx]?.focus();
        listInputRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [examQuestions]
  );

  const handleFinishListExam = async () => {
    const total = examQuestions.length;
    const answeredCorrect = Object.values(listStatuses).filter((s) => s === "correct").length;
    const acc = Math.round((answeredCorrect / total) * 100);

    try {
      const res = await apiClient.user.recordProgress({
        sectionId: activeSectionId,
        examType: "vocabulary",
        totalQuestions: total,
        correctAnswers: answeredCorrect,
        xpEarned: sessionXP,
      });

      if (res.success && res.newlyUnlockedSection) {
        updateUnlockedSections(res.unlockedSections);
        toast({
          title: "🎉 New Section Unlocked!",
          description: res.message,
          type: "success",
        });
      }
    } catch (err) {
      console.warn("Could not sync exam progress to backend:", err);
    }

    storage.clearExamDraft(examId);
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

  const nextQuestion = async () => {
    if (currentIndex + 1 >= examQuestions.length) {
      // Finished! Calculate final scores
      const total = examQuestions.length;
      const acc = Math.round((correctCount / total) * 100);

      try {
        const res = await apiClient.user.recordProgress({
          sectionId: activeSectionId,
          examType: "vocabulary",
          totalQuestions: total,
          correctAnswers: correctCount,
          xpEarned: sessionXP,
        });

        if (res.success && res.newlyUnlockedSection) {
          updateUnlockedSections(res.unlockedSections);
          toast({
            title: "🎉 New Section Unlocked!",
            description: res.message,
            type: "success",
          });
        }
      } catch (err) {
        console.warn("Could not sync exam progress to backend:", err);
      }

      storage.clearExamDraft(examId);
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

  const sectionSelectOptions: SelectOption[] = VOCABULARY_SECTIONS.map((sec) => ({
    value: sec.id,
    label: sec.name,
    icon: sec.icon,
    badge: sec.badge,
    count: sec.count,
    description: sec.description,
    index: sec.index,
    stepLabel: sec.stepLabel,
  }));

  // SELECTION PAGE: Choose Vocabulary Section & Mode (Section Cards List UI)
  if (pageMode === "selection") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-3 select-none">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5" /> Vocabulary Learning Path
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-4xl">
            Select a Section to Learn & Practice
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
            Select a section card below to start reading flashcards or test your spelling accuracy in exam mode.
          </p>
        </motion.div>

        {/* Section Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOCABULARY_SECTIONS.map((sec) => {
            const isSelected = activeSectionId === sec.id;
            const isUnlocked =
              sec.id === "section1" ||
              unlockedSections.includes(sec.id) ||
              unlockedSections.includes("all");

            return (
              <motion.div
                key={sec.id}
                whileHover={{ scale: isUnlocked ? 1.01 : 1 }}
                whileTap={{ scale: isUnlocked ? 0.99 : 1 }}
                onClick={() => {
                  if (!isUnlocked) {
                    toast({
                      title: "Section Locked 🔒",
                      description: "Achieve an 80% or higher exam score on the previous section to unlock this next section!",
                      type: "info",
                    });
                    return;
                  }
                  if (onSectionChange) onSectionChange(sec.id);
                }}
                className={cn(
                  "relative cursor-pointer rounded-3xl border p-5 transition-all shadow-md flex flex-col justify-between space-y-4",
                  !isUnlocked
                    ? "border-border/60 bg-card/40 opacity-80"
                    : isSelected
                    ? "border-indigo-500 bg-card ring-2 ring-indigo-500/30 shadow-xl"
                    : "border-border bg-card/60 hover:border-indigo-500/50 hover:bg-card"
                )}
              >
                {/* Card Header & Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl text-2xl shrink-0 shadow-xs",
                          isUnlocked ? "bg-indigo-500/10" : "bg-slate-500/10 grayscale"
                        )}
                      >
                        {sec.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase block">
                          {sec.stepLabel}
                        </span>
                        <h3 className="text-base font-black text-foreground leading-tight truncate">
                          {sec.name}
                        </h3>
                      </div>
                    </div>

                    {!isUnlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[11px] font-black text-rose-600 dark:text-rose-400 shrink-0">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-black shrink-0 border",
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        )}
                      >
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-extrabold text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1.5 text-foreground font-black">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <span>{sec.count} Words</span>
                    </span>
                    {!isUnlocked ? (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                        Requires Score ≥ 80%
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-[11px]">
                        <CheckCircle2 className="h-4 w-4" /> Active Section
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Direct Action Buttons Inside Section Card */}
                <div className="pt-2 border-t border-border/60">
                  {isUnlocked ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSectionChange) onSectionChange(sec.id);
                          switchPageMode("study");
                        }}
                        className={cn(
                          "w-full rounded-xl py-2.5 px-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm",
                          isSelected
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white"
                        )}
                      >
                        <span>📖 Start Study</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSectionChange) onSectionChange(sec.id);
                          switchPageMode("exam");
                        }}
                        className={cn(
                          "w-full rounded-xl py-2.5 px-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm",
                          isSelected
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white"
                        )}
                      >
                        <span>✍️ Start Exam</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Section Locked 🔒",
                          description: "Score 80%+ on previous section to unlock!",
                          type: "info",
                        });
                      }}
                      className="w-full rounded-xl py-2.5 px-3 text-xs font-black bg-muted text-muted-foreground transition-all flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Locked Section</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
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
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <button
            type="button"
            onClick={() => switchPageMode("selection")}
            className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <span>← Back to Mode Select</span>
          </button>

          {/* Section Dropdown Selector in Navigation Bar */}
          <Select
            options={sectionSelectOptions}
            value={activeSectionId}
            onChange={(val) => onSectionChange && onSectionChange(val)}
            labelPrefix="Active Section"
            className="w-64 sm:w-80 shrink-0"
          />
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
          {/* Active Section Page Title Banner */}
          {(() => {
            const activeSec = VOCABULARY_SECTIONS.find((s) => s.id === activeSectionId) || VOCABULARY_SECTIONS[0];
            return (
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 p-4 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white text-2xl shrink-0 shadow-md">
                    {activeSec.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
                      {activeSec.stepLabel} • Textbook Page Section
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-foreground truncate">
                      {activeSec.name}
                    </h2>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-600 text-white text-xs font-black px-3 py-1 shrink-0 shadow-xs hidden sm:inline-block">
                  {questions.length} Words
                </span>
              </div>
            );
          })()}

          {/* Top Control Bar & Category Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
              <span>Vocabulary Directory ({questions.length} Words, {categoriesList.length} Categories)</span>

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

            {/* Category / Sound Rule Filter Dropdown */}
            {categoriesList.length > 1 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-card p-3.5 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm shrink-0">
                    🏷️
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-foreground">Filter by Sound Rule / Category</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Textbook categories & vowel pronunciation rules</span>
                  </div>
                </div>

                <Select
                  options={categoryFilterOptions}
                  value={selectedCategoryFilter}
                  onChange={setSelectedCategoryFilter}
                  labelPrefix="Category Filter"
                  className="w-full sm:w-80"
                />
              </div>
            )}
          </div>

          {/* Grouped Category Sections (Single Dark Header Banner per Category) */}
          <div className="space-y-6">
            {groupedQuestions.map((group, groupIdx) => (
              <div key={`group-${groupIdx}-${group.category}`} className="rounded-[28px] border border-border bg-card p-5 sm:p-6 shadow-xl space-y-4">
                {/* Single Dark Textbook Category Header Box */}
                <div className="flex items-center justify-between rounded-2xl bg-zinc-900 text-white dark:bg-zinc-950 border border-zinc-800 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xs shrink-0">
                      #{groupIdx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-black tracking-wide truncate text-white">
                      {group.category}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white/10 border border-white/10 px-3 py-0.5 text-[11px] font-extrabold text-indigo-300 shrink-0">
                    {group.items.length} words
                  </span>
                </div>

                {/* Words Grid under this Category Header */}
                <div className={cn("grid gap-3 transition-all", studyColumns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                  {group.items.map((q, itemSubIdx) => {
                    const originalIdx = studyQuestions.findIndex((item) => item.id === q.id);
                    const itemIdx = originalIdx >= 0 ? originalIdx : 0;
                    return (
                      <div
                        key={`vocab-q-${q.id || q.english}-${itemIdx}-${itemSubIdx}`}
                        onClick={() => {
                          setStudyIndex(itemIdx);
                          setRevealSpelling(true);
                          setDrawerOpen(true);
                        }}
                        className="cursor-pointer rounded-2xl border border-border bg-background p-4 flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-500/5 transition-all shadow-sm group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs shrink-0">
                            #{itemIdx + 1}
                          </div>
                          <div className="space-y-0.5 text-left min-w-0 flex-1">
                            <span className="text-base font-black text-foreground block group-hover:text-indigo-600 transition-colors leading-tight">
                              {q.gujarati}
                            </span>

                            {hideEnglishOnStudy ? (
                              <div className="relative w-full mt-1">
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

                        <div className="flex items-center gap-2 shrink-0 ml-2">
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
                    );
                  })}
                </div>
              </div>
            ))}
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
          {/* Resume Saved Exam Banner */}
          {activeDraft && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shrink-0 font-bold">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">Unfinished Exam Session Found!</h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    You answered {Object.keys(activeDraft.listUserAnswers || {}).length} questions in this session ({formatRelativeTime(new Date(activeDraft.timestamp).toISOString())}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleStartFreshExam}
                  className="flex-1 sm:flex-none h-10 rounded-xl border border-border bg-card hover:bg-muted px-4 text-xs font-extrabold text-foreground transition-all shadow-xs"
                >
                  Start Fresh Exam 🔄
                </button>

                <button
                  type="button"
                  onClick={handleResumeExamDraft}
                  className="flex-1 sm:flex-none h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 text-xs font-black shadow-md shadow-indigo-600/30 transition-all"
                >
                  Resume Saved Exam 🚀
                </button>
              </div>
            </motion.div>
          )}

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
              {/* Start Fresh Exam Button */}
              <button
                type="button"
                onClick={handleStartFreshExam}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-rose-500/10 hover:border-rose-500/30 px-3 py-2 text-xs font-extrabold text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-all shadow-xs"
                title="Clear current progress and restart exam from Question 1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start Fresh</span>
              </button>
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
                {examQuestions.map((q, idx) => (
                  <VocabExamListItem
                    key={q.id !== undefined ? `exam-item-${q.id}-${idx}` : `exam-item-${idx}`}
                    q={q}
                    idx={idx}
                    itemStatus={listStatuses[idx] || "idle"}
                    isBlinking={blinkingIndices[idx] || false}
                    currentAnswer={listUserAnswers[idx] || ""}
                    hidePronunciationInExam={hidePronunciationInExam}
                    registerInputRef={registerInputRef}
                    onInputChange={handleListInputChange}
                    onKeyDown={handleListKeyDown}
                    onBlur={handleListBlur}
                    onCheckAnswer={handleListCheckAnswer}
                    onShowAnswer={handleListShowAnswer}
                    onSpeak={speakWord}
                  />
                ))}
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

interface VocabExamListItemProps {
  q: VocabQuestion;
  idx: number;
  itemStatus: "idle" | "correct" | "wrong" | "revealed";
  isBlinking: boolean;
  currentAnswer: string;
  hidePronunciationInExam: boolean;
  registerInputRef: (idx: number, el: HTMLInputElement | null) => void;
  onInputChange: (index: number, val: string) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onBlur: (index: number) => void;
  onCheckAnswer: (index: number, autoAdvance?: boolean) => void;
  onShowAnswer: (index: number) => void;
  onSpeak: (word: string) => void;
}

const VocabExamListItem = React.memo(
  function VocabExamListItem({
    q,
    idx,
    itemStatus,
    isBlinking,
    currentAnswer,
    hidePronunciationInExam,
    registerInputRef,
    onInputChange,
    onKeyDown,
    onBlur,
    onCheckAnswer,
    onShowAnswer,
    onSpeak,
  }: VocabExamListItemProps) {
    const [localValue, setLocalValue] = React.useState(currentAnswer);

    // Sync when currentAnswer changes externally (e.g. show answer or draft restore)
    React.useEffect(() => {
      setLocalValue(currentAnswer);
    }, [currentAnswer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalValue(val);
      onInputChange(idx, val);
    };

    return (
      <motion.div
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
              {q.category && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-black text-amber-700 dark:text-amber-300">
                  🏷️ {q.category}
                </span>
              )}
              {q.pronunciation_gujarati && (!hidePronunciationInExam || itemStatus === "correct" || itemStatus === "revealed") && (
                <span className="inline-flex items-center rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-extrabold text-purple-600 dark:text-purple-400">
                  🗣️ {q.pronunciation_gujarati}
                </span>
              )}
              <button
                type="button"
                onClick={() => onSpeak(q.english)}
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
                ref={(el) => registerInputRef(idx, el)}
                type="text"
                enterKeyHint="next"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={localValue}
                onChange={handleChange}
                onKeyDown={(e) => onKeyDown(e, idx)}
                onBlur={() => onBlur(idx)}
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
                  onClick={() => onCheckAnswer(idx)}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                  title="Check Answer"
                >
                  Check
                </button>
                <button
                  type="button"
                  onClick={() => onShowAnswer(idx)}
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
  },
  (prev, next) => {
    return (
      prev.idx === next.idx &&
      prev.itemStatus === next.itemStatus &&
      prev.isBlinking === next.isBlinking &&
      prev.currentAnswer === next.currentAnswer &&
      prev.hidePronunciationInExam === next.hidePronunciationInExam &&
      prev.q === next.q
    );
  }
);

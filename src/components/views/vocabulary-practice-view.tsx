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
  Columns2,
  Grid3X3,
  Shuffle,
  ListOrdered,
  Search,
  SearchX,
  Flame,
  Zap,
  Award,
  Filter,
  Layers,
  Lock,
  SlidersHorizontal,
} from "lucide-react";
import { StatefulButton, type ButtonState } from "@/components/beui/stateful-button";
import { DynamicIsland } from "@/components/beui/dynamic-island";
import { Drawer } from "@/components/beui/drawer";
import { Select, type SelectOption } from "@/components/beui/select";
import { useToast } from "@/components/beui/animated-toast-stack";
import { storage, type FavoriteItem } from "@/lib/storage";
import { cn, formatRelativeTime } from "@/lib/utils";
import { XP_PER_VOCAB_CORRECT } from "@/lib/constants";
import { VOCABULARY_SECTIONS } from "@/lib/vocabulary-data";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";

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
  v1_base_form?: string;
  v1_pronunciation_gujarati?: string;
  v2_past_simple?: string;
  v2_pronunciation_gujarati?: string;
  v3_past_participle?: string;
  v3_pronunciation_gujarati?: string;
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
  const [studyColumns, setStudyColumns] = useState<1 | 2 | 3>(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [revealedStudyIds, setRevealedStudyIds] = useState<Record<string | number, boolean>>({});
  const [mobileExamOptionsOpen, setMobileExamOptionsOpen] = useState(false);

  const toggleStudyReveal = (id: string | number) => {
    setRevealedStudyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const checkVocabAnswer = (rawUser: string, question: VocabQuestion): boolean => {
    if (!rawUser) return false;
    const formattedUser = rawUser.trim().toLowerCase();
    const formattedCorrect = question.english.trim().toLowerCase();

    if (formattedUser === formattedCorrect) return true;

    if (question.v1_base_form) {
      const v1 = question.v1_base_form.trim().toLowerCase();
      const v2 = (question.v2_past_simple || "").trim().toLowerCase();
      const v3 = (question.v3_past_participle || "").trim().toLowerCase();

      if (formattedUser === v1 || formattedUser === v2 || formattedUser === v3) return true;
      if (formattedUser === `${v1} ${v2} ${v3}` || formattedUser === `${v1}/${v2}/${v3}` || formattedUser === `${v1}, ${v2}, ${v3}`) return true;
      if (formattedUser.includes(v1) && (v2 ? formattedUser.includes(v2) : true)) return true;
    }

    return false;
  };

  const handleListCheckAnswer = React.useCallback(
    (index: number, autoAdvance: boolean = true) => {
      const question = examQuestions[index];
      if (!question) return;

      const rawUser = listUserAnswers[index] || "";
      if (!rawUser.trim()) return;

      if (checkVocabAnswer(rawUser, question)) {
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
      toast({
        title: "⚠️ Progress Not Saved",
        description: "Could not sync your exam score to the server. Please check your connection and try again.",
        type: "error",
      });
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

    if (checkVocabAnswer(userAnswer, currentQuestion)) {
      // Correct!
      setStatus("correct");
      setBtnState("success");
      // Compute the next correct count locally to avoid stale state on the final question
      const nextCorrectCount = correctCount + 1;
      setCorrectCount(nextCorrectCount);

      const gainedXP = XP_PER_VOCAB_CORRECT;
      setSessionXP((prev) => prev + gainedXP);
      setSessionStreak((prev) => prev + 1);

      // Record to storage
      storage.addXP(gainedXP, true);

      fireConfetti();
      setIslandMsg(`Correct! +${XP_PER_VOCAB_CORRECT} XP 🎉`);

      // Auto advance after 700ms — pass the locally-computed count to avoid stale closure
      setTimeout(() => {
        setIslandMsg(null);
        nextQuestion(nextCorrectCount);
      }, 700);
    } else {
      // Wrong!
      setStatus("wrong");
      setBtnState("error");
      setShake(true);
      setSessionStreak(0);

      // Record mistake — only if this question is not already in the mistakes list
      const alreadyInMistakes = mistakesList.some((m) => m.id === currentQuestion.id);
      if (!alreadyInMistakes) {
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
      }
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

  const nextQuestion = async (finalCorrectCount?: number) => {
    if (currentIndex + 1 >= examQuestions.length) {
      // Finished! Use the passed-in finalCorrectCount if provided (avoids stale state on last question)
      const total = examQuestions.length;
      const resolvedCorrect = finalCorrectCount !== undefined ? finalCorrectCount : correctCount;
      const acc = Math.round((resolvedCorrect / total) * 100);

      try {
        const res = await apiClient.user.recordProgress({
          sectionId: activeSectionId,
          examType: "vocabulary",
          totalQuestions: total,
          correctAnswers: resolvedCorrect,
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
        toast({
          title: "⚠️ Progress Not Saved",
          description: "Could not sync your exam score to the server. Please check your connection and try again.",
          type: "error",
        });
        console.warn("Could not sync exam progress to backend:", err);
      }

      storage.clearExamDraft(examId);
      onComplete(resolvedCorrect, acc, sessionXP, mistakesList);
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

  // SELECTION PAGE: Choose Vocabulary Section & Mode (Modern Animated Glass Cards UI)
  if (pageMode === "selection") {
    const totalVocabWords = VOCABULARY_SECTIONS.filter((s) => s.id !== "all").reduce((acc, s) => acc + s.count, 0);
    const unlockedCount = VOCABULARY_SECTIONS.filter(
      (s) => s.id !== "all" && (s.id === "section1" || unlockedSections.includes(s.id) || unlockedSections.includes("all"))
    ).length;
    const totalRealSections = VOCABULARY_SECTIONS.filter((s) => s.id !== "all").length;

    const filteredSections = VOCABULARY_SECTIONS.filter((sec) => {
      // Category filter matching
      if (categoryFilter === "basics" && !["section1", "section2", "section3"].includes(sec.id)) return false;
      if (categoryFilter === "life" && !["section4", "section5"].includes(sec.id)) return false;
      if (categoryFilter === "grammar" && !["section6"].includes(sec.id)) return false;
      if (categoryFilter === "topics" && !["section7", "section8"].includes(sec.id)) return false;

      // Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sec.name.toLowerCase().includes(query);
        const matchesDesc = sec.description.toLowerCase().includes(query);
        const matchesBadge = sec.badge.toLowerCase().includes(query);
        const matchesStep = sec.stepLabel.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesBadge || matchesStep;
      }
      return true;
    });

    return (
      <div className="w-full space-y-6 sm:space-y-8 select-none pb-12">
        {/* Full-Width Neo-Brutalist Hero Command Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-[6px] border-[2.5px] border-black dark:border-white bg-[#18181B] text-white p-6 sm:p-8 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000]"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Header Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-[3px] border-2 border-black bg-[#FFE600] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#121212]">
                <Sparkles className="h-3.5 w-3.5 fill-black" />
                <span>Vocabulary Mastery Modules</span>
                <span>•</span>
                <span>{totalRealSections} Curated Levels</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight text-white">
                Select a Section to <span className="text-[#FFE600]">Study & Master</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-medium leading-relaxed">
                Step-by-step Gujarati vocabulary with English pronunciations, flashcards, and typing exam quizzes.
              </p>

              {/* Quick Stats Pill Strip */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold">
                <div className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#EFE8DD] text-black px-3 py-1 font-black uppercase shadow-[2px_2px_0px_#121212]">
                  <BookOpen className="h-3.5 w-3.5 text-black" />
                  <span>{totalVocabWords} Words</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#22C55E] text-white px-3 py-1 font-black uppercase shadow-[2px_2px_0px_#121212]">
                  <Award className="h-3.5 w-3.5 text-white" />
                  <span>{unlockedCount} of {totalRealSections} Unlocked</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FF6B00] text-white px-3 py-1 font-black uppercase shadow-[2px_2px_0px_#121212]">
                  <Flame className="h-3.5 w-3.5 fill-white" />
                  <span>80%+ Passing Score</span>
                </div>
              </div>
            </div>

            {/* Right Search & Filter Dock */}
            <div className="lg:col-span-5 bg-card text-foreground rounded-[4px] border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#121212] space-y-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by word, topic, or section..."
                  className="w-full rounded-[4px] bg-[#FAF7F2] dark:bg-zinc-900 pl-10 pr-9 py-2.5 text-xs sm:text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FF6B00] border-2 border-black shadow-[2px_2px_0px_#121212] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-xs hover:text-[#FF4D4D]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All Sections" },
                  { id: "basics", label: "1–3 Foundations" },
                  { id: "life", label: "4–5 Social" },
                  { id: "grammar", label: "6 Verbs" },
                  { id: "topics", label: "7–8 Topics" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-[3px] text-xs font-black uppercase transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer border-2 border-black",
                      categoryFilter === tab.id
                        ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#121212]"
                        : "bg-card text-foreground hover:bg-[#EFE8DD] dark:hover:bg-zinc-800"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Cards Fluid 4-Column Grid */}
        {filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-[6px] border-[2.5px] border-black p-8 space-y-3 shadow-[4px_4px_0px_#121212]">
            <SearchX className="h-12 w-12 text-foreground" />
            <h4 className="text-lg font-black uppercase text-foreground">No matching vocabulary sections found</h4>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold">Try clearing your search query or switching the category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="text-xs font-black uppercase text-[#FF6B00] hover:underline pt-1"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredSections.map((sec, idx) => {
              const isSelected = activeSectionId === sec.id;
              const isUnlocked =
                sec.id === "section1" ||
                unlockedSections.includes(sec.id) ||
                unlockedSections.includes("all");

              return (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  whileHover={{ y: isUnlocked ? -4 : 0, scale: isUnlocked ? 1.015 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.985 : 1 }}
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
                    "relative overflow-hidden rounded-[6px] border-[2.5px] border-black dark:border-white p-5 transition-all duration-150 flex flex-col justify-between space-y-4 select-none cursor-pointer",
                    !isUnlocked
                      ? "bg-card opacity-70 grayscale-[30%] shadow-[2px_2px_0px_#121212]"
                      : isSelected
                      ? "bg-card shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000] -translate-x-0.5 -translate-y-0.5"
                      : "bg-card shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  )}
                >
                  {/* Card Content Top Header */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-[4px] text-2xl shrink-0 border-2 border-black shadow-[2px_2px_0px_#121212]",
                            isUnlocked
                              ? "bg-[#FFE600] text-black"
                              : "bg-muted text-muted-foreground grayscale"
                          )}
                        >
                          {sec.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black tracking-wider text-black uppercase bg-[#FFE600] border border-black px-2 py-0.5 rounded-[2px]">
                              {sec.stepLabel}
                            </span>
                            {isSelected && isUnlocked && (
                              <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#22C55E] text-white border border-black px-1.5 py-0.5 text-[9px] font-black uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight leading-snug pt-1">
                            {sec.name}
                          </h3>
                        </div>
                      </div>

                      {/* Right Status Badge */}
                      {!isUnlocked ? (
                        <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#FF4D4D] text-white border border-black px-2 py-0.5 text-[10px] font-black uppercase shrink-0">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "rounded-[3px] px-2 py-0.5 text-[10px] font-black uppercase shrink-0 border border-black",
                            isSelected
                              ? "bg-[#18181B] text-white shadow-[1px_1px_0px_#121212]"
                              : "bg-[#EFE8DD] dark:bg-zinc-800 text-foreground"
                          )}
                        >
                          {sec.badge}
                        </span>
                      )}
                    </div>

                    {/* Section Full Description */}
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                      {sec.description}
                    </p>

                    {/* Section Meta Bar */}
                    <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                      <span className="inline-flex items-center gap-1.5 text-foreground font-black bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2.5 py-1 rounded-[3px]">
                        <BookOpen className="h-3.5 w-3.5 text-foreground" />
                        <span>{sec.count} Words</span>
                      </span>

                      {!isUnlocked ? (
                        <span className="text-[10px] text-[#FF6B00] font-black uppercase flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Req: Score ≥ 80%
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#22C55E] font-black uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Action Buttons Inside Section Card */}
                  <div className="pt-3 border-t-2 border-black/10 dark:border-white/10 relative z-10">
                    {isUnlocked ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSectionChange) onSectionChange(sec.id);
                            switchPageMode("study");
                          }}
                          className={cn(
                            "w-full rounded-[4px] py-2 px-2.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1 shadow-[2px_2px_0px_#121212] cursor-pointer",
                            isSelected
                              ? "bg-[#18181B] text-white hover:bg-black"
                              : "bg-card text-foreground hover:bg-[#EFE8DD] dark:hover:bg-zinc-800"
                          )}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Study</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSectionChange) onSectionChange(sec.id);
                            switchPageMode("exam");
                          }}
                          className={cn(
                            "w-full rounded-[4px] py-2 px-2.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1 shadow-[2px_2px_0px_#121212] cursor-pointer",
                            isSelected
                              ? "bg-[#FFE600] text-black hover:bg-amber-400"
                              : "bg-[#FFE600]/30 text-foreground hover:bg-[#FFE600] hover:text-black"
                          )}
                        >
                          <Zap className="h-3.5 w-3.5" />
                          <span>Exam</span>
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
                        className="w-full rounded-[4px] py-2 px-2 text-[11px] font-black uppercase bg-muted text-muted-foreground transition-all flex items-center justify-center gap-1 cursor-not-allowed border-2 border-black/30"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Pass Prior Step (80%+)</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col select-none space-y-6 w-full pb-12">
      {/* Dynamic Island Header - only active in Exam mode */}
      {pageMode === "exam" && (
        <DynamicIsland
          streak={sessionStreak}
          xp={sessionXP}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          activeMessage={islandMsg}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      )}

      {/* Top Header Navigation Bar */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-black/10 dark:border-white/10 pb-4",
          pageMode === "exam" ? "pt-12" : "pt-1"
        )}
      >
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <button
            type="button"
            onClick={() => switchPageMode("selection")}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0"
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
            className="flex items-center gap-1.5 rounded-[4px] border-2 border-black bg-[#FFE600] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#121212] transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>Finished Studying? Take Exam 🚀</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchPageMode("study")}
            className="flex items-center gap-1.5 rounded-[4px] border-2 border-black bg-card px-4 py-2 text-xs font-black uppercase tracking-wider text-foreground hover:bg-[#EFE8DD] dark:hover:bg-zinc-800 shadow-[3px_3px_0px_#121212] transition-transform active:translate-x-0.5 active:translate-y-0.5"
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
              <div className="flex items-center justify-between rounded-[6px] border-[2.5px] border-black dark:border-white bg-[#18181B] text-white p-4 sm:p-5 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000]">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#FFE600] text-black border-2 border-black text-2xl shrink-0 shadow-[2px_2px_0px_#121212]">
                    {activeSec.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE600] block">
                      {activeSec.stepLabel} • Textbook Page Section
                    </span>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white truncate">
                      {activeSec.name}
                    </h2>
                  </div>
                </div>
                <span className="rounded-[3px] border-2 border-black bg-[#FFE600] text-black text-xs font-black uppercase px-3 py-1 shrink-0 shadow-[2px_2px_0px_#121212] hidden sm:inline-block">
                  {questions.length} Words
                </span>
              </div>
            );
          })()}

          {/* Top Control Bar & Category Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-muted-foreground">
              <span>Directory ({questions.length} Words, {categoriesList.length} Categories)</span>

              <div className="flex flex-wrap items-center gap-3">
                {/* Column Layout Selector (1, 2, or 3 Columns) */}
                <div className="flex items-center gap-1 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] p-1 shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] select-none">
                  <span className="text-[10px] font-black text-foreground uppercase px-1.5 hidden sm:inline">Grid:</span>
                  
                  <button
                    type="button"
                    onClick={() => setStudyColumns(1)}
                    className={cn(
                      "flex items-center gap-1 rounded-[2px] px-2.5 py-1 text-xs font-black uppercase transition-all cursor-pointer",
                      studyColumns === 1
                        ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                        : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                    )}
                    title="Show 1 Column (Single column centered)"
                  >
                    <LayoutList className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>1 Col</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudyColumns(2)}
                    className={cn(
                      "flex items-center gap-1 rounded-[2px] px-2.5 py-1 text-xs font-black uppercase transition-all cursor-pointer",
                      studyColumns === 2
                        ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                        : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                    )}
                    title="Show 2 Columns (Dual column layout)"
                  >
                    <Columns2 className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>2 Cols</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudyColumns(3)}
                    className={cn(
                      "flex items-center gap-1 rounded-[2px] px-2.5 py-1 text-xs font-black uppercase transition-all cursor-pointer",
                      studyColumns === 3
                        ? "bg-[#FFE600] text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]"
                        : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                    )}
                    title="Show 3 Columns (Widescreen 3-column layout)"
                  >
                    <Grid3X3 className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>3 Cols</span>
                  </button>
                </div>

                {/* Checkbox: Hide English & Pronunciation (Hover to reveal) */}
                <label className="inline-flex items-center gap-2 cursor-pointer rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] px-3.5 py-1.5 shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] hover:bg-white dark:hover:bg-zinc-800 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={hideEnglishOnStudy}
                    onChange={(e) => setHideEnglishOnStudy(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] border-2 border-black text-[#18181B] focus:ring-0 cursor-pointer accent-[#FFE600]"
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    {hideEnglishOnStudy ? (
                      <EyeOff className="h-3.5 w-3.5 text-[#FF6B00]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    Hide English (Hover)
                  </span>
                </label>
              </div>
            </div>

            {/* Category / Sound Rule Filter Dropdown */}
            {categoriesList.length > 1 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-[4px] border-2 border-black bg-card p-3 sm:p-3.5 shadow-[3px_3px_0px_#121212]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-[#FFE600] text-black border-2 border-black font-black text-sm shrink-0 shadow-[1px_1px_0px_#121212]">
                    🏷️
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black uppercase text-foreground">Filter by Sound Rule / Category</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">Textbook categories & vowel pronunciation rules</span>
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
              <div key={`group-${groupIdx}-${group.category}`} className="rounded-[6px] border-[2.5px] border-black dark:border-white bg-card p-5 sm:p-6 shadow-[5px_5px_0px_#121212] space-y-4">
                {/* Single Dark Textbook Category Header Box */}
                <div className="flex items-center justify-between rounded-[4px] bg-[#18181B] text-white border-2 border-black px-4 py-3 shadow-[3px_3px_0px_#121212]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#FFE600] text-black font-black text-xs shrink-0 border border-black">
                      #{groupIdx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-black tracking-wide truncate text-white uppercase">
                      {group.category}
                    </h3>
                  </div>
                  <span className="rounded-[3px] border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-zinc-200 shrink-0">
                    {group.items.length} words
                  </span>
                </div>

                {/* Words Grid under this Category Header */}
                <div
                  className={cn(
                    "grid gap-3.5 transition-all",
                    studyColumns === 1
                      ? "grid-cols-1 max-w-4xl mx-auto"
                      : studyColumns === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  )}
                >
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
                        className="cursor-pointer rounded-[4px] border-2 border-black bg-card p-4 flex items-center justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#121212] transition-all shadow-[2px_2px_0px_#121212] group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-[#FFE600] text-black border-2 border-black font-black text-xs shrink-0 shadow-[1px_1px_0px_#121212]">
                            #{itemIdx + 1}
                          </div>
                          <div className="space-y-0.5 text-left min-w-0 flex-1">
                            <span className="text-base font-black text-foreground block leading-tight">
                              {q.gujarati}
                            </span>

                            {q.v1_base_form ? (
                              <div className="mt-2 space-y-1 select-none">
                                <div className="grid grid-cols-3 gap-1 rounded-[4px] bg-[#FAF7F2] dark:bg-zinc-900 p-2 border-2 border-black text-center shadow-[2px_2px_0px_#121212]">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-black uppercase text-[#FF6B00] block">V1 (Base)</span>
                                    <span className="text-xs font-black text-foreground block">{q.v1_base_form}</span>
                                    <span className="text-[10px] font-bold text-foreground block">🗣️ {q.v1_pronunciation_gujarati}</span>
                                  </div>
                                  <div className="space-y-0.5 border-x-2 border-black px-0.5">
                                    <span className="text-[9px] font-black uppercase text-[#FF6B00] block">V2 (Past)</span>
                                    <span className="text-xs font-black text-foreground block">{q.v2_past_simple}</span>
                                    <span className="text-[10px] font-bold text-foreground block">🗣️ {q.v2_pronunciation_gujarati}</span>
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-black uppercase text-[#FF6B00] block">V3 (Participle)</span>
                                    <span className="text-xs font-black text-foreground block">{q.v3_past_participle}</span>
                                    <span className="text-[10px] font-bold text-foreground block">🗣️ {q.v3_pronunciation_gujarati}</span>
                                  </div>
                                </div>
                              </div>
                            ) : hideEnglishOnStudy ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStudyReveal(q.id);
                                }}
                                className="relative w-full mt-1 cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "flex flex-col gap-1 transition-all duration-200 select-none",
                                    revealedStudyIds[q.id]
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  )}
                                >
                                  {q.pronunciation_gujarati && (
                                    <div className="inline-flex">
                                      <span className="inline-flex items-center rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-black text-foreground">
                                        🗣️ {q.pronunciation_gujarati}
                                      </span>
                                    </div>
                                  )}
                                  <span className="text-xs font-black text-foreground block leading-tight">
                                    {q.english}
                                  </span>
                                </div>

                                <div
                                  className={cn(
                                    "absolute inset-y-0 left-0 flex items-center transition-all duration-200 select-none",
                                    revealedStudyIds[q.id]
                                      ? "opacity-0 pointer-events-none"
                                      : "opacity-100 group-hover:opacity-0 group-hover:pointer-events-none"
                                  )}
                                >
                                  <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#FFE600] border border-black px-2.5 py-1 text-[11px] font-black uppercase text-black whitespace-nowrap shadow-[1px_1px_0px_#121212]">
                                    <EyeOff className="h-3.5 w-3.5 text-black shrink-0" />
                                    <span className="hidden sm:inline">Hover / Tap to reveal</span>
                                    <span className="sm:hidden">Tap to reveal</span>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 mt-1">
                                {q.pronunciation_gujarati && (
                                  <div className="inline-flex">
                                    <span className="inline-flex items-center rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-black text-foreground">
                                      🗣️ {q.pronunciation_gujarati}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs font-black text-foreground block leading-tight">
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
                            className="h-10 w-10 sm:h-9 sm:w-9 min-h-[44px] min-w-[44px] rounded-[3px] bg-[#18181B] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#121212] hover:bg-black active:translate-x-0.5 active:translate-y-0.5 transition-transform shrink-0"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
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
              className="w-full max-w-md rounded-[4px] bg-[#FFE600] text-black border-2 border-black py-3.5 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform"
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
                <span className="rounded-[3px] border-2 border-black bg-[#FFE600] text-black px-3.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#121212]">
                  {studyQuestion.category || "Vocabulary"}
                </span>

                <button
                  type="button"
                  onClick={() => handleFavorite(studyQuestion)}
                  className={`flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-black transition-transform shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 ${
                    isFav
                      ? "bg-[#FFE600] text-black"
                      : "bg-card text-foreground hover:bg-[#EFE8DD]"
                  }`}
                >
                  <Star className={`h-4 w-4 ${isFav ? "fill-black" : ""}`} />
                </button>
              </div>

              {/* Gujarati Word */}
              <div className="space-y-2 py-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                  Gujarati Meaning
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                  {studyQuestion.gujarati}
                </h2>
                {studyQuestion.pronunciation_gujarati && (
                  <div className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-800 px-3 py-1 text-xs font-black text-foreground mt-1 shadow-[1px_1px_0px_#121212]">
                    <span>🗣️ Pronunciation:</span>
                    <strong className="font-black text-foreground">{studyQuestion.pronunciation_gujarati}</strong>
                  </div>
                )}
              </div>

              {/* Verb Forms Breakdown or English Spelling */}
              {studyQuestion.v1_base_form ? (
                <div className="rounded-[4px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-900 p-5 space-y-4 shadow-[3px_3px_0px_#121212]">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block text-center">
                    Verb Forms (V1 / V2 / V3) Breakdown
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* V1 Base Form */}
                    <div className="rounded-[3px] border-2 border-black bg-card p-3 space-y-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] block">
                        V1 (Base Form)
                      </span>
                      <h4 className="text-xl font-black text-foreground">{studyQuestion.v1_base_form}</h4>
                      <p className="text-xs font-bold text-muted-foreground">
                        🗣️ {studyQuestion.v1_pronunciation_gujarati}
                      </p>
                      <button
                        type="button"
                        onClick={() => speakWord(studyQuestion.v1_base_form!)}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-[#FFE600] text-black border border-black px-2.5 py-1 text-xs font-black uppercase shadow-[1px_1px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 mt-1"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>

                    {/* V2 Past Simple */}
                    <div className="rounded-[3px] border-2 border-black bg-card p-3 space-y-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] block">
                        V2 (Past Simple)
                      </span>
                      <h4 className="text-xl font-black text-foreground">{studyQuestion.v2_past_simple}</h4>
                      <p className="text-xs font-bold text-muted-foreground">
                        🗣️ {studyQuestion.v2_pronunciation_gujarati}
                      </p>
                      <button
                        type="button"
                        onClick={() => speakWord(studyQuestion.v2_past_simple!)}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-[#FFE600] text-black border border-black px-2.5 py-1 text-xs font-black uppercase shadow-[1px_1px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 mt-1"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>

                    {/* V3 Past Participle */}
                    <div className="rounded-[3px] border-2 border-black bg-card p-3 space-y-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] block">
                        V3 (Past Participle)
                      </span>
                      <h4 className="text-xl font-black text-foreground">{studyQuestion.v3_past_participle}</h4>
                      <p className="text-xs font-bold text-muted-foreground">
                        🗣️ {studyQuestion.v3_pronunciation_gujarati}
                      </p>
                      <button
                        type="button"
                        onClick={() => speakWord(studyQuestion.v3_past_participle!)}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-[#FFE600] text-black border border-black px-2.5 py-1 text-xs font-black uppercase shadow-[1px_1px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 mt-1"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[4px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-900 p-6 space-y-4 shadow-[3px_3px_0px_#121212]">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block">
                    English Spelling to Remember
                  </span>

                  <div className="flex items-center justify-center gap-3">
                    <h1 className="text-3xl font-black text-foreground">
                      {studyQuestion.english}
                    </h1>
                    <button
                      type="button"
                      onClick={() => speakWord(studyQuestion.english)}
                      title="Listen Pronunciation"
                      className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </div>

                  {studyQuestion.phonetic && (
                    <p className="text-xs italic text-muted-foreground font-bold">
                      Phonetic: "{studyQuestion.phonetic}"
                    </p>
                  )}
                </div>
              )}

              {/* Example Sentence */}
              {studyQuestion.example && (
                <div className="p-4 rounded-[4px] bg-card border-2 border-black text-left shadow-[2px_2px_0px_#121212]">
                  <span className="text-[11px] font-black uppercase text-muted-foreground block mb-1">Example Sentence:</span>
                  <p className="text-xs font-semibold text-foreground italic">"{studyQuestion.example}"</p>
                </div>
              )}

              {/* Sidebar Word Navigators */}
              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={studyIndex === 0}
                  onClick={() => setStudyIndex((prev) => Math.max(0, prev - 1))}
                  className="flex-1 rounded-[4px] border-2 border-black bg-card py-2.5 text-xs font-black uppercase text-foreground disabled:opacity-40 hover:bg-[#EFE8DD] shadow-[2px_2px_0px_#121212] transition-colors"
                >
                  ← Previous Word
                </button>

                <button
                  type="button"
                  disabled={studyIndex >= questions.length - 1}
                  onClick={() => setStudyIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex-1 rounded-[4px] border-2 border-black bg-card py-2.5 text-xs font-black uppercase text-foreground disabled:opacity-40 hover:bg-[#EFE8DD] shadow-[2px_2px_0px_#121212] transition-colors"
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
                  className="w-full rounded-[4px] bg-[#FFE600] text-black border-2 border-black py-3 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
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
              className="rounded-[6px] border-[2.5px] border-black dark:border-white bg-[#FFE600] text-black p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#121212]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-black text-white border-2 border-black shadow-[2px_2px_0px_#121212] shrink-0 font-bold">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">Unfinished Exam Session Found!</h4>
                  <p className="text-xs font-bold opacity-80">
                    You answered {Object.keys(activeDraft.listUserAnswers || {}).length} questions in this session ({formatRelativeTime(new Date(activeDraft.timestamp).toISOString())}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleStartFreshExam}
                  className="flex-1 sm:flex-none h-10 rounded-[4px] border-2 border-black bg-card hover:bg-[#EFE8DD] px-4 text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Start Fresh 🔄
                </button>

                <button
                  type="button"
                  onClick={handleResumeExamDraft}
                  className="flex-1 sm:flex-none h-10 rounded-[4px] bg-[#18181B] text-white border-2 border-black px-5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Resume Saved Exam 🚀
                </button>
              </div>
            </motion.div>
          )}


          {/* Exam Header & Layout Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-card border-[2.5px] border-black dark:border-white p-3.5 sm:p-4 rounded-[6px] shadow-[3px_3px_0px_#121212] sm:shadow-[4px_4px_0px_#121212] dark:shadow-[3px_3px_0px_#000] sm:dark:shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[4px] bg-[#FFE600] text-black border-2 border-black font-black text-sm shadow-[2px_2px_0px_#121212]">
                📝
              </span>
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Vocabulary Practice Exam</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                  {examViewMode === "list"
                    ? "Gujarati on left, type English on right & press Enter!"
                    : `Question ${currentIndex + 1} of ${examQuestions.length}`}
                </p>
              </div>
            </div>

            {/* Mobile-Only Compact Action Bar: [Start Fresh] [Exam Options ⚙️] [Submit 🏁] */}
            <div className="flex sm:hidden items-center justify-between gap-2 w-full pt-1">
              <button
                type="button"
                onClick={handleStartFreshExam}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-black bg-card hover:bg-[#FF4D4D] hover:text-white px-2.5 py-2.5 text-xs font-black uppercase tracking-wider text-foreground shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                title="Clear current progress and restart exam"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileExamOptionsOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black px-2.5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Options ⚙️</span>
              </button>

              <button
                type="button"
                onClick={handleFinishListExam}
                className="flex-1 flex items-center justify-center gap-1 rounded-[4px] bg-[#22C55E] text-white border-2 border-black px-2.5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
              >
                <span>Submit 🏁</span>
              </button>
            </div>

            {/* Desktop Controls (hidden on mobile < 640px) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              {/* Start Fresh Exam Button */}
              <button
                type="button"
                onClick={handleStartFreshExam}
                className="flex items-center gap-1.5 rounded-[4px] border-2 border-black bg-card hover:bg-[#FF4D4D] hover:text-white px-3 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-colors shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 min-h-[40px]"
                title="Clear current progress and restart exam from Question 1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start Fresh</span>
              </button>

              {/* Order Mode Switcher */}
              <div className="flex items-center gap-1 rounded-[4px] border-2 border-black bg-card p-1 shadow-[2px_2px_0px_#121212] select-none">
                <button
                  type="button"
                  onClick={handleResetStepByStep}
                  className={cn(
                    "flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-xs font-black uppercase transition-all",
                    !isRandomized
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "text-foreground hover:bg-[#FFE600] hover:text-black"
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
                    "flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-xs font-black uppercase transition-all",
                    isRandomized
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "text-foreground hover:bg-[#FFE600] hover:text-black"
                  )}
                  title="Randomize / Shuffle Order"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Randomize</span>
                </button>
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center gap-1 rounded-[4px] border-2 border-black bg-card p-1 shadow-[2px_2px_0px_#121212] select-none">
                <button
                  type="button"
                  onClick={() => setExamViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-xs font-black uppercase transition-all",
                    examViewMode === "list"
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "text-foreground hover:bg-[#FFE600] hover:text-black"
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
                    "flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-xs font-black uppercase transition-all",
                    examViewMode === "card"
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "text-foreground hover:bg-[#FFE600] hover:text-black"
                  )}
                  title="Single Card Exam Mode"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Card View</span>
                </button>
              </div>

              {/* Hide Pronunciation Toggle */}
              <div className="flex items-center gap-2 rounded-[4px] border-2 border-black bg-card px-3 py-1.5 shadow-[2px_2px_0px_#121212] select-none" title="Hide Gujarati pronunciation during exam to prevent answer hints">
                <EyeOff className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-foreground">Hide Pronunciation</span>
                <button
                  type="button"
                  onClick={() => setHidePronunciationInExam(!hidePronunciationInExam)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-black transition-colors duration-200 ease-in-out focus:outline-none",
                    hidePronunciationInExam ? "bg-[#18181B]" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-[#FFE600] shadow-sm transition duration-200 ease-in-out",
                      hidePronunciationInExam ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinishListExam}
                className="rounded-[4px] bg-[#22C55E] text-white border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <span>Submit Results 🏁</span>
              </button>
            </div>
          </div>

          {/* Mobile Exam Options Drawer */}
          <Drawer
            open={mobileExamOptionsOpen}
            onOpenChange={setMobileExamOptionsOpen}
            title="Exam Options & Preferences"
            side="right"
          >
            <div className="space-y-5 pt-3 select-none">
              {/* Question Order Setting */}
              <div className="space-y-2 rounded-[4px] border-2 border-black p-3.5 bg-card shadow-[2px_2px_0px_#121212]">
                <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                  Question Order
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleResetStepByStep();
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-black py-2.5 text-xs font-black uppercase transition-all min-h-[44px]",
                      !isRandomized
                        ? "bg-[#18181B] text-white"
                        : "bg-[#FAF7F2] dark:bg-zinc-800 text-foreground"
                    )}
                  >
                    <ListOrdered className="h-4 w-4" />
                    <span>Sequential</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRandomizeOrder();
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-black py-2.5 text-xs font-black uppercase transition-all min-h-[44px]",
                      isRandomized
                        ? "bg-[#18181B] text-white"
                        : "bg-[#FAF7F2] dark:bg-zinc-800 text-foreground"
                    )}
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Randomized</span>
                  </button>
                </div>
              </div>

              {/* View Layout Setting */}
              <div className="space-y-2 rounded-[4px] border-2 border-black p-3.5 bg-card shadow-[2px_2px_0px_#121212]">
                <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                  Exam Layout Mode
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExamViewMode("list")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-black py-2.5 text-xs font-black uppercase transition-all min-h-[44px]",
                      examViewMode === "list"
                        ? "bg-[#18181B] text-white"
                        : "bg-[#FAF7F2] dark:bg-zinc-800 text-foreground"
                    )}
                  >
                    <LayoutList className="h-4 w-4" />
                    <span>List View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamViewMode("card")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-black py-2.5 text-xs font-black uppercase transition-all min-h-[44px]",
                      examViewMode === "card"
                        ? "bg-[#18181B] text-white"
                        : "bg-[#FAF7F2] dark:bg-zinc-800 text-foreground"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Card View</span>
                  </button>
                </div>
              </div>

              {/* Hide Pronunciation Setting */}
              <div className="flex items-center justify-between rounded-[4px] border-2 border-black p-3.5 bg-card shadow-[2px_2px_0px_#121212]">
                <div className="space-y-0.5">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                    Hide Pronunciation
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    Prevent hints during quiz
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHidePronunciationInExam(!hidePronunciationInExam)}
                  className={cn(
                    "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-black transition-colors duration-200 ease-in-out focus:outline-none min-h-[44px] items-center px-0.5",
                    hidePronunciationInExam ? "bg-[#18181B]" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FFE600] border border-black shadow-sm transition duration-200 ease-in-out",
                      hidePronunciationInExam ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileExamOptionsOpen(false)}
                className="w-full rounded-[4px] bg-[#FFE600] text-black border-2 border-black py-3 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] min-h-[44px]"
              >
                Apply & Close
              </button>
            </div>
          </Drawer>

          {examViewMode === "list" ? (
            /* LIST EXAM VIEW: LEFT GUJARATI LIST, RIGHT INPUT FIELD */
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground px-2">
                <span>
                  Correct:{" "}
                  <strong className="text-[#22C55E]">
                    {Object.values(listStatuses).filter((s) => s === "correct").length}
                  </strong>{" "}
                  / {examQuestions.length}
                </span>
                <span>
                  XP Earned: <strong className="text-foreground">+{sessionXP} XP</strong>
                </span>
              </div>

              {/* Multi-Row List */}
              <div className="rounded-[6px] border-[2.5px] border-black dark:border-white bg-card p-4 sm:p-6 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000] space-y-3">
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
                  className="w-full max-w-md rounded-[4px] bg-[#FFE600] text-black border-2 border-black py-3.5 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform"
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
                <div className="h-3 w-full overflow-hidden rounded-[4px] border-2 border-black bg-[#EFE8DD] dark:bg-zinc-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-[#FFE600]"
                  />
                </div>
              </div>

              {/* Main Large Practice Card with Smooth AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id || currentIndex}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={
                    shake
                      ? { x: [-12, 12, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`relative my-4 rounded-[6px] border-[2.5px] border-black dark:border-white p-8 sm:p-12 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000] transition-colors bg-card ${
                    status === "correct"
                      ? "bg-[#22C55E]/10"
                      : status === "wrong"
                      ? "bg-[#FF4D4D]/10"
                      : "bg-card"
                  }`}
                >
                  {/* Card Header: Category & Favorite */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="rounded-[3px] border-2 border-black bg-[#FFE600] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#121212]">
                      {currentQuestion.category || "Vocabulary"}
                    </span>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleFavorite(currentQuestion)}
                      className={`flex h-9 w-9 items-center justify-center rounded-[4px] border-2 border-black transition-transform shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 ${
                        isFav
                          ? "bg-[#FFE600] text-black"
                          : "bg-card text-foreground hover:bg-[#EFE8DD]"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${isFav ? "fill-black" : ""}`} />
                    </motion.button>
                  </div>

                  {/* Gujarati Display */}
                  <div className="text-center space-y-3 mb-10">
                    <span className="text-xs font-black uppercase tracking-widest text-[#FF6B00] block">
                      Translate Gujarati Word to English
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight font-sans">
                      {currentQuestion.gujarati}
                    </h1>

                    <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                      {currentQuestion.pronunciation_gujarati && (!hidePronunciationInExam || status === "correct" || status === "revealed") && (
                        <span className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-800 px-3 py-1 text-xs font-black text-foreground">
                          <span>🗣️ Pronunciation:</span>
                          <strong className="font-black text-foreground">{currentQuestion.pronunciation_gujarati}</strong>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => speakWord(currentQuestion.english)}
                        title="Listen Audio Pronunciation"
                        className="inline-flex items-center gap-1.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen Audio</span>
                      </button>
                    </div>

                    {currentQuestion.phonetic && currentQuestion.phonetic !== currentQuestion.pronunciation_gujarati && (!hidePronunciationInExam || status === "correct" || status === "revealed") && (
                      <p className="text-sm italic font-bold text-muted-foreground">
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
                        className={`w-full rounded-[4px] border-2 border-black dark:border-white px-6 py-4 text-center text-xl font-black text-foreground placeholder:text-muted-foreground/60 outline-none transition-all shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#000] ${
                          status === "correct"
                            ? "bg-[#22C55E]/15 text-[#22C55E]"
                            : status === "wrong"
                            ? "bg-[#FF4D4D]/15 text-[#FF4D4D]"
                            : "bg-background focus:border-[#FF6B00]"
                        }`}
                      />

                      {status === "correct" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22C55E]">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                      )}
                      {status === "wrong" && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF4D4D]">
                          <XCircle className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Answer Feedback Banner */}
                    <AnimatePresence>
                      {status === "revealed" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-[4px] border-2 border-black bg-[#FFE600] text-black p-4 text-center space-y-1 shadow-[3px_3px_0px_#121212]"
                        >
                          <span className="text-xs font-black uppercase tracking-wider block">Correct English Answer:</span>
                          <span className="text-xl font-black">{currentQuestion.english}</span>
                          {currentQuestion.example && (
                            <p className="text-xs font-bold italic pt-1">{currentQuestion.example}</p>
                          )}
                        </motion.div>
                      )}

                      {status === "wrong" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-[4px] border-2 border-black bg-[#FF4D4D] text-white p-3 text-center text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#121212]"
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
                            className="flex-1 min-w-[140px] font-black uppercase tracking-wider"
                          >
                            <span>Submit Answer</span>
                          </StatefulButton>

                          <button
                            type="button"
                            onClick={handleShowAnswer}
                            className="inline-flex h-12 items-center gap-1.5 rounded-[4px] border-2 border-black bg-card px-4 text-xs font-black uppercase tracking-wider text-foreground hover:bg-[#EFE8DD] transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_#121212]"
                          >
                            <HelpCircle className="h-4 w-4" /> Show Answer
                          </button>

                          <button
                            type="button"
                            onClick={handleSkip}
                            className="inline-flex h-12 items-center gap-1.5 rounded-[4px] border-2 border-black bg-card px-4 text-xs font-black uppercase tracking-wider text-muted-foreground hover:bg-[#EFE8DD] transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_#121212]"
                          >
                            <SkipForward className="h-4 w-4" /> Skip
                          </button>
                        </>
                      ) : (
                        <StatefulButton
                          variant="success"
                          size="lg"
                          onClick={() => nextQuestion()}
                          className="w-full font-black uppercase tracking-wider"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="h-5 w-5" />
                        </StatefulButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer Helper info */}
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-4">
                <span>
                  Shortcuts: <kbd className="rounded-[2px] border-2 border-black bg-[#FFE600] text-black px-1.5 py-0.5 font-black shadow-[1px_1px_0px_#121212]">Enter</kbd> = Submit,{" "}
                  <kbd className="rounded-[2px] border-2 border-black bg-[#FFE600] text-black px-1.5 py-0.5 font-black shadow-[1px_1px_0px_#121212]">Esc</kbd> = Skip
                </span>
                <span className="font-bold">Auto-focus enabled</span>
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
          "rounded-[4px] border-2 border-black dark:border-white p-4 sm:p-5 transition-all shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card",
          itemStatus === "correct"
            ? "bg-[#22C55E]/10"
            : isBlinking
              ? "animate-wrong-blink bg-[#FF4D4D]/20 border-[#FF4D4D]"
              : itemStatus === "wrong"
                ? "bg-[#FF4D4D]/10"
                : itemStatus === "revealed"
                  ? "bg-[#FFE600]/20"
                  : "bg-card hover:bg-[#FAF7F2] dark:hover:bg-zinc-900"
        )}
      >
        {/* Left Side: Index Badge, Gujarati Word, Audio Button */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] font-black text-xs border-2 border-black transition-colors shadow-[1px_1px_0px_#121212]",
              itemStatus === "correct"
                ? "bg-[#22C55E] text-white"
                : itemStatus === "wrong" || isBlinking
                  ? "bg-[#FF4D4D] text-white"
                  : "bg-[#FFE600] text-black"
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
                <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-black uppercase text-foreground">
                  🏷️ {q.category}
                </span>
              )}
              {q.v1_base_form ? (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#FFE600]/20 border border-black px-2 py-0.5 text-[11px] font-black text-foreground">
                    ⚡ V1: {q.v1_base_form} ({q.v1_pronunciation_gujarati})
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-bold text-foreground">
                    V2: {q.v2_past_simple} ({q.v2_pronunciation_gujarati})
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-bold text-foreground">
                    V3: {q.v3_past_participle} ({q.v3_pronunciation_gujarati})
                  </span>
                </div>
              ) : q.pronunciation_gujarati && (!hidePronunciationInExam || itemStatus === "correct" || itemStatus === "revealed") && (
                <span className="inline-flex items-center rounded-[2px] bg-[#EFE8DD] dark:bg-zinc-800 border border-black px-2 py-0.5 text-[11px] font-black text-foreground">
                  🗣️ {q.pronunciation_gujarati}
                </span>
              )}
              <button
                type="button"
                onClick={() => onSpeak(q.english)}
                title="Listen Pronunciation"
                className="h-9 w-9 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] rounded-[3px] bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 transition-transform shrink-0"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            {q.phonetic && q.phonetic !== q.pronunciation_gujarati && (!hidePronunciationInExam || itemStatus === "correct" || itemStatus === "revealed") && (
              <span className="text-xs italic font-bold text-muted-foreground block">
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
                  "w-full rounded-[4px] border-2 border-black dark:border-white px-4 py-2 text-sm font-bold outline-none transition-all shadow-[2px_2px_0px_#121212] pr-9",
                  itemStatus === "correct"
                    ? "bg-[#22C55E]/15 text-[#22C55E]"
                    : isBlinking || itemStatus === "wrong"
                      ? "bg-[#FF4D4D]/15 text-[#FF4D4D]"
                      : "bg-background focus:border-[#FF6B00]"
                )}
              />

              {itemStatus === "correct" && (
                <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22C55E]" />
              )}
              {(isBlinking || itemStatus === "wrong") && (
                <XCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FF4D4D]" />
              )}
            </div>

            {itemStatus !== "correct" && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onCheckAnswer(idx)}
                  className="rounded-[4px] bg-[#FFE600] text-black border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  title="Check Answer"
                >
                  Check
                </button>
                <button
                  type="button"
                  onClick={() => onShowAnswer(idx)}
                  className="rounded-[4px] border-2 border-black bg-card p-2 text-xs font-bold text-foreground shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  title="Show Correct Answer"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Subtitle / Feedback */}
          {itemStatus === "correct" && (
            <span className="text-[11px] font-black uppercase text-[#22C55E] block pl-1">
              ✓ Correct! Jumped to next word.
            </span>
          )}
          {itemStatus === "wrong" && !isBlinking && (
            <span className="text-[11px] font-black uppercase text-[#FF4D4D] block pl-1">
              ✕ Incorrect spelling. Try again & hit Enter!
            </span>
          )}
          {itemStatus === "revealed" && (
            <span className="text-[11px] font-black uppercase text-foreground block pl-1">
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

export interface UserStats {
  xp: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
  totalAnswered: number;
  totalCorrect: number;
  vocabularyLearned: number;
  sentencesPracticed: number;
  dailyGoal: number; // e.g. 15 questions per day
  todayCompleted: number;
}

export interface MistakeItem {
  id: string | number;
  gujarati: string;
  correctEnglish: string;
  answers?: string[];
  userAnswer: string;
  topic: string;
  type: "vocabulary" | "sentence";
  timestamp: number;
}

export interface FavoriteItem {
  id: string | number;
  gujarati: string;
  english: string;
  categoryOrTopic: string;
  type: "vocabulary" | "sentence";
  phonetic?: string;
  example?: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
  xp: number;
}

export interface ExamDraft {
  examId: string;
  examType: "vocabulary" | "sentence" | "mixed";
  sectionId?: string;
  currentIndex: number;
  listUserAnswers?: Record<number, string>;
  listStatuses?: Record<number, "idle" | "correct" | "wrong" | "revealed">;
  correctCount: number;
  sessionXP: number;
  mistakesList: any[];
  timestamp: number;
}

const DEFAULT_STATS: UserStats = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  accuracy: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  vocabularyLearned: 0,
  sentencesPracticed: 0,
  dailyGoal: 15,
  todayCompleted: 0,
};

const DEFAULT_MISTAKES: MistakeItem[] = [];

const DEFAULT_FAVORITES: FavoriteItem[] = [];

export const storage = {
  getStats: (): UserStats => {
    if (typeof window === "undefined") return DEFAULT_STATS;
    const data = localStorage.getItem("gem_user_stats");
    if (!data) return DEFAULT_STATS;
    try {
      const parsed = JSON.parse(data);
      // Migration: If user still has legacy mock stats with streak = 5 and xp = 420, clear to 0
      if (parsed.xp === 420 && parsed.streak === 5) {
        localStorage.removeItem("gem_user_stats");
        return DEFAULT_STATS;
      }
      return parsed;
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats: (stats: UserStats) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("gem_user_stats", JSON.stringify(stats));
  },

  addXP: (amount: number, isCorrect: boolean) => {
    const stats = storage.getStats();
    stats.xp += amount;
    stats.totalAnswered += 1;
    if (isCorrect) {
      stats.totalCorrect += 1;
      stats.streak += 1;
      if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
    } else {
      stats.streak = 0;
    }
    stats.todayCompleted += 1;
    stats.accuracy = Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
    storage.saveStats(stats);
    storage.recordActivity(amount);
    return stats;
  },

  getMistakes: (): MistakeItem[] => {
    if (typeof window === "undefined") return DEFAULT_MISTAKES;
    const data = localStorage.getItem("gem_mistakes");
    return data ? JSON.parse(data) : DEFAULT_MISTAKES;
  },

  addMistake: (mistake: MistakeItem) => {
    const mistakes = storage.getMistakes();
    const updated = [mistake, ...mistakes.filter((m) => m.id !== mistake.id)];
    localStorage.setItem("gem_mistakes", JSON.stringify(updated));
  },

  removeMistake: (id: string | number) => {
    const mistakes = storage.getMistakes();
    const updated = mistakes.filter((m) => m.id !== id);
    localStorage.setItem("gem_mistakes", JSON.stringify(updated));
  },

  getFavorites: (): FavoriteItem[] => {
    if (typeof window === "undefined") return DEFAULT_FAVORITES;
    const data = localStorage.getItem("gem_favorites");
    return data ? JSON.parse(data) : DEFAULT_FAVORITES;
  },

  toggleFavorite: (item: FavoriteItem): boolean => {
    const favorites = storage.getFavorites();
    const exists = favorites.some((f) => f.id === item.id);
    let updated: FavoriteItem[];
    if (exists) {
      updated = favorites.filter((f) => f.id !== item.id);
    } else {
      updated = [item, ...favorites];
    }
    localStorage.setItem("gem_favorites", JSON.stringify(updated));
    return !exists;
  },

  recordActivity: (xpGained: number) => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().split("T")[0];
    const data = localStorage.getItem("gem_activity");
    let activities: DailyActivity[] = data ? JSON.parse(data) : [];
    const index = activities.findIndex((a) => a.date === today);
    if (index >= 0) {
      activities[index].count += 1;
      activities[index].xp += xpGained;
    } else {
      activities.push({ date: today, count: 1, xp: xpGained });
    }
    localStorage.setItem("gem_activity", JSON.stringify(activities));
  },

  getActivities: (): DailyActivity[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("gem_activity");
    return data ? JSON.parse(data) : [];
  },

  // Exam Draft Auto-Save & Resume Methods
  getExamDraft: (examId: string): ExamDraft | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(`gem_exam_draft_${examId}`);
    if (!data) return null;
    try {
      const parsed: ExamDraft = JSON.parse(data);
      if (Date.now() - parsed.timestamp > 48 * 3600 * 1000) {
        localStorage.removeItem(`gem_exam_draft_${examId}`);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  saveExamDraft: (draft: Omit<ExamDraft, "timestamp">) => {
    if (typeof window === "undefined") return;
    const payload: ExamDraft = {
      ...draft,
      timestamp: Date.now(),
    };
    localStorage.setItem(`gem_exam_draft_${draft.examId}`, JSON.stringify(payload));
  },

  clearExamDraft: (examId: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`gem_exam_draft_${examId}`);
  },

  clearAllData: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("gem_user_stats");
    localStorage.removeItem("gem_mistakes");
    localStorage.removeItem("gem_favorites");
    localStorage.removeItem("gem_activity");
  },
};

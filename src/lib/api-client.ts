import { VocabQuestion } from "./vocabulary-data";

function getApiBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").trim();
  while (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
}

const TOKEN_KEY = "elt_auth_token";

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `API error: ${res.statusText}`);
  }

  return data as T;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  unlockedSections: string[];
  xp: number;
  streak: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export interface ContentResponse<T> {
  success: boolean;
  count: number;
  data: T;
  sectionId?: string;
}

export interface ProgressRecordResponse {
  success: boolean;
  scorePercentage: number;
  passed: boolean;
  xpEarned: number;
  totalXp: number;
  newlyUnlockedSection: string | null;
  unlockedSections: string[];
  message: string;
}

export interface AdminUserItem extends UserProfile {
  stats: {
    totalExams: number;
    passedCount: number;
    avgScore: number;
  };
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'module_unlock' | 'new_content' | 'achievement' | 'system';
  readBy: string[];
  createdAt: string;
}

export const apiClient = {
  // Auth APIs
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: (body: { email: string; password: string }) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    getMe: () => request<{ success: boolean; user: UserProfile }>("/auth/me"),
  },

  // Content APIs
  content: {
    getVocabulary: (sectionId?: string) =>
      request<ContentResponse<VocabQuestion[]>>(
        `/content/vocabulary${sectionId ? `?sectionId=${sectionId}` : ""}`
      ),

    getSentences: (topic?: string) =>
      request<ContentResponse<any[]>>(
        `/content/sentences${topic ? `?topic=${topic}` : ""}`
      ),
  },

  // User Performance & Progressive Unlocking APIs
  user: {
    getUnlockedSections: () =>
      request<{ success: boolean; unlockedSections: string[]; nextLockedSection: string | null }>(
        "/user/unlocked-sections"
      ),

    getProgress: () =>
      request<{
        success: boolean;
        xp: number;
        streak: number;
        unlockedSections: string[];
        history: any[];
      }>("/user/progress"),

    recordProgress: (body: {
      sectionId: string;
      examType?: string;
      totalQuestions: number;
      correctAnswers: number;
      xpEarned?: number;
    }) =>
      request<ProgressRecordResponse>("/user/progress", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  // Settings APIs
  settings: {
    getSettings: () => request<{ success: boolean; settings: any }>("/settings"),

    saveSettings: (body: {
      dailyGoal?: number;
      autoAdvanceMs?: number;
      soundEnabled?: boolean;
      theme?: "light" | "dark" | "system";
      geminiKey?: string;
    }) =>
      request<{ success: boolean; message: string; settings: any }>("/settings", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  // Admin Dashboard APIs
  admin: {
    getUsers: () => request<{ success: boolean; count: number; users: AdminUserItem[] }>("/admin/users"),

    unlockSection: (targetUserId: string, unlockedSections: string[]) =>
      request<{ success: boolean; message: string; user: UserProfile }>("/admin/unlock-section", {
        method: "POST",
        body: JSON.stringify({ targetUserId, unlockedSections }),
      }),
  },

  // Notifications API
  notifications: {
    getUnread: () =>
      request<{ success: boolean; count: number; notifications: AppNotification[] }>("/notifications"),

    markAsRead: (id: string) =>
      request<{ success: boolean; message: string }>(`/notifications/${id}/read`, {
        method: "PUT",
      }),

    markAllAsRead: () =>
      request<{ success: boolean; message: string }>("/notifications/read-all", {
        method: "PUT",
      }),
  },
};

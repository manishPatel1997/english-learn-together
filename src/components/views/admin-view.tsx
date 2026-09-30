"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  Sparkles,
  RefreshCw,
  Zap,
  BookOpen,
} from "lucide-react";
import { apiClient, AdminUserItem } from "@/lib/api-client";
import { useToast } from "@/components/beui/animated-toast-stack";
import { VOCABULARY_SECTIONS } from "@/lib/vocabulary-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { ThemeLoader } from "@/components/beui/loader";

const VOCAB_SECTION_KEYS = VOCABULARY_SECTIONS.map((s) => s.id);
const VOCAB_INDIVIDUAL_KEYS = VOCABULARY_SECTIONS.filter((s) => s.id !== "all").map((s) => s.id);

const SENTENCE_MODULES = [
  { id: "who_section", name: "Who Questions (કોણ)", icon: "👤", badge: "Who" },
  { id: "what_section", name: "What Questions (શું)", icon: "❓", badge: "What" },
  { id: "where_section", name: "Where Questions (ક્યાં)", icon: "📍", badge: "Where" },
  { id: "whose_section", name: "Whose Questions (કોનું)", icon: "🔑", badge: "Whose" },
  { id: "how_many_much_section", name: "How Many/Much", icon: "🔢", badge: "Count" },
  { id: "which_section", name: "Which Questions (કયું)", icon: "🎯", badge: "Which" },
  { id: "sentence_all", name: "All Sentence Modules", icon: "💬", badge: "Master" },
];

const SENTENCE_SECTION_KEYS = SENTENCE_MODULES.map((s) => s.id);
const ALL_SECTION_KEYS = [...VOCAB_SECTION_KEYS, ...SENTENCE_SECTION_KEYS];

export function AdminView() {
  const { toast } = useToast();
  const { user: currentUser, updateUnlockedSections } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  // Local state for user section permissions before saving
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.admin.getUsers();
      if (res.success && res.users) {
        setUsers(res.users);
        const permsMap: Record<string, string[]> = {};
        res.users.forEach((u) => {
          const rawPerms = u.unlockedSections || ["section1"];
          const set = new Set(rawPerms);
          if (set.has("all")) {
            VOCAB_SECTION_KEYS.forEach((k) => set.add(k));
          }
          if (set.has("sentence_all")) {
            SENTENCE_SECTION_KEYS.forEach((k) => set.add(k));
          }
          permsMap[u.id] = Array.from(set);
        });
        setUserPermissions(permsMap);
      }
    } catch (err: any) {
      toast({
        title: "Admin Fetch Failed ❌",
        description: err.message || "Failed to load users list. Ensure you are logged in as Admin.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSection = (userId: string, sectionId: string) => {
    setUserPermissions((prev) => {
      const current = prev[userId] || ["section1"];

      // Normalize current array: if 'all' or 'sentence_all' are present, expand them
      const currentSet = new Set(current);
      if (currentSet.has("all")) {
        VOCAB_SECTION_KEYS.forEach((k) => currentSet.add(k));
      }
      if (currentSet.has("sentence_all")) {
        SENTENCE_SECTION_KEYS.forEach((k) => currentSet.add(k));
      }

      const updatedSet = new Set(currentSet);

      if (sectionId === "all") {
        if (updatedSet.has("all")) {
          VOCAB_SECTION_KEYS.forEach((k) => updatedSet.delete(k));
        } else {
          VOCAB_SECTION_KEYS.forEach((k) => updatedSet.add(k));
        }
      } else if (sectionId === "sentence_all") {
        if (updatedSet.has("sentence_all")) {
          SENTENCE_SECTION_KEYS.forEach((k) => updatedSet.delete(k));
        } else {
          SENTENCE_SECTION_KEYS.forEach((k) => updatedSet.add(k));
        }
      } else {
        if (updatedSet.has(sectionId)) {
          updatedSet.delete(sectionId);
          if (VOCAB_INDIVIDUAL_KEYS.includes(sectionId)) {
            updatedSet.delete("all");
          }
          if (SENTENCE_SECTION_KEYS.includes(sectionId)) {
            updatedSet.delete("sentence_all");
          }
        } else {
          updatedSet.add(sectionId);
          const hasAllVocab = VOCAB_INDIVIDUAL_KEYS.every((s) =>
            updatedSet.has(s)
          );
          if (hasAllVocab) updatedSet.add("all");

          const sentenceModuleKeysOnly = SENTENCE_SECTION_KEYS.filter((s) => s !== "sentence_all");
          const hasAllSentence = sentenceModuleKeysOnly.every((s) => updatedSet.has(s));
          if (hasAllSentence) updatedSet.add("sentence_all");
        }
      }

      let updated = Array.from(updatedSet);
      if (updated.length === 0) updated = ["section1"];

      return { ...prev, [userId]: updated };
    });
  };

  const handleSaveUserPermissions = async (userItem: AdminUserItem) => {
    const updatedSections = userPermissions[userItem.id] || ["section1"];
    setSavingUserId(userItem.id);
    try {
      const res = await apiClient.admin.unlockSection(userItem.id, updatedSections);
      if (res.success) {
        if (currentUser && currentUser.id === userItem.id) {
          updateUnlockedSections(res.user.unlockedSections || updatedSections);
        }
        toast({
          title: "Module Permissions Saved! 🔓",
          description: `Updated section access for ${userItem.name} (${userItem.email}).`,
          type: "success",
        });
        fetchUsers();
      }
    } catch (err: any) {
      toast({
        title: "Save Failed ❌",
        description: err.message || "Could not update user permissions.",
        type: "error",
      });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleQuickUnlockAll = (userId: string) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: [...ALL_SECTION_KEYS],
    }));
  };

  const handleQuickResetDefault = (userId: string) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: ["section1"],
    }));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 select-none pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <ShieldCheck className="h-4 w-4 text-amber-500" /> Admin Control Panel
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            User Management & Module Unlocking
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            View user exam scores, streak metrics, and override module access permissions for any student.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex h-10 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-xs shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4 text-indigo-500", isLoading && "animate-spin")} />
          <span>Refresh Users List</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Registered Users</span>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-foreground">{users.length} Users</div>
          <span className="text-[11px] font-medium text-emerald-500">Active Database Accounts</span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">System Admin Accounts</span>
            <ShieldCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {users.filter((u) => u.role === "admin").length} Admins
          </div>
          <span className="text-[11px] font-medium text-amber-500">Full System Permissions</span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Exam Attempts</span>
            <Award className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {users.reduce((sum, u) => sum + (u.stats?.totalExams || 0), 0)} Exams
          </div>
          <span className="text-[11px] font-medium text-purple-500">Combined Student Attempts</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search registered students by name or email address..."
          className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-xs font-semibold text-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
        />
      </div>

      {/* Users List */}
      {isLoading ? (
        <ThemeLoader
          variant="card"
          title="Loading Users Database"
          subtitle="Fetching user performance metrics and section permissions..."
        />
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-border p-12 text-center space-y-2 bg-card">
          <p className="text-sm font-bold text-foreground">No users found matching "{searchQuery}"</p>
          <p className="text-xs text-muted-foreground">Try clearing your search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((userItem) => {
            const currentPerms = userPermissions[userItem.id] || userItem.unlockedSections || ["section1"];
            const isSaving = savingUserId === userItem.id;

            return (
              <motion.div
                key={userItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5"
              >
                {/* User Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-lg shadow-md shrink-0">
                      {userItem.name ? userItem.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-foreground truncate">
                          {userItem.name}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                            userItem.role === "admin"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          )}
                        >
                          {userItem.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{userItem.email}</p>
                    </div>
                  </div>

                  {/* User Key Metrics */}
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground shrink-0">
                    <div className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-center">
                      <span className="text-[10px] text-muted-foreground block">Exams / Passed</span>
                      <span className="text-foreground font-black">
                        {userItem.stats?.totalExams || 0} / {userItem.stats?.passedCount || 0}
                      </span>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-center">
                      <span className="text-[10px] text-muted-foreground block">Avg Score</span>
                      <span className="text-indigo-500 font-black">
                        {userItem.stats?.avgScore || 0}%
                      </span>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-center">
                      <span className="text-[10px] text-muted-foreground block">Earned XP</span>
                      <span className="text-amber-500 font-black">⚡ {userItem.xp || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Section Unlock Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                      <Unlock className="h-4 w-4 text-indigo-500" /> Module Access Permissions (Check to unlock)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickUnlockAll(userItem.id)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Unlock All Modules
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button
                        type="button"
                        onClick={() => handleQuickResetDefault(userItem.id)}
                        className="text-[11px] font-bold text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>

                  {/* Vocabulary Section Selection Toggles */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      📚 Vocabulary Sections
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {VOCABULARY_SECTIONS.map((sec) => {
                        const isUnlocked = currentPerms.includes(sec.id);
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => handleToggleSection(userItem.id, sec.id)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-2xl border text-left transition-all select-none",
                              isUnlocked
                                ? "border-indigo-500/50 bg-indigo-500/10 text-foreground ring-1 ring-indigo-500/30"
                                : "border-border bg-card text-muted-foreground hover:border-border/80"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-xs">{sec.icon}</span>
                              {isUnlocked ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 block">
                              {sec.stepLabel}
                            </span>
                            <span className="text-xs font-extrabold truncate w-full">{sec.shortName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sentence & Grammar Modules Toggles */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                      💬 Sentence & Grammar Modules
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                      {SENTENCE_MODULES.map((mod) => {
                        const isUnlocked = currentPerms.includes(mod.id);
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => handleToggleSection(userItem.id, mod.id)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-2xl border text-left transition-all select-none",
                              isUnlocked
                                ? "border-purple-500/50 bg-purple-500/10 text-foreground ring-1 ring-purple-500/30"
                                : "border-border bg-card text-muted-foreground hover:border-border/80"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-xs">{mod.icon}</span>
                              {isUnlocked ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 block">
                              {mod.badge}
                            </span>
                            <span className="text-xs font-extrabold truncate w-full">{mod.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Save Permissions Footer */}
                {(() => {
                  const unlockedCount =
                    VOCABULARY_SECTIONS.filter((sec) => currentPerms.includes(sec.id)).length +
                    SENTENCE_MODULES.filter((mod) => currentPerms.includes(mod.id)).length;

                  return (
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Currently unlocked: <strong className="text-foreground">{unlockedCount} Modules</strong>
                      </span>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveUserPermissions(userItem)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-extrabold text-xs px-5 shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" /> Save User Permissions
                          </>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

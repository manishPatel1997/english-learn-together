"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  RefreshCw,
} from "lucide-react";
import { apiClient, AdminUserItem } from "@/lib/api-client";
import { useToast } from "@/components/beui/animated-toast-stack";
import { VOCABULARY_SECTIONS } from "@/lib/vocabulary-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { ThemeLoader } from "@/components/beui/loader";

const VOCAB_SECTION_KEYS = VOCABULARY_SECTIONS.map((s) => s.id);

const SENTENCE_MODULES = [
  { id: "who_section", name: "Who (કોણ)", icon: "👤", badge: "Who" },
  { id: "what_section", name: "What (શું)", icon: "❓", badge: "What" },
  { id: "where_section", name: "Where (ક્યાં)", icon: "📍", badge: "Where" },
  { id: "whose_section", name: "Whose (કોનું)", icon: "🔑", badge: "Whose" },
  { id: "how_many_much_section", name: "How Many/Much", icon: "🔢", badge: "Count" },
  { id: "which_section", name: "Which (કયું)", icon: "🎯", badge: "Which" },
  { id: "sentence_all", name: "All Sentences", icon: "💬", badge: "Master" },
];

const SENTENCE_SECTION_KEYS = SENTENCE_MODULES.map((s) => s.id);

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

      const currentSet = new Set(current);
      if (currentSet.has("all")) {
        VOCAB_SECTION_KEYS.forEach((k) => currentSet.add(k));
      }
      if (currentSet.has("sentence_all")) {
        SENTENCE_SECTION_KEYS.forEach((k) => currentSet.add(k));
      }

      const updatedSet = new Set(currentSet);
      if (updatedSet.has(sectionId)) {
        if (sectionId !== "section1" && sectionId !== "who_section") {
          updatedSet.delete(sectionId);
        }
      } else {
        updatedSet.add(sectionId);
      }

      return {
        ...prev,
        [userId]: Array.from(updatedSet),
      };
    });
  };

  const handleSaveUserPermissions = async (userItem: AdminUserItem) => {
    const rawPerms = userPermissions[userItem.id] || ["section1"];
    setSavingUserId(userItem.id);
    try {
      const res = await apiClient.admin.updateUserPermissions(userItem.id, rawPerms);
      if (res.success) {
        toast({
          title: "Permissions Saved! 🛡️",
          description: `Updated module access permissions for ${userItem.name}.`,
          type: "success",
        });

        if (currentUser && currentUser.id === userItem.id) {
          updateUnlockedSections(rawPerms);
        }

        setUsers((prev) =>
          prev.map((u) => (u.id === userItem.id ? { ...u, unlockedSections: rawPerms } : u))
        );
      }
    } catch (err: any) {
      toast({
        title: "Permission Update Failed ❌",
        description: err.message || "Could not save user section access.",
        type: "error",
      });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleQuickUnlockAll = (userId: string) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: [...VOCAB_SECTION_KEYS, ...SENTENCE_SECTION_KEYS],
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
    <div className="space-y-7 w-full select-none pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212]">
            <ShieldCheck className="h-4 w-4 stroke-[2.5]" /> Admin Control Panel
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-1">
            User Management & Module Unlocking
          </h2>
          <p className="text-xs font-bold text-muted-foreground max-w-xl">
            View user exam scores, streak metrics, and override module access permissions for any student.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex h-10 items-center gap-2 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 px-4 text-xs font-black uppercase text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff] transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className={cn("h-4 w-4 stroke-[2.5]", isLoading && "animate-spin")} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-black uppercase">Registered Users</span>
            <Users className="h-5 w-5 text-black dark:text-white stroke-[2.5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{users.length} Users</div>
          <span className="text-[10px] font-black uppercase text-[#22C55E]">Active Database Accounts</span>
        </div>

        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-black uppercase">Admin Accounts</span>
            <ShieldCheck className="h-5 w-5 text-[#FF6B00] stroke-[2.5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {users.filter((u) => u.role === "admin").length} Admins
          </div>
          <span className="text-[10px] font-black uppercase text-[#FF6B00]">Full Permissions</span>
        </div>

        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-black uppercase">Exam Attempts</span>
            <Award className="h-5 w-5 text-[#FFE600] stroke-[2.5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {users.reduce((sum, u) => sum + (u.stats?.totalExams || 0), 0)} Exams
          </div>
          <span className="text-[10px] font-black uppercase text-neutral-600 dark:text-neutral-400">Combined Attempts</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-black dark:text-white stroke-[2.5]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search registered students by name or email address..."
          className="w-full rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 pl-11 pr-4 py-3 text-xs font-bold text-foreground outline-none shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff]"
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
        <div className="rounded-[4px] border-2 border-black p-12 text-center space-y-2 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#121212]">
          <p className="text-sm font-black uppercase text-foreground">No users found matching "{searchQuery}"</p>
          <p className="text-xs font-bold text-muted-foreground">Try clearing your search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((userItem) => {
            const currentPerms = userPermissions[userItem.id] || userItem.unlockedSections || ["section1"];
            const isSaving = savingUserId === userItem.id;

            return (
              <div
                key={userItem.id}
                className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff] space-y-5"
              >
                {/* User Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#FFE600] text-black font-black text-base shadow-[2px_2px_0px_#121212] shrink-0">
                      {userItem.name ? userItem.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-foreground uppercase truncate">
                          {userItem.name}
                        </h3>
                        <span
                          className={cn(
                            "rounded-[2px] border border-black px-2 py-0.2 text-[9px] font-black uppercase tracking-wider",
                            userItem.role === "admin"
                              ? "bg-[#FF4D4D] text-white"
                              : "bg-[#FFE600] text-black"
                          )}
                        >
                          {userItem.role}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground truncate">{userItem.email}</p>
                    </div>
                  </div>

                  {/* User Key Metrics */}
                  <div className="flex items-center gap-2 sm:gap-3 text-xs font-black text-muted-foreground shrink-0">
                    <div className="rounded-[3px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-800 px-3 py-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[9px] uppercase block">Exams</span>
                      <span className="text-foreground">
                        {userItem.stats?.totalExams || 0} / {userItem.stats?.passedCount || 0}
                      </span>
                    </div>

                    <div className="rounded-[3px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-800 px-3 py-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[9px] uppercase block">Avg Score</span>
                      <span className="text-[#FF6B00]">
                        {userItem.stats?.avgScore || 0}%
                      </span>
                    </div>

                    <div className="rounded-[3px] border-2 border-black bg-[#FAF7F2] dark:bg-zinc-800 px-3 py-1.5 text-center shadow-[2px_2px_0px_#121212]">
                      <span className="text-[9px] uppercase block">Earned XP</span>
                      <span className="text-foreground">⚡ {userItem.xp || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Section Unlock Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-foreground flex items-center gap-1.5">
                      <Unlock className="h-4 w-4 stroke-[2.5]" /> Permissions (Click to toggle)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickUnlockAll(userItem.id)}
                        className="text-[11px] font-black uppercase text-[#FF6B00] hover:underline cursor-pointer"
                      >
                        Unlock All
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleQuickResetDefault(userItem.id)}
                        className="text-[11px] font-black uppercase text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>

                  {/* Vocabulary Section Selection Toggles */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
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
                              "flex flex-col items-start p-2.5 rounded-[3px] border-2 text-left transition-all select-none cursor-pointer",
                              isUnlocked
                                ? "border-black bg-[#FFE600] text-black font-black shadow-[2px_2px_0px_#121212]"
                                : "border-black/30 dark:border-white/30 bg-[#FAF7F2] dark:bg-zinc-800 text-muted-foreground hover:border-black"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-xs">{sec.icon}</span>
                              {isUnlocked ? (
                                <CheckCircle2 className="h-3.5 w-3.5 stroke-[3] text-black" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 stroke-[2.5] text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-[9px] uppercase block">
                              {sec.stepLabel}
                            </span>
                            <span className="text-xs truncate w-full">{sec.shortName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sentence Modules Toggles */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
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
                              "flex flex-col items-start p-2.5 rounded-[3px] border-2 text-left transition-all select-none cursor-pointer",
                              isUnlocked
                                ? "border-black bg-[#FFE600] text-black font-black shadow-[2px_2px_0px_#121212]"
                                : "border-black/30 dark:border-white/30 bg-[#FAF7F2] dark:bg-zinc-800 text-muted-foreground hover:border-black"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-xs">{mod.icon}</span>
                              {isUnlocked ? (
                                <CheckCircle2 className="h-3.5 w-3.5 stroke-[3] text-black" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 stroke-[2.5] text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-[9px] uppercase block">
                              {mod.badge}
                            </span>
                            <span className="text-xs truncate w-full">{mod.name}</span>
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
                    <div className="flex items-center justify-between pt-2 border-t-2 border-black/10 dark:border-white/10">
                      <span className="text-[11px] font-black uppercase text-muted-foreground">
                        Unlocked: <strong className="text-foreground">{unlockedCount} Modules</strong>
                      </span>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveUserPermissions(userItem)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[3px] border-2 border-black bg-[#22C55E] text-black font-black uppercase text-xs px-4 shadow-[2.5px_2.5px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSaving ? (
                          <span>Saving...</span>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" /> Save Permissions
                          </>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

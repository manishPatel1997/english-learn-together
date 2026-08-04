"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  Flame,
  Zap,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { NumberAnimation } from "@/components/beui/number-animation";
import { ExpandableTabs } from "@/components/beui/expandable-tabs";
import { storage, type UserStats } from "@/lib/storage";

interface ProgressViewProps {
  stats: UserStats;
}

export function ProgressView({ stats }: ProgressViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate REAL weekly activity data for past 7 days from storage
  const activities = storage.getActivities();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayName = daysOfWeek[d.getDay()];
    const found = activities.find((a) => a.date === dateStr);
    return {
      day: dayName,
      questions: found ? found.count : 0,
      xp: found ? found.xp : 0,
      accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0,
    };
  });

  const topicAccuracyData = [
    { topic: "Whose", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "Which", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "How Many", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "Where", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "Can / Could", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "Will / Would", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
    { topic: "Has / Had", accuracy: stats.totalAnswered > 0 ? stats.accuracy : 0 },
  ];

  // REAL Activity Heatmap data for past 112 days (16 weeks)
  const heatmapData = Array.from({ length: 112 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (111 - i));
    const dateStr = d.toISOString().split("T")[0];
    const found = activities.find((a) => a.date === dateStr);
    return {
      id: i,
      count: found ? found.count : 0,
    };
  });

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-muted border-border";
    if (count < 4) return "bg-indigo-500/30 border-indigo-500/40";
    if (count < 8) return "bg-indigo-500/60 border-indigo-500/70";
    return "bg-indigo-600 border-indigo-700 shadow-xs";
  };

  return (
    <div className="space-y-8 pb-10 select-none">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Learning Analytics & Progress
          </h2>
          <p className="text-xs text-muted-foreground">
            Track your daily consistency, accuracy trends, and mastery growth
          </p>
        </div>

        <ExpandableTabs
          tabs={[
            { id: "overview", label: "Overview", icon: <TrendingUp className="h-3.5 w-3.5" /> },
            { id: "accuracy", label: "Topic Breakdown", icon: <Award className="h-3.5 w-3.5" /> },
            { id: "heatmap", label: "Activity Heatmap", icon: <Calendar className="h-3.5 w-3.5" /> },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-[22px] border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Total XP Earned</span>
            <Zap className="h-4 w-4 text-indigo-500 fill-indigo-500" />
          </div>
          <NumberAnimation value={stats.xp} className="text-3xl font-black text-foreground" />
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +{stats.todayCompleted * 15} XP today
          </p>
        </div>

        <div className="rounded-[22px] border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Current Streak</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <NumberAnimation value={stats.streak} className="text-3xl font-black text-foreground" suffix=" Days" />
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Personal Best: {stats.bestStreak} days
          </p>
        </div>

        <div className="rounded-[22px] border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Overall Accuracy</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-foreground block">{stats.accuracy}%</span>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Based on {stats.totalAnswered} questions
          </p>
        </div>

        <div className="rounded-[22px] border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Vocabulary Learned</span>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </div>
          <NumberAnimation value={stats.vocabularyLearned} className="text-3xl font-black text-foreground" suffix=" Words" />
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            {stats.vocabularyLearned} mastered words
          </p>
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Questions Area Chart */}
          <div className="lg:col-span-7 rounded-[26px] border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-foreground">Weekly Practice Volume</h3>
              <span className="text-xs text-muted-foreground">Questions per day</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="questions"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorQuestions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Progress Bar Chart */}
          <div className="lg:col-span-5 rounded-[26px] border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-foreground">Daily XP Growth</h3>
              <span className="text-xs text-muted-foreground">XP earned</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="xp" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "accuracy" && (
        <div className="rounded-[26px] border border-border bg-card p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-foreground">Topic Accuracy Breakdown</h3>
              <p className="text-xs text-muted-foreground">Identify high-mastery topics vs. areas needing practice</p>
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            {topicAccuracyData.map((item) => (
              <div key={item.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground">{item.topic} Module</span>
                  <span className={item.accuracy < 80 ? "text-amber-500 font-extrabold" : "text-emerald-500 font-extrabold"}>
                    {item.accuracy}% Accuracy
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.accuracy}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      item.accuracy < 80
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "heatmap" && (
        <div className="rounded-[26px] border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-foreground">365-Day Activity Heatmap</h3>
              <p className="text-xs text-muted-foreground">Visual log of daily practice contributions</p>
            </div>
            <span className="text-xs font-bold text-indigo-500">112 Sessions Logged</span>
          </div>

          <div className="pt-4">
            <div className="grid grid-flow-col grid-rows-7 gap-2 overflow-x-auto pb-4">
              {heatmapData.map((d) => (
                <div
                  key={d.id}
                  title={`Activity Level: ${d.count}`}
                  className={`h-4 w-4 rounded-md border ${getHeatmapColor(d.count)} transition-transform hover:scale-125 cursor-pointer`}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground pt-2">
              <span>Less</span>
              <div className="h-3 w-3 rounded-xs bg-muted border border-border" />
              <div className="h-3 w-3 rounded-xs bg-indigo-500/30 border border-indigo-500/40" />
              <div className="h-3 w-3 rounded-xs bg-indigo-500/60 border border-indigo-500/70" />
              <div className="h-3 w-3 rounded-xs bg-indigo-600 border border-indigo-700" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  Award,
  Calendar,
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
    if (count === 0) return "bg-[#FAF7F2] dark:bg-zinc-800 border-black dark:border-white";
    if (count < 4) return "bg-[#FEF08A] border-black text-black";
    if (count < 8) return "bg-[#FACC15] border-black text-black";
    return "bg-[#22C55E] border-black text-black shadow-[1px_1px_0px_#000]";
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12 select-none">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
            Learning Analytics & Progress
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            Track your daily consistency, accuracy trends, and mastery growth
          </p>
        </div>

        <ExpandableTabs
          tabs={[
            { id: "overview", label: "Overview", icon: <TrendingUp className="h-3.5 w-3.5 stroke-[2.5]" /> },
            { id: "accuracy", label: "Topic Breakdown", icon: <Award className="h-3.5 w-3.5 stroke-[2.5]" /> },
            { id: "heatmap", label: "Activity Heatmap", icon: <Calendar className="h-3.5 w-3.5 stroke-[2.5]" /> },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
            <span>Total XP Earned</span>
            <div className="p-1 rounded-[2px] border border-black bg-[#FFE600] text-black">
              <Zap className="h-3.5 w-3.5 fill-[#FFE600] stroke-[2.5]" />
            </div>
          </div>
          <NumberAnimation value={stats.xp} className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" />
          <p className="text-[11px] text-[#22C55E] dark:text-[#4ADE80] font-black uppercase">
            +{stats.todayCompleted * 15} XP today
          </p>
        </div>

        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
            <span>Current Streak</span>
            <div className="p-1 rounded-[2px] border border-black bg-[#FF6B00] text-white">
              <Flame className="h-3.5 w-3.5 fill-white stroke-[2.5]" />
            </div>
          </div>
          <NumberAnimation value={stats.streak} className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" suffix=" Days" />
          <p className="text-[11px] text-[#FF6B00] font-black uppercase">
            Personal Best: {stats.bestStreak} days
          </p>
        </div>

        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
            <span>Overall Accuracy</span>
            <div className="p-1 rounded-[2px] border border-black bg-[#22C55E] text-black">
              <TrendingUp className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight">{stats.accuracy}%</span>
          <p className="text-[11px] text-[#22C55E] dark:text-[#4ADE80] font-black uppercase">
            Based on {stats.totalAnswered} questions
          </p>
        </div>

        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-5 space-y-2 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-black uppercase">
            <span>Words Learned</span>
            <div className="p-1 rounded-[2px] border border-black bg-[#FFE600] text-black">
              <BookOpen className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </div>
          <NumberAnimation value={stats.vocabularyLearned} className="text-2xl sm:text-3xl font-black text-foreground block tracking-tight" suffix=" Words" />
          <p className="text-[11px] text-muted-foreground font-black uppercase">
            {stats.vocabularyLearned} mastered words
          </p>
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Practice Volume */}
          <div className="lg:col-span-7 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
            <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-foreground">Weekly Practice Volume</h3>
              <span className="text-xs font-bold text-muted-foreground">Questions / Day</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#121212" fontSize={11} fontWeight={800} />
                  <YAxis stroke="#121212" fontSize={11} fontWeight={800} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#18181B",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="questions"
                    stroke="#FF6B00"
                    strokeWidth={3}
                    fillOpacity={0.6}
                    fill="#FFE600"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Progress Bar Chart */}
          <div className="lg:col-span-5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
            <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-foreground">Daily XP Growth</h3>
              <span className="text-xs font-bold text-muted-foreground">XP Earned</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" stroke="#121212" fontSize={11} fontWeight={800} />
                  <YAxis stroke="#121212" fontSize={11} fontWeight={800} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#18181B",
                      border: "2px solid #000000",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  />
                  <Bar dataKey="xp" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "accuracy" && (
        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-6 space-y-6 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
          <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-foreground">Topic Accuracy Breakdown</h3>
              <p className="text-xs font-bold text-muted-foreground">Identify high-mastery topics vs. areas needing practice</p>
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            {topicAccuracyData.map((item) => (
              <div key={item.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                  <span className="text-foreground">{item.topic} Module</span>
                  <span className={item.accuracy < 80 ? "text-[#FF6B00]" : "text-[#22C55E]"}>
                    {item.accuracy}% Accuracy
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-[2px] bg-[#FAF7F2] dark:bg-zinc-800 border-2 border-black dark:border-white p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.accuracy}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full border-r-2 border-black ${
                      item.accuracy < 80
                        ? "bg-[#FF6B00]"
                        : "bg-[#22C55E]"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "heatmap" && (
        <div className="rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]">
          <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-foreground">Activity Heatmap</h3>
              <p className="text-xs font-bold text-muted-foreground">Visual log of daily practice contributions</p>
            </div>
            <span className="text-xs font-black uppercase bg-[#FFE600] text-black px-2 py-0.5 border border-black rounded-[2px] shadow-[1.5px_1.5px_0px_#121212]">
              112 Sessions Logged
            </span>
          </div>

          <div className="pt-2">
            {/* Scroll Affordance Indicator for Mobile */}
            <div className="sm:hidden flex items-center justify-between pb-2 text-[10px] font-black uppercase text-muted-foreground">
              <span className="inline-flex items-center gap-1 bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 rounded-[2px] border border-black dark:border-white">
                ← Swipe to view all 16 weeks →
              </span>
              <span>16 Weeks</span>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-4">
              {heatmapData.map((d) => (
                <div
                  key={d.id}
                  title={`Activity Level: ${d.count}`}
                  className={`h-4 w-4 rounded-[2px] border-2 ${getHeatmapColor(d.count)} transition-transform hover:scale-125 cursor-pointer`}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase text-muted-foreground pt-2">
              <span>Less</span>
              <div className="h-3.5 w-3.5 rounded-[1px] bg-[#FAF7F2] border border-black" />
              <div className="h-3.5 w-3.5 rounded-[1px] bg-[#FEF08A] border border-black" />
              <div className="h-3.5 w-3.5 rounded-[1px] bg-[#FACC15] border border-black" />
              <div className="h-3.5 w-3.5 rounded-[1px] bg-[#22C55E] border border-black" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

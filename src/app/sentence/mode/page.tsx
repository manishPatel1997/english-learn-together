"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, BookOpen, Star, Sparkles, ArrowLeft } from "lucide-react";
import { SentenceSubNav } from "@/components/layout/sentence-sub-nav";

function SentenceModeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicsParam = searchParams.get("topics") || "";

  const handleSelectMode = (mode: "study" | "exam") => {
    const url = `/sentence/${mode}${topicsParam ? `?topics=${encodeURIComponent(topicsParam)}` : ""}`;
    router.push(url);
  };

  const selectedTopicsCount = topicsParam ? topicsParam.split(",").length : 0;

  return (
    <div className="space-y-6 w-full pb-12 select-none">
      <SentenceSubNav />

      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={() => router.push("/sentence")}
          className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Topic Selection</span>
        </button>

        {selectedTopicsCount > 0 && (
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400">
            {selectedTopicsCount} Topic(s) Selected
          </span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 pt-2"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-4 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
          <Sparkles className="h-3.5 w-3.5" /> Next Step: Learning Mode
        </span>
        <h2 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
          Choose How You Want to Practice
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Read and study Gujarati sentence translations first or jump straight into the practice exam.
        </p>
      </motion.div>

      {/* Mode Cards Grid (Image 2 representation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Card 1: Read & Study Sentences */}
        <div
          onClick={() => handleSelectMode("study")}
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
              📖 Read & Study Sentences
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Read Gujarati sentences, listen to audio pronunciations, and study sentence structure formulas at your own pace.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Grammar Structure Formula Guide</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Gujarati & English Audio 🔊</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>All Accepted Answer Variants</span>
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

        {/* Card 2: Take Sentence Exam */}
        <div
          onClick={() => handleSelectMode("exam")}
          className="cursor-pointer rounded-[32px] border border-purple-500/30 bg-card p-8 shadow-xl hover:border-purple-500 hover:shadow-2xl transition-all space-y-6 group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Star className="h-7 w-7" />
            </div>
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 inline-block">
              Page 2 • Practice Exam Mode
            </span>
            <h3 className="text-2xl font-black text-foreground group-hover:text-purple-600 transition-colors">
              ✍️ Take Sentence Exam
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Test your sentence translation! Type English sentences to earn +25 XP, build streaks, and get instant Gemini AI feedback.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Sentence Typing & Word Diff Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Gemini AI Tutor Explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>+25 XP per Correct Translation</span>
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

export default function SentenceModePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Mode Options...</div>}>
      <SentenceModeContent />
    </Suspense>
  );
}

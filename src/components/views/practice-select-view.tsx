import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Volume2, Shuffle, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { TiltCard } from "@/components/beui/tilt-card";
import { StatefulButton } from "@/components/beui/stateful-button";

interface PracticeSelectViewProps {
  onSelectMode: (mode: "vocabulary" | "sentence" | "sentence-reading" | "mixed") => void;
}

export function PracticeSelectView({ onSelectMode }: PracticeSelectViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 select-none">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" /> Interactive Learning Modes
        </span>
        <h2 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
          Choose Your Practice Mode
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Select how you want to train your Gujarati language skills today. Each module opens in a dedicated route.
        </p>
      </motion.div>

      {/* 4 Large Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {/* Vocabulary Card */}
        <TiltCard
          onClick={() => onSelectMode("vocabulary")}
          className="flex flex-col justify-between p-6 border-indigo-500/30 hover:border-indigo-500 transition-all bg-card min-h-[380px] group"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white shadow-xl shadow-indigo-500/30 mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>

            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 inline-block mb-3">
              Spelling & Vocabulary
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Vocabulary Practice
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Master Gujarati word spellings with audio hints, phonetics, and instant feedback.
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>60+ Gujarati Words</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Audio Pronunciation</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between">
            <span>Start Vocab</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Sentence Practice Card */}
        <TiltCard
          onClick={() => onSelectMode("sentence")}
          className="flex flex-col justify-between p-6 border-purple-500/30 hover:border-purple-500 transition-all bg-card min-h-[380px] group"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/30 mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-7 w-7" />
            </div>

            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 inline-block mb-3">
              Grammar & Translation
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Sentence Practice
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Practice full sentence translation across 10 grammar modules on route /sentence.
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Topic Selection & Quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Word Difference Analysis</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between bg-purple-600 hover:bg-purple-700">
            <span>Open /sentence</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Sentence Reading AI Card */}
        <TiltCard
          onClick={() => router.push("/sentence-reading")}
          className="flex flex-col justify-between p-6 border-purple-500/30 hover:border-purple-500 transition-all bg-card min-h-[380px] group"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 text-white shadow-xl shadow-purple-600/30 mb-5 group-hover:scale-110 transition-transform">
              <Volume2 className="h-7 w-7" />
            </div>

            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 inline-block mb-3">
              AI Speech & Reading
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Sentence Reading AI
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Listen to native voice reading, practice speaking via mic, and get AI reading guides on route /sentence-reading.
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Speech Synthesis & Mic</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Gemini Phonetics Breakdown</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between bg-purple-600 hover:bg-purple-700">
            <span>Open /sentence-reading</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Mixed Practice Card */}
        <TiltCard
          onClick={() => onSelectMode("mixed")}
          className="flex flex-col justify-between p-6 border-emerald-500/30 hover:border-emerald-500 transition-all bg-card min-h-[380px] group"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 mb-5 group-hover:scale-110 transition-transform">
              <Shuffle className="h-7 w-7" />
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 inline-block mb-3">
              Full Spectrum Master
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Mixed Practice
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Randomized vocabulary and sentence questions to test your overall mastery.
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>2x Bonus XP Multiplier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Comprehensive Evaluation</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="success" className="w-full justify-between">
            <span>Start Mixed</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>
      </div>
    </div>
  );
}

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
    <div className="space-y-8 w-full pb-12 select-none">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <span className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black bg-[#FFE600] px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#121212]">
          <Sparkles className="h-3.5 w-3.5 fill-black" /> Interactive Learning Modes
        </span>
        <h2 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl uppercase">
          Choose Your Practice Mode
        </h2>
        <p className="text-sm font-medium text-muted-foreground max-w-lg mx-auto">
          Select how you want to train your Gujarati language skills today. Each module opens in a dedicated route.
        </p>
      </motion.div>

      {/* 4 Large Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {/* Vocabulary Card */}
        <TiltCard
          onClick={() => onSelectMode("vocabulary")}
          className="flex flex-col justify-between p-6 border-[2.5px] border-black dark:border-white shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000] rounded-[6px] bg-card min-h-[380px] group cursor-pointer"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[4px] bg-[#FFE600] text-black border-2 border-black shadow-[3px_3px_0px_#121212] mb-5 group-hover:scale-105 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>

            <span className="rounded-[3px] border-2 border-black bg-[#EFE8DD] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-foreground inline-block mb-3">
              Spelling & Vocabulary
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 uppercase">
              Vocabulary Practice
            </h3>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
              Master Gujarati word spellings with audio hints, phonetics, and instant feedback.
            </p>

            <ul className="space-y-2 text-xs font-bold text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>60+ Gujarati Words</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Audio Pronunciation</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between font-black uppercase tracking-wider">
            <span>Start Vocab</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Sentence Practice Card */}
        <TiltCard
          onClick={() => onSelectMode("sentence")}
          className="flex flex-col justify-between p-6 border-[2.5px] border-black dark:border-white shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000] rounded-[6px] bg-card min-h-[380px] group cursor-pointer"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[4px] bg-[#FF6B00] text-black border-2 border-black shadow-[3px_3px_0px_#121212] mb-5 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>

            <span className="rounded-[3px] border-2 border-black bg-[#EFE8DD] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-foreground inline-block mb-3">
              Grammar & Translation
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 uppercase">
              Sentence Practice
            </h3>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
              Practice full sentence translation across 10 grammar modules on route /sentence.
            </p>

            <ul className="space-y-2 text-xs font-bold text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Topic Selection & Quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Word Difference Analysis</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between font-black uppercase tracking-wider bg-[#FF6B00] text-white">
            <span>Open /sentence</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Sentence Reading AI Card */}
        <TiltCard
          onClick={() => router.push("/sentence-reading")}
          className="flex flex-col justify-between p-6 border-[2.5px] border-black dark:border-white shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000] rounded-[6px] bg-card min-h-[380px] group cursor-pointer"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[4px] bg-[#22C55E] text-white border-2 border-black shadow-[3px_3px_0px_#121212] mb-5 group-hover:scale-105 transition-transform">
              <Volume2 className="h-7 w-7" />
            </div>

            <span className="rounded-[3px] border-2 border-black bg-[#EFE8DD] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-foreground inline-block mb-3">
              AI Speech & Reading
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 uppercase">
              Sentence Reading AI
            </h3>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
              Listen to native voice reading, practice speaking via mic, and get AI reading guides on route /sentence-reading.
            </p>

            <ul className="space-y-2 text-xs font-bold text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Speech Synthesis & Mic</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Gemini Phonetics Breakdown</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="primary" className="w-full justify-between font-black uppercase tracking-wider bg-[#18181B] text-white">
            <span>Open Reading AI</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>

        {/* Mixed Practice Card */}
        <TiltCard
          onClick={() => onSelectMode("mixed")}
          className="flex flex-col justify-between p-6 border-[2.5px] border-black dark:border-white shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#000] rounded-[6px] bg-card min-h-[380px] group cursor-pointer"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[4px] bg-[#FF4D4D] text-white border-2 border-black shadow-[3px_3px_0px_#121212] mb-5 group-hover:scale-105 transition-transform">
              <Shuffle className="h-7 w-7" />
            </div>

            <span className="rounded-[3px] border-2 border-black bg-[#EFE8DD] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-foreground inline-block mb-3">
              Full Spectrum Master
            </span>

            <h3 className="text-xl font-black text-foreground mb-2 uppercase">
              Mixed Practice
            </h3>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
              Randomized vocabulary and sentence questions to test your overall mastery.
            </p>

            <ul className="space-y-2 text-xs font-bold text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>2x Bonus XP Multiplier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
                <span>Comprehensive Evaluation</span>
              </li>
            </ul>
          </div>

          <StatefulButton variant="success" className="w-full justify-between font-black uppercase tracking-wider">
            <span>Start Mixed</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </StatefulButton>
        </TiltCard>
      </div>
    </div>
  );
}

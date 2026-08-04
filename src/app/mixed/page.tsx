"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VocabularyPracticeView } from "@/components/views/vocabulary-practice-view";
import { ResultView } from "@/components/views/result-view";
import vocabularyData from "@/data/vocabulary.json";
import sentenceData from "@/data/sentences.json";
import { NAV_ROUTES } from "@/components/layout/app-shell";
import { type NavItem } from "@/components/beui/bounce-sidebar";

export default function MixedPage() {
  const router = useRouter();
  const [step, setStep] = useState<"practice" | "result">("practice");
  const [questions, setQuestions] = useState<any[]>([]);
  const [resultSummary, setResultSummary] = useState({
    score: 0,
    accuracy: 100,
    xp: 0,
    mistakes: [] as any[],
  });

  const startNewSession = () => {
    const vocabItems = [...vocabularyData].map((v) => ({ ...v, type: "vocabulary" }));
    const sentenceItems = Object.values(sentenceData)
      .flat()
      .map((s: any) => ({ ...s, type: "sentence" }));
    const combined = [...vocabItems, ...sentenceItems].sort(() => 0.5 - Math.random());
    setQuestions(combined);
    setStep("practice");
  };

  useEffect(() => {
    startNewSession();
  }, []);

  const handlePracticeComplete = (score: number, accuracy: number, xp: number, mistakes: any[]) => {
    setResultSummary({ score, accuracy, xp, mistakes });
    setStep("result");
  };

  const handleNavigate = (nav: NavItem) => {
    router.push(NAV_ROUTES[nav] || "/");
  };

  if (step === "result") {
    return (
      <ResultView
        score={resultSummary.score}
        accuracy={resultSummary.accuracy}
        xp={resultSummary.xp}
        mistakes={resultSummary.mistakes}
        onNavigate={handleNavigate}
        onRestartPractice={startNewSession}
      />
    );
  }

  return (
    <VocabularyPracticeView
      questions={questions}
      onComplete={handlePracticeComplete}
    />
  );
}

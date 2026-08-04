"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VocabularySubNav } from "@/components/layout/vocabulary-sub-nav";
import { VocabularyPracticeView } from "@/components/views/vocabulary-practice-view";
import vocabularyData from "@/data/vocabulary.json";

export default function VocabularyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    setQuestions(vocabularyData);
  }, []);

  const handlePracticeComplete = (score: number, accuracy: number, xp: number, mistakes: any[]) => {
    const params = new URLSearchParams({
      score: String(score),
      accuracy: String(accuracy),
      xp: String(xp),
    });
    router.push(`/vocabulary/result?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <VocabularySubNav />
      {questions.length > 0 ? (
        <VocabularyPracticeView
          questions={questions}
          initialPageMode="selection"
          onComplete={handlePracticeComplete}
        />
      ) : (
        <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
          Loading Vocabulary Mode Selection...
        </div>
      )}
    </div>
  );
}

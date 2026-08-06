"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VocabularySubNav } from "@/components/layout/vocabulary-sub-nav";
import { VocabularyPracticeView } from "@/components/views/vocabulary-practice-view";
import {
  getVocabularyQuestions,
  getStoredVocabSectionId,
  setStoredVocabSectionId,
  VocabQuestion,
} from "@/lib/vocabulary-data";

export default function VocabularyStudyPage() {
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string>("section1");
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);

  useEffect(() => {
    const savedSection = getStoredVocabSectionId();
    setActiveSectionId(savedSection);
    setQuestions(getVocabularyQuestions(savedSection));
  }, []);

  const handleSectionChange = (newSectionId: string) => {
    setActiveSectionId(newSectionId);
    setStoredVocabSectionId(newSectionId);
    setQuestions(getVocabularyQuestions(newSectionId));
  };

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
          initialPageMode="study"
          activeSectionId={activeSectionId}
          onSectionChange={handleSectionChange}
          onComplete={handlePracticeComplete}
        />
      ) : (
        <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
          Loading Vocabulary Study List...
        </div>
      )}
    </div>
  );
}

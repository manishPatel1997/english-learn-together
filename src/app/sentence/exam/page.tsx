"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SentenceSubNav } from "@/components/layout/sentence-sub-nav";
import { SentencePracticeView } from "@/components/views/sentence-practice-view";
import sentenceData from "@/data/sentences.json";

function SentenceExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicsParam = searchParams.get("topics") || "";

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const topicKeys = topicsParam
      ? topicsParam.split(",")
      : ["who_section", "what_section", "whose_section", "where_section", "which_section"];

    let list: any[] = [];
    topicKeys.forEach((key) => {
      const items = (sentenceData as any)[key] || [];
      list = [...list, ...items];
    });

    const shuffled = list.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.length > 0 ? shuffled : ((sentenceData as any)["who_section"] || []));
  }, [topicsParam]);

  const handlePracticeComplete = (score: number, accuracy: number, xp: number, mistakes: any[]) => {
    const params = new URLSearchParams({
      score: String(score),
      accuracy: String(accuracy),
      xp: String(xp),
      topics: topicsParam,
    });
    router.push(`/sentence/result?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <SentenceSubNav />
      {questions.length > 0 ? (
        <SentencePracticeView
          questions={questions}
          initialPageMode="exam"
          onComplete={handlePracticeComplete}
        />
      ) : (
        <div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Exam Questions...</div>
      )}
    </div>
  );
}

export default function SentenceExamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Exam Mode...</div>}>
      <SentenceExamContent />
    </Suspense>
  );
}

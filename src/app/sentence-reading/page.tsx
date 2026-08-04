"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SentenceReadingAIView } from "@/components/views/sentence-reading-ai-view";

function SentenceReadingContent() {
  const searchParams = useSearchParams();
  const sentenceParam = searchParams.get("sentence") || searchParams.get("text") || undefined;

  return <SentenceReadingAIView initialSentence={sentenceParam} />;
}

export default function SentenceReadingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Sentence Reader...</div>}>
      <SentenceReadingContent />
    </Suspense>
  );
}

"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SentenceSubNav } from "@/components/layout/sentence-sub-nav";
import { ResultView } from "@/components/views/result-view";
import { NAV_ROUTES } from "@/components/layout/app-shell";
import { type NavItem } from "@/components/beui/bounce-sidebar";

function SentenceResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const score = Number(searchParams.get("score") || 0);
  const accuracy = Number(searchParams.get("accuracy") || 100);
  const xp = Number(searchParams.get("xp") || 0);

  const handleNavigate = (nav: NavItem) => {
    router.push(NAV_ROUTES[nav] || "/");
  };

  const handleRestart = () => {
    router.push("/sentence");
  };

  return (
    <div className="space-y-4">
      <SentenceSubNav />
      <ResultView
        score={score}
        accuracy={accuracy}
        xp={xp}
        mistakes={[]}
        onNavigate={handleNavigate}
        onRestartPractice={handleRestart}
      />
    </div>
  );
}

export default function SentenceResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-muted-foreground">Loading Results...</div>}>
      <SentenceResultContent />
    </Suspense>
  );
}

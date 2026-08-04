"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SentenceSubNav } from "@/components/layout/sentence-sub-nav";
import { TopicSelectView } from "@/components/views/topic-select-view";

export default function SentenceTopicPage() {
  const router = useRouter();

  const handleStartSelectedTopics = (selectedKeys: string[]) => {
    const topicsQuery = selectedKeys.join(",");
    router.push(`/sentence/mode?topics=${encodeURIComponent(topicsQuery)}`);
  };

  return (
    <div className="space-y-4">
      <SentenceSubNav />
      <TopicSelectView onStartSelectedTopics={handleStartSelectedTopics} />
    </div>
  );
}

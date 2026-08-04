"use client";

import React, { useState, useEffect } from "react";
import { ProgressView } from "@/components/views/progress-view";
import { storage, type UserStats } from "@/lib/storage";

export default function ProgressPage() {
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  useEffect(() => {
    setStats(storage.getStats());
  }, []);

  return <ProgressView stats={stats} />;
}

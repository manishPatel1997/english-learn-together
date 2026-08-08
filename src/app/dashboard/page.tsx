"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "@/components/views/dashboard-view";
import { storage, type UserStats } from "@/lib/storage";
import { NAV_ROUTES } from "@/components/layout/app-shell";
import { type NavItem } from "@/components/beui/bounce-sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  useEffect(() => {
    setStats(storage.getStats());
  }, []);

  const handleNavigate = (nav: NavItem) => {
    router.push(NAV_ROUTES[nav] || "/");
  };

  const handleStartPractice = (mode: "vocabulary" | "sentence" | "mixed") => {
    router.push(`/${mode}`);
  };

  return (
    <DashboardView
      stats={stats}
      onNavigate={handleNavigate}
      onStartPractice={handleStartPractice}
    />
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { SettingsView } from "@/components/views/settings-view";
import { storage, type UserStats } from "@/lib/storage";

export default function SettingsPage() {
  const [stats, setStats] = useState<UserStats>(storage.getStats());

  useEffect(() => {
    setStats(storage.getStats());
  }, []);

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
  };

  return <SettingsView stats={stats} onUpdateStats={handleUpdateStats} />;
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ExpandableTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function ExpandableTabs({ tabs, activeId, onChange, className }: ExpandableTabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full bg-muted/60 p-1.5 border border-border/80 backdrop-blur-sm", className)}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex h-9 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors outline-none select-none z-10",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="expandable-tab-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-primary -z-10 shadow-md shadow-indigo-500/20"
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <motion.span layout="position">{tab.label}</motion.span>
          </button>
        );
      })}
    </div>
  );
}

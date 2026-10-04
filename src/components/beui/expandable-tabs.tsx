"use client";

import React from "react";
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
    <div className={cn("inline-flex items-center gap-1.5 rounded-[4px] bg-[#EFE8DD] dark:bg-zinc-800 p-1 border-2 border-black dark:border-white shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff]", className)}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex h-8 items-center gap-1.5 rounded-[2px] px-3 text-xs font-black uppercase transition-all outline-none select-none cursor-pointer",
              isActive
                ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]"
                : "border-2 border-transparent text-foreground hover:bg-black/5 hover:border-black/30"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  badge?: string;
  count?: number;
  description?: string;
  index?: number;
  stepLabel?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  labelPrefix?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select section",
  className,
  labelPrefix,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block w-full min-w-[240px]", className)}>
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.99 }}
        className="flex h-13 w-full items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-card px-4 py-2.5 text-left text-sm font-bold text-foreground shadow-sm hover:border-indigo-500/70 focus:outline-none transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 font-extrabold text-sm">
            {selectedOption?.icon || <Layers className="h-4 w-4" />}
          </div>
          <div className="flex flex-col min-w-0">
            {labelPrefix && (
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                {labelPrefix}
              </span>
            )}
            <span className="truncate text-xs font-black text-foreground">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedOption?.count !== undefined && (
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
              {selectedOption.count} words
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-2xl border border-indigo-500/20 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="max-h-72 overflow-y-auto space-y-1 select-none">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all text-left group",
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "text-foreground hover:bg-indigo-500/10"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step / Index Badge */}
                      {opt.stepLabel ? (
                        <span
                          className={cn(
                            "flex h-6 px-2 items-center justify-center rounded-lg text-[10px] font-black shrink-0 tracking-tight",
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                          )}
                        >
                          {opt.stepLabel}
                        </span>
                      ) : (
                        <span className="text-base shrink-0">{opt.icon || "📚"}</span>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-black text-xs leading-tight">{opt.label}</span>
                        {opt.description && (
                          <span
                            className={cn(
                              "truncate text-[10px] font-medium leading-tight mt-0.5",
                              isSelected ? "text-white/80" : "text-muted-foreground"
                            )}
                          >
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {opt.count !== undefined && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                            isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {opt.count} words
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 text-white shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


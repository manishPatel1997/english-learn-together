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
    <div ref={containerRef} className={cn("relative inline-block w-full min-w-[200px] select-none", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 px-3.5 py-2 text-left text-xs font-black text-foreground shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all cursor-pointer outline-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-black bg-[#FFE600] text-black shrink-0 font-black text-xs shadow-[1px_1px_0px_#121212]">
            {selectedOption?.icon || <Layers className="h-3.5 w-3.5 stroke-[2.5]" />}
          </div>
          <div className="flex flex-col min-w-0">
            {labelPrefix && (
              <span className="text-[9px] font-black uppercase text-[#FF6B00]">
                {labelPrefix}
              </span>
            )}
            <span className="truncate text-xs font-black text-foreground uppercase">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedOption?.count !== undefined && (
            <span className="rounded-[2px] border border-black bg-[#FFE600] text-black px-1.5 py-0.2 text-[9px] font-black">
              {selectedOption.count}w
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 stroke-[3] transition-transform duration-150", open && "rotate-180")}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] p-1.5 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff]"
          >
            <div className="max-h-72 overflow-y-auto space-y-1">
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
                      "flex w-full items-center justify-between gap-3 rounded-[3px] p-2 text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#FFE600] text-black border-2 border-black font-black shadow-[2px_2px_0px_#121212]"
                        : "border-2 border-transparent text-foreground hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{opt.icon || "📚"}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black truncate uppercase">{opt.label}</span>
                        {opt.description && (
                          <span className="text-[10px] text-muted-foreground truncate font-bold">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {opt.badge && (
                        <span className="rounded-[2px] border border-black bg-white px-1.5 py-0.2 text-[8px] font-black uppercase text-black">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 stroke-[3] text-black" />}
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

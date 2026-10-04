"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MorphingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layoutId?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function MorphingModal({
  open,
  onOpenChange,
  layoutId,
  title,
  children,
  className,
}: MorphingModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Stark dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/75 z-40"
          />

          {/* Modal Container */}
          <motion.div
            {...(layoutId ? { layoutId } : {})}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-[6px] border-[3px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] p-6 sm:p-7 shadow-[8px_8px_0px_#121212] dark:shadow-[8px_8px_0px_#ffffff] z-50 text-foreground",
              className
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-white mb-4">
              {title && (
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{title}</h3>
              )}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[3px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer ml-auto"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

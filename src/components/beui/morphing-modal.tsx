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
          {/* High contrast dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
          />

          {/* Modal Container */}
          <motion.div
            {...(layoutId ? { layoutId } : {})}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl z-50 text-slate-900 dark:text-slate-100",
              className
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              {title && <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors ml-auto"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

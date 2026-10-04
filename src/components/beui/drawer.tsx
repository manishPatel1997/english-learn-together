"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  side = "right",
  children,
  className,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sideVariants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  const containerClasses = {
    left: "top-0 left-0 h-screen w-full max-w-xl sm:max-w-2xl border-r-[3px] border-black dark:border-white shadow-[6px_0px_0px_#121212]",
    right: "top-0 right-0 h-screen w-full max-w-xl sm:max-w-2xl border-l-[3px] border-black dark:border-white shadow-[-6px_0px_0px_#121212]",
    bottom: "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[4px] border-t-[3px] border-black dark:border-white mx-auto max-w-3xl shadow-[0px_-6px_0px_#121212]",
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/70 z-[9998]"
          />

          {/* Sheet/Drawer Panel */}
          <motion.div
            initial={sideVariants[side].initial}
            animate={sideVariants[side].animate}
            exit={sideVariants[side].exit}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className={cn(
              "fixed z-[9999] w-full h-screen bg-[#FAF7F2] dark:bg-[#161619] text-foreground p-6 overflow-y-auto flex flex-col justify-between",
              containerClasses[side],
              className
            )}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-black dark:border-white mb-5">
                {title ? (
                  <h3 className="text-base font-black uppercase tracking-tight text-foreground">{title}</h3>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[3px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

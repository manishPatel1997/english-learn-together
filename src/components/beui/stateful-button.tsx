"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionSpinner } from "@/components/beui/loader";

export type ButtonState = "idle" | "loading" | "success" | "error";

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: ButtonState;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "orange";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function StatefulButton({
  state = "idle",
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: StatefulButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-extrabold uppercase tracking-wide border-[2.5px] border-black dark:border-white shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] rounded-[4px] transition-all focus:outline-none focus:ring-0 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-[2px_2px_0px_#121212] select-none cursor-pointer";

  const variants = {
    primary: "bg-[#FFE600] text-black hover:bg-[#FACC15]",
    secondary: "bg-[#F2EBE1] text-black hover:bg-[#E8DEC8] dark:bg-zinc-800 dark:text-zinc-100",
    outline: "bg-white text-black hover:bg-neutral-100 dark:bg-zinc-900 dark:text-zinc-100",
    ghost: "bg-transparent text-foreground border-transparent shadow-none hover:border-black dark:hover:border-white hover:shadow-[3px_3px_0px_#121212] dark:hover:shadow-[3px_3px_0px_#ffffff] hover:bg-black/5 dark:hover:bg-white/10",
    destructive: "bg-[#FF4D4D] text-white hover:bg-[#EF4444]",
    success: "bg-[#22C55E] text-black hover:bg-[#16A34A]",
    orange: "bg-[#FF6B00] text-white hover:bg-[#EA580C]",
  };

  const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-7 text-sm sm:text-base font-black gap-2.5",
  };

  const isError = state === "error";
  const isSuccess = state === "success";

  return (
    <motion.button
      animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : isSuccess ? { scale: [1, 1.04, 1] } : {}}
      whileHover={
        disabled || state === "loading"
          ? undefined
          : { x: -1, y: -1 }
      }
      whileTap={
        disabled || state === "loading"
          ? undefined
          : { x: 3, y: 3 }
      }
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        isSuccess && "bg-[#22C55E] text-black",
        isError && "bg-[#FF4D4D] text-white",
        className
      )}
      disabled={disabled || state === "loading"}
      {...(props as any)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center gap-2"
          >
            <MotionSpinner size="sm" />
            <span>Processing...</span>
          </motion.span>
        )}

        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center gap-2 font-black"
          >
            <Check className="h-4 w-4 stroke-[3.5]" />
            <span>Correct!</span>
          </motion.span>
        )}

        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center gap-2 font-black"
          >
            <X className="h-4 w-4 stroke-[3.5]" />
            <span>Incorrect</span>
          </motion.span>
        )}

        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

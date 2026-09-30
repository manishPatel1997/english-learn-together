"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionSpinner } from "@/components/beui/loader";

export type ButtonState = "idle" | "loading" | "success" | "error";

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: ButtonState;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
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
    "relative inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-md";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-indigo-500/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-muted text-foreground",
    ghost: "hover:bg-muted text-foreground border-transparent shadow-none",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs gap-1.5",
    md: "h-11 px-6 text-sm gap-2",
    lg: "h-14 px-8 text-base font-semibold gap-3 rounded-[18px]",
  };

  const isError = state === "error";
  const isSuccess = state === "success";

  return (
    <motion.button
      animate={isError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : isSuccess ? { scale: [1, 1.05, 1] } : {}}
      whileHover={disabled || state === "loading" ? undefined : { scale: 1.025, y: -1.5 }}
      whileTap={disabled || state === "loading" ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        isSuccess && "ring-4 ring-emerald-500/30",
        className
      )}
      disabled={disabled || state === "loading"}
      {...(props as any)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.7, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="flex items-center gap-2"
          >
            <MotionSpinner size="sm" />
            <span>Processing...</span>
          </motion.span>
        )}

        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex items-center gap-2 text-white font-bold"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 15, delay: 0.05 }}
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </motion.div>
            <span>Correct!</span>
          </motion.span>
        )}

        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex items-center gap-2 text-white font-bold"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 15, delay: 0.05 }}
            >
              <X className="h-4 w-4 stroke-[3]" />
            </motion.div>
            <span>Incorrect</span>
          </motion.span>
        )}

        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

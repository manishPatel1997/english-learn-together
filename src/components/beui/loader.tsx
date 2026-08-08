"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "inline" | "card" | "fullscreen";
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MotionSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const centerIconSizeMap = {
    sm: "h-2.5 w-2.5",
    md: "h-4 w-4",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0 select-none", sizeMap[size], className)}>
      {/* Outer Glow Halo */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-50"
      />

      {/* Clockwise Outer Gradient Orbit */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500 dark:border-t-indigo-400 dark:border-r-purple-400"
      />

      {/* Counter-Clockwise Inner Orbit */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-1 rounded-full border-2 border-transparent border-b-pink-500 border-l-purple-500 dark:border-b-pink-400 dark:border-l-purple-400 opacity-80"
      />

      {/* Center Pulse Core */}
      <motion.div
        animate={{
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center text-indigo-600 dark:text-indigo-400"
      >
        <Sparkles className={centerIconSizeMap[size]} />
      </motion.div>
    </div>
  );
}

export function ThemeLoader({
  size = "md",
  variant = "card",
  title = "Loading...",
  subtitle,
  icon,
  className,
}: LoaderProps) {
  if (variant === "inline") {
    return (
      <div className={cn("inline-flex items-center gap-2.5 font-medium text-foreground", className)}>
        <MotionSpinner size={size} />
        {title && <span className="text-xs font-bold tracking-tight">{title}</span>}
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl p-6 select-none transition-colors duration-300", className)}>
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 dark:bg-indigo-500/25 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-purple-500/15 dark:bg-purple-500/25 blur-3xl pointer-events-none animate-pulse delay-700" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col items-center text-center space-y-6 max-w-sm w-full p-8 rounded-3xl border border-border bg-card/90 shadow-2xl backdrop-blur-md"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {icon || <Zap className="h-3.5 w-3.5 text-indigo-500" />}
            <span>English Learn Together</span>
          </div>

          {/* Center Motion Spinner */}
          <MotionSpinner size="xl" />

          {/* Text Information */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-black tracking-tight text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Multi-dot Pulsing Progress Indicator */}
          <div className="flex items-center gap-1.5 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Card Variant Default
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-border bg-card shadow-sm text-center space-y-3.5",
        className
      )}
    >
      <MotionSpinner size={size} />
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-foreground">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

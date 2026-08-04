"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface NumberAnimationProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberAnimation({ value, className = "", prefix = "", suffix = "" }: NumberAnimationProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const animatedValue = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = animatedValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [animatedValue]);

  return (
    <motion.span
      className={`inline-flex items-center tabular-nums font-bold ${className}`}
      suppressHydrationWarning
    >
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
}

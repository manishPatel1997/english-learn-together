"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glare?: boolean;
}

export function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY - height / 2) / (height / 2)) * -5;
    const rY = ((mouseX - width / 2) / (width / 2)) * 5;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ rotateX, rotateY }}
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ x: 2, y: 2 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 26,
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn(
        "relative overflow-hidden rounded-[6px] border-[2.5px] border-black dark:border-white bg-card p-6 shadow-[5px_5px_0px_#121212] dark:shadow-[5px_5px_0px_#ffffff] hover:shadow-[7px_7px_0px_#121212] dark:hover:shadow-[7px_7px_0px_#ffffff] transition-shadow duration-150 cursor-pointer select-none",
        className
      )}
    >
      <div style={{ transform: "translateZ(12px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

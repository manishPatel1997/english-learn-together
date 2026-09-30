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

export function TiltCard({ children, className = "", onClick, glare = true }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = ((mouseY - height / 2) / (height / 2)) * -8; // max -8deg to 8deg for smoother tilt
    const rY = ((mouseX - width / 2) / (width / 2)) * 8;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.22 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ rotateX, rotateY }}
      whileHover={{ y: -4, scale: 1.008 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 24,
        mass: 0.8,
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-border/80 bg-card p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer select-none",
        className
      )}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
      )}
      <div style={{ transform: "translateZ(24px)" }} className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
}

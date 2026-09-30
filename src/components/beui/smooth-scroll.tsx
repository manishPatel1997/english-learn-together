"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

interface SmoothScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SmoothScrollContainer({
  children,
  className = "",
}: SmoothScrollContainerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    // Initialize Lenis buttery smooth inertia momentum scroll
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: contentRef.current,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay curve for ultra-smooth luxury feel
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Resize observer to keep scroll bounds updated dynamically as dynamic questions/sections expand
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.6 });
    } else if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <main
      ref={containerRef}
      className={`flex-1 overflow-y-auto scrollbar-thin ${className}`}
    >
      <div ref={contentRef} className="min-h-full">
        {children}
      </div>
    </main>
  );
}

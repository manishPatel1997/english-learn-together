"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  toast: (msg: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = ({ title, description, type = "info" }: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Floating Toast Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full select-none">
        <AnimatePresence mode="sync">
          {toasts.map((t, index) => {
            const icons = {
              success: <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0 stroke-[3]" />,
              error: <XCircle className="h-5 w-5 text-[#FF4D4D] shrink-0 stroke-[3]" />,
              warning: <AlertTriangle className="h-5 w-5 text-[#FF6B00] shrink-0 stroke-[3]" />,
              info: <Info className="h-5 w-5 text-black dark:text-white shrink-0 stroke-[3]" />,
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 - index * 0.03 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className={cn(
                  "pointer-events-auto flex items-start justify-between gap-3 rounded-[4px] border-2 border-black dark:border-white p-3.5 shadow-[4px_4px_0px_#121212] dark:shadow-[4px_4px_0px_#ffffff] text-foreground bg-white dark:bg-zinc-900",
                  t.type === "success" && "border-2 border-black bg-[#E8F8EE] dark:bg-emerald-950/60",
                  t.type === "error" && "border-2 border-black bg-[#FFEAEA] dark:bg-rose-950/60",
                  t.type === "warning" && "border-2 border-black bg-[#FFF8E6] dark:bg-amber-950/60",
                  t.type === "info" && "border-2 border-black bg-[#FAF7F2] dark:bg-zinc-900"
                )}
              >
                <div className="flex items-start gap-3">
                  {icons[t.type || "info"]}
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight leading-tight">{t.title}</span>
                    {t.description && (
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mt-0.5 leading-normal">
                        {t.description}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-foreground hover:bg-black/10 rounded-[2px] transition-colors p-1 cursor-pointer"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

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
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence mode="sync">
          {toasts.map((t, index) => {
            const icons = {
              success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
              error: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
              info: <Info className="h-5 w-5 text-indigo-500 shrink-0" />,
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 - index * 0.04 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "pointer-events-auto flex items-start justify-between gap-3 rounded-[18px] border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md text-foreground",
                  t.type === "success" && "border-emerald-500/30 bg-emerald-500/5",
                  t.type === "error" && "border-rose-500/30 bg-rose-500/5"
                )}
              >
                <div className="flex items-start gap-3">
                  {icons[t.type || "info"]}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{t.title}</span>
                    {t.description && (
                      <span className="text-xs text-muted-foreground mt-0.5 leading-normal">
                        {t.description}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-4 w-4" />
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

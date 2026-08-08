"use client";

import React, { useState } from "react";
import { MorphingModal } from "@/components/beui/morphing-modal";
import { useAuth } from "@/context/auth-context";
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { MotionSpinner } from "@/components/beui/loader";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Inline Validation Helpers
  const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  const isPasswordValid = (str: string) => str.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register" && name.trim().length < 2) {
      setErrorMsg("Name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    let success = false;
    if (mode === "login") {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }
    setIsSubmitting(false);

    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setErrorMsg("");
    }
  };

  return (
    <MorphingModal
      open={isAuthModalOpen}
      onOpenChange={(open) => {
        if (!open) closeAuthModal();
      }}
      title={mode === "login" ? "Account Sign In" : "Create New Account"}
    >
      <div className="space-y-6 pt-1 select-none">
        {/* Toggle Login / Register */}
        <div className="grid grid-cols-2 rounded-2xl bg-muted/60 p-1 border border-border">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === "register"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" /> Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manish Patel"
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Email Address</span>
              {email && isValidEmail(email) && (
                <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Valid format
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Password</span>
              {password && (
                <span
                  className={`text-[10px] font-extrabold ${
                    isPasswordValid(password) ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {isPasswordValid(password) ? "✓ Strong (6+ chars)" : "Min 6 chars"}
                </span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <MotionSpinner size="sm" />
            ) : mode === "login" ? (
              <>
                <LogIn className="h-4 w-4" /> Sign In to Account
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div className="rounded-xl bg-indigo-500/5 p-3 text-[11px] text-muted-foreground flex items-start gap-2 border border-indigo-500/10">
          <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            {mode === "login"
              ? "Logging in unlocks performance tracking, custom section permissions, and cloud settings sync."
              : "Registration grants access to Section 1. Achieve 80%+ exam scores to unlock subsequent sections!"}
          </span>
        </div>
      </div>
    </MorphingModal>
  );
}

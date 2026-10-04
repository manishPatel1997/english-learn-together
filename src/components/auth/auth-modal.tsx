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
      <div className="space-y-5 pt-1 select-none">
        {/* Toggle Login / Register */}
        <div className="grid grid-cols-2 rounded-[4px] bg-[#EFE8DD] dark:bg-zinc-800 p-1 border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_#121212] dark:shadow-[2.5px_2.5px_0px_#ffffff]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-black uppercase rounded-[2px] transition-all cursor-pointer ${
              mode === "login"
                ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]"
                : "border-2 border-transparent text-foreground hover:bg-black/5"
            }`}
          >
            <LogIn className="h-3.5 w-3.5 stroke-[2.5]" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-black uppercase rounded-[2px] transition-all cursor-pointer ${
              mode === "register"
                ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]"
                : "border-2 border-transparent text-foreground hover:bg-black/5"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5 stroke-[2.5]" /> Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-[4px] border-2 border-black bg-[#FFEBEB] dark:bg-rose-950 p-3 text-xs font-black text-black dark:text-rose-200 shadow-[3px_3px_0px_#121212]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#FF4D4D] stroke-[3]" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-foreground">
                <span>Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manish Patel"
                  className="w-full rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold outline-none shadow-[2.5px_2.5px_0px_#121212]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-foreground flex items-center justify-between">
              <span>Email Address</span>
              {email && isValidEmail(email) && (
                <span className="text-[10px] text-[#22C55E] font-black flex items-center gap-1 uppercase">
                  <CheckCircle2 className="h-3 w-3 stroke-[3]" /> Valid format
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold outline-none shadow-[2.5px_2.5px_0px_#121212]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-foreground flex items-center justify-between">
              <span>Password</span>
              {password && (
                <span
                  className={`text-[10px] font-black uppercase ${
                    isPasswordValid(password) ? "text-[#22C55E]" : "text-[#FF6B00]"
                  }`}
                >
                  {isPasswordValid(password) ? "✓ Strong (6+ chars)" : "Min 6 chars"}
                </span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold outline-none shadow-[2.5px_2.5px_0px_#121212]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-[4px] border-[2.5px] border-black bg-[#FFE600] text-black font-black uppercase text-xs shadow-[4px_4px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#121212] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <MotionSpinner size="sm" />
            ) : mode === "login" ? (
              <>
                <LogIn className="h-4 w-4 stroke-[3]" /> Sign In to Account
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 stroke-[3]" /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div className="rounded-[4px] bg-white dark:bg-zinc-800 p-3 text-[11px] font-bold text-foreground flex items-start gap-2 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212]">
          <ShieldCheck className="h-4 w-4 text-[#FF6B00] shrink-0 mt-0.5 stroke-[2.5]" />
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

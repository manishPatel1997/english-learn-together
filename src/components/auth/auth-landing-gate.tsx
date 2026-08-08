"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import {
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Trophy,
  Zap,
} from "lucide-react";
import { MotionSpinner } from "@/components/beui/loader";

export function AuthLandingGate() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      setErrorMsg("Full name must be at least 2 characters.");
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

    if (!success && !errorMsg) {
      setErrorMsg("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden z-10"
      >
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-b from-indigo-900/40 to-purple-900/40 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1.5 text-xs font-extrabold text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>Login Required</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                English Learn <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Together
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                Sign in to unlock interactive Gujarati-English vocabulary, performance-based section progression, and AI tutor features.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">780+ Words & Sentences</span>
                  <span className="text-[11px] text-slate-400">5 structured textbook sections</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Performance Unlocking</span>
                  <span className="text-[11px] text-slate-400">Score 80%+ to unlock next section</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Cloud Settings & Sync</span>
                  <span className="text-[11px] text-slate-400">Saved streaks & preferences</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[11px] font-medium text-slate-400">
            © 2026 English Learn Together • Secure Authentication API
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 rounded-2xl bg-slate-800/80 p-1.5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-black rounded-xl transition-all ${
                mode === "login"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-black rounded-xl transition-all ${
                mode === "register"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserPlus className="h-4 w-4" /> Register Account
            </button>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {mode === "login" ? "Welcome Back!" : "Create your Free Account"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === "login"
                ? "Enter your email and password to access your dashboard."
                : "Register now to start Section 1 and unlock your Gujarati learning journey."}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-200">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manish Patel"
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/80 pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-200">Email Address</label>
                {email && isValidEmail(email) && (
                  <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Valid email
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-200">Password</label>
                {password && (
                  <span
                    className={`text-[10px] font-extrabold ${
                      isPasswordValid(password) ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {isPasswordValid(password) ? "✓ Min 6 characters" : "Must be ≥ 6 chars"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <MotionSpinner size="sm" />
              ) : mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4" /> Sign In to Access Application
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Create Account & Start Learning
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

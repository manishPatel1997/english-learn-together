"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF7F2] dark:bg-[#121214] py-10 px-4 sm:px-6 select-none relative" aria-label="English Learn Together — Sign in or Register">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[10px_10px_0px_#121212] dark:shadow-[10px_10px_0px_#ffffff] overflow-hidden z-10"
      >
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 bg-[#FFE600] text-black p-8 flex flex-col justify-between border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-[2px] border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
              <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              <span>Authentication Gate</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight leading-tight">
                English Learn <br />
                <span className="bg-white px-2 py-0.5 inline-block border-2 border-black shadow-[3px_3px_0px_#000000] mt-1">
                  Together
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-900 font-bold mt-3 leading-relaxed">
                Sign in to unlock interactive Gujarati-English vocabulary, performance-based section progression, and AI tutor features.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 rounded-[4px] bg-white p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-black bg-[#FF6B00] text-white shadow-[1px_1px_0px_#000]">
                  <BookOpen className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-black block">780+ Words & Sentences</span>
                  <span className="text-[11px] font-bold text-neutral-600">5 structured textbook sections</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[4px] bg-white p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-black bg-[#22C55E] text-black shadow-[1px_1px_0px_#000]">
                  <Trophy className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-black block">Section Unlocking</span>
                  <span className="text-[11px] font-bold text-neutral-600">Score 80%+ to unlock next section</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[4px] bg-white p-3 border-2 border-black shadow-[2.5px_2.5px_0px_#000000]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-black bg-[#FFE600] text-black shadow-[1px_1px_0px_#000]">
                  <Sparkles className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-black block">Gemini AI Assistant</span>
                  <span className="text-[11px] font-bold text-neutral-600">Instant explanations & phonetic help</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] font-black uppercase text-neutral-800 tracking-wider">
            © 2026 English Learn Together • Neo-Brutalist SaaS
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6 bg-white dark:bg-zinc-900">
          {/* Mode Switcher */}
          <div role="tablist" aria-label="Authentication mode" className="grid grid-cols-2 rounded-[4px] bg-[#EFE8DD] dark:bg-zinc-800 p-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#ffffff]">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase rounded-[2px] transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]"
                  : "border-2 border-transparent text-foreground hover:bg-black/5"
              }`}
            >
              <LogIn className="h-4 w-4 stroke-[2.5]" /> Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => {
                setMode("register");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase rounded-[2px] transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]"
                  : "border-2 border-transparent text-foreground hover:bg-black/5"
              }`}
            >
              <UserPlus className="h-4 w-4 stroke-[2.5]" /> Register
            </button>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
              {mode === "login" ? "Welcome Back!" : "Create your Free Account"}
            </h2>
            <p className="text-xs font-bold text-muted-foreground mt-1">
              {mode === "login"
                ? "Enter your credentials to access your live dashboard and stats."
                : "Register now to start Section 1 and unlock your Gujarati learning journey."}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-[4px] border-2 border-black bg-[#FFEAEA] dark:bg-rose-950 p-3 text-xs font-black text-black dark:text-rose-200 shadow-[3px_3px_0px_#121212]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#FF4D4D] stroke-[3]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label={mode === "login" ? "Sign in form" : "Registration form"}>
            {mode === "register" && (
              <div className="space-y-1">
                <label htmlFor="auth-name" className="text-xs font-black uppercase text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" aria-hidden="true" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manish Patel"
                    className="w-full rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-foreground outline-none shadow-[2.5px_2.5px_0px_#121212]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-email" className="text-xs font-black uppercase text-foreground">Email Address</label>
                {email && isValidEmail(email) && (
                  <span className="text-[10px] text-[#22C55E] font-black uppercase flex items-center gap-1" aria-live="polite">
                    <CheckCircle2 className="h-3 w-3 stroke-[3]" aria-hidden="true" /> Valid email
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-foreground outline-none shadow-[2.5px_2.5px_0px_#121212]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-xs font-black uppercase text-foreground">Password</label>
                {password && (
                  <span
                    aria-live="polite"
                    className={`text-[10px] font-black uppercase ${
                      isPasswordValid(password) ? "text-[#22C55E]" : "text-[#FF6B00]"
                    }`}
                  >
                    {isPasswordValid(password) ? "✓ Min 6 characters" : "Must be ≥ 6 chars"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-black dark:text-white stroke-[2.5]" aria-hidden="true" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 pl-10 pr-4 py-2.5 text-xs font-bold text-foreground outline-none shadow-[2.5px_2.5px_0px_#121212]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-[4px] border-[2.5px] border-black bg-[#FFE600] text-black font-black uppercase text-xs shadow-[4px_4px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#121212] transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <MotionSpinner size="sm" />
              ) : mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4 stroke-[3]" /> Sign In to Access Application
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 stroke-[3]" /> Create Account & Start Learning
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Crawlable Public Navigation & Learning Resources */}
      <nav
        aria-label="Public learning modules and study guides"
        className="w-full max-w-4xl mt-6 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] p-4 sm:p-5 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#ffffff] z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#00F0FF] border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
              Free Public Resources
            </span>
            <h2 className="text-xs sm:text-sm font-black uppercase text-foreground">
              Explore Practice Modules &amp; Study Guides
            </h2>
          </div>
          <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
            Open to all learners • No account required
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3">
          <Link
            href="/learn-english"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#FFE600] hover:text-black transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-black">Learn English</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black">Methodology Hub</span>
          </Link>
          <Link
            href="/gujarati-to-english"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#00F0FF] hover:text-black transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-black">Gujarati to English</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black">Translation Guide</span>
          </Link>
          <Link
            href="/english-vocabulary-practice"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#FF6B00] hover:text-white transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-white">Vocabulary</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-white">Spaced Recall</span>
          </Link>
          <Link
            href="/english-sentence-practice"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#FFE600] hover:text-black transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-black">Sentence Practice</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black">Syntax Builder</span>
          </Link>
          <Link
            href="/english-reading-practice"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#00F0FF] hover:text-black transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-black">Reading Practice</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black">Comprehension</span>
          </Link>
          <Link
            href="/faq"
            className="p-2.5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-center hover:bg-[#22C55E] hover:text-black transition-all shadow-[2px_2px_0px_#000000] group"
          >
            <span className="block text-[11px] font-black uppercase text-foreground group-hover:text-black">FAQ</span>
            <span className="block text-[9px] font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-black">Grammar &amp; Help</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}

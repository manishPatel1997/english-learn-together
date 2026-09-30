"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Key } from "lucide-react";
import { requestGeminiAI, getStoredGeminiKey, saveStoredGeminiKey } from "@/lib/gemini-client";
import { FormattedMarkdown } from "./formatted-markdown";
import { MotionSpinner } from "./loader";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export function AITutorModal({ isOpen, onClose, initialQuestion }: AITutorModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste! 🙏 I am your Gemini AI English Tutor. Ask me any questions about English grammar, sentences, vocabulary, or translations!",
    },
  ]);
  const [input, setInput] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);

  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg: Message = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    const res = await requestGeminiAI({
      action: "ask_tutor",
      userPrompt: prompt,
    });

    setLoading(false);

    if (res.error) {
      if (res.error === "API_KEY_MISSING") {
        setShowKeyInput(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "⚠️ Gemini API key is missing. Please enter your free Google Gemini API Key below or add `GEMINI_API_KEY` to your `.env.local` file.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `❌ Error: ${res.message || "Something went wrong."}`,
          },
        ]);
      }
    } else if (res.text) {
      setMessages((prev) => [...prev, { role: "ai", text: res.text! }]);
    }
  };

  const handleSaveKey = () => {
    saveStoredGeminiKey(apiKeyInput);
    setShowKeyInput(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "✅ API Key saved successfully! Ask your question again.",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl lg:max-w-5xl overflow-hidden rounded-[28px] border border-purple-500/40 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col h-[750px] max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-950 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Gemini AI Tutor
                  <span className="rounded-full bg-purple-500/30 border border-purple-400/40 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                    Free AI
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">Your 24/7 English Learning Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Configure Gemini API Key"
                className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Key className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Key Configuration Banner if toggled or needed */}
          {showKeyInput && (
            <div className="p-4 bg-purple-950/40 border-b border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span>Enter Free Gemini API Key:</span>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-purple-400"
                >
                  Get Key from Google AI Studio ↗
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500 font-semibold"
                />
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="rounded-xl bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages - Solid Opaque Background */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-100 dark:bg-slate-900 scrollbar-thin">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none shadow-md font-bold whitespace-pre-wrap"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 shadow-md rounded-bl-none font-medium"
                  }`}
                >
                  {m.role === "ai" ? <FormattedMarkdown content={m.text} /> : m.text}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-500/20 px-4 py-3 rounded-2xl border border-purple-500/30 max-w-fit shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {[0.1, 0.3, 0.2, 0.4].map((delay, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ height: ["8px", "18px", "8px"] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay }}
                      className="w-1 bg-purple-600 rounded-full inline-block"
                    />
                  ))}
                </div>
                <span>Gemini AI is analyzing & generating answer...</span>
              </motion.div>
            )}
          </div>

          {/* Quick Prompts - Solid Border & High Contrast Pills */}
          <div className="px-6 py-3 border-t border-slate-300 dark:border-slate-800 bg-slate-200 dark:bg-slate-950 flex flex-wrap gap-2">
            {[
              "Explain 'Whose' vs 'Which'",
              "Difference between 'Has' & 'Have'",
              "How to use past tense correctly?",
            ].map((qp, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSend(qp)}
                className="text-[11px] font-black text-purple-800 dark:text-purple-200 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
              >
                {qp}
              </motion.button>
            ))}
          </div>

          {/* Input Box - Solid Opaque Background */}
          <div className="p-4 border-t border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemini AI any English question... (e.g. explain tenses)"
                className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-md shadow-purple-600/30"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

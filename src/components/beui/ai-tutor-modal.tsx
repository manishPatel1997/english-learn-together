"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Key } from "lucide-react";
import { requestGeminiAI, getStoredGeminiKey, saveStoredGeminiKey } from "@/lib/gemini-client";
import { FormattedMarkdown } from "./formatted-markdown";

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl lg:max-w-5xl overflow-hidden rounded-[6px] border-[3px] border-black dark:border-white bg-[#FAF7F2] dark:bg-[#161619] text-foreground shadow-[3px_3px_0px_#121212] sm:shadow-[6px_6px_0px_#121212] md:shadow-[8px_8px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[6px_6px_0px_#ffffff] flex flex-col h-[82vh] max-h-[700px] min-h-[420px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-black dark:border-white bg-[#FFE600] text-black">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[3px] border-2 border-black bg-black text-white shadow-[2px_2px_0px_#000000] shrink-0">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-black uppercase flex items-center gap-1.5 sm:gap-2">
                  Gemini AI Tutor
                  <span className="rounded-[2px] bg-black text-white px-1.5 sm:px-2 py-0.2 text-[9px] sm:text-[10px] font-black uppercase">
                    Free AI
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-800 font-bold truncate">24/7 English Learning Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Configure Gemini API Key"
                className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-[3px] border-2 border-black bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <Key className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-[3px] border-2 border-black bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Key Configuration Banner */}
          {showKeyInput && (
            <div className="p-4 bg-[#EFE8DD] dark:bg-zinc-800 border-b-2 border-black dark:border-white space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-foreground">
                <span>Enter Free Gemini API Key:</span>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-[#FF6B00]"
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
                  className="flex-1 rounded-[3px] border-2 border-black bg-white px-3 py-1.5 text-xs text-black outline-none font-bold shadow-[2px_2px_0px_#121212]"
                />
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="rounded-[3px] border-2 border-black bg-[#22C55E] px-4 py-1.5 text-xs font-black text-black uppercase shadow-[2px_2px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF7F2] dark:bg-[#121214] scrollbar-thin">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="h-8 w-8 rounded-[3px] border-2 border-black bg-[#FFE600] text-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#121212]">
                    <Bot className="h-4 w-4 stroke-[2.5]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-[4px] p-4 text-xs leading-relaxed border-2 border-black shadow-[3px_3px_0px_#121212] ${
                    m.role === "user"
                      ? "bg-[#22C55E] text-black font-black whitespace-pre-wrap"
                      : "bg-white dark:bg-zinc-800 text-foreground font-semibold"
                  }`}
                >
                  {m.role === "ai" ? <FormattedMarkdown content={m.text} /> : m.text}
                </div>
                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-[3px] border-2 border-black bg-black text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#121212]">
                    <User className="h-4 w-4 stroke-[2.5]" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-black uppercase text-foreground bg-[#FFE600] px-4 py-3 rounded-[3px] border-2 border-black shadow-[3px_3px_0px_#121212] max-w-fit">
                <span>Gemini AI is analyzing & generating answer...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-3 border-t-2 border-black dark:border-white bg-[#EFE8DD] dark:bg-zinc-900 flex flex-wrap gap-2">
            {[
              "Explain 'Whose' vs 'Which'",
              "Difference between 'Has' & 'Have'",
              "How to use past tense correctly?",
            ].map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp)}
                className="text-[10px] font-black uppercase text-black bg-white border-2 border-black hover:bg-[#FFE600] px-3 py-1 rounded-[2px] transition-all shadow-[2px_2px_0px_#121212] cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t-2 border-black dark:border-white bg-white dark:bg-zinc-900">
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
                className="flex-1 rounded-[3px] border-2 border-black bg-white dark:bg-zinc-800 p-3 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none shadow-[2px_2px_0px_#121212]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-black bg-[#FFE600] text-black hover:bg-[#FACC15] disabled:opacity-50 transition-all shadow-[3px_3px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] cursor-pointer"
              >
                <Send className="h-4 w-4 stroke-[3]" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

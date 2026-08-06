"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Sparkles,
  Mic,
  MicOff,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Star,
  Bot,
  Loader2,
  Sparkle,
  ArrowRight,
  Sliders,
  VolumeX,
} from "lucide-react";
import { SentenceSubNav } from "@/components/layout/sentence-sub-nav";
import { StatefulButton, type ButtonState } from "@/components/beui/stateful-button";
import { FormattedMarkdown } from "@/components/beui/formatted-markdown";
import { storage, type FavoriteItem } from "@/lib/storage";
import { requestGeminiAI, getStoredGeminiKey } from "@/lib/gemini-client";
import { useToast } from "@/components/beui/animated-toast-stack";
import sentenceData from "@/data/sentences.json";

// Preset sentence options grouped by category
const PRESET_SENTENCES = [
  {
    category: "Whose / Possession",
    gujarati: "આ કોનો મોબાઈલ છે?",
    english: "Whose mobile is this?",
  },
  {
    category: "Which / Selection",
    gujarati: "તમારો કયો રંગ પસંદ છે?",
    english: "Which color do you like?",
  },
  {
    category: "Ability / Can",
    gujarati: "હું કાર ચલાવી શકું છું.",
    english: "I can drive a car.",
  },
  {
    category: "Polite Request / Could",
    gujarati: "શું તમે મને મદદ કરી શકશો?",
    english: "Could you please help me?",
  },
  {
    category: "Daily Chat",
    gujarati: "તમે કેમ છો? હું મજામાં છું.",
    english: "How are you? I am doing well.",
  },
  {
    category: "Shopping & Travel",
    gujarati: "આ આઈટમની કિંમત કેટલી છે?",
    english: "How much does this item cost?",
  },
];

interface SentenceReadingAIViewProps {
  initialSentence?: string;
}

export function SentenceReadingAIView({ initialSentence }: SentenceReadingAIViewProps) {
  const { toast } = useToast();

  const [inputSentence, setInputSentence] = useState(
    initialSentence || "આ કોનો મોબાઈલ છે?"
  );
  const [selectedEnglish, setSelectedEnglish] = useState("Whose mobile is this?");

  // Speech options
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlayingGu, setIsPlayingGu] = useState(false);
  const [isPlayingEn, setIsPlayingEn] = useState(false);

  // Speech recognition / practice speaking
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Gemini AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [btnState, setBtnState] = useState<ButtonState>("idle");

  // Favorites tracking
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (initialSentence) {
      setInputSentence(initialSentence);
      const allLists = Object.values(sentenceData).filter(Array.isArray).flat();
      const match = allLists.find((q: any) => typeof q === "object" && q !== null && q.gujarati === initialSentence) as any;
      if (match && typeof match.english === "string") {
        setSelectedEnglish(match.english);
      }
    }
  }, [initialSentence]);

  useEffect(() => {
    // Check if initial sentence is in favorites
    const favs = storage.getFavorites();
    const exists = favs.some((f) => f.gujarati === inputSentence);
    setIsFav(exists);
  }, [inputSentence]);

  // Audio Playback using Web Speech API
  const handlePlayAudio = (text: string, lang: "gu-IN" | "en-US") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({ title: "Speech synthesis not supported on this browser", type: "warning" });
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.lang = lang;

    // Try finding exact matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    if (lang === "gu-IN") {
      setIsPlayingGu(true);
      utterance.onend = () => setIsPlayingGu(false);
      utterance.onerror = () => setIsPlayingGu(false);
    } else {
      setIsPlayingEn(true);
      utterance.onend = () => setIsPlayingEn(false);
      utterance.onerror = () => setIsPlayingEn(false);
    }

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition setup
  const handleStartListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({ title: "Speech recognition mic is not supported in this browser.", type: "warning" });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setSpokenTranscript("");
      setMatchScore(null);

      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenTranscript(transcript);
        setIsListening(false);

        // Simple similarity score comparison
        const target = (selectedEnglish || inputSentence).toLowerCase().trim();
        const spoken = transcript.toLowerCase().trim();

        if (target === spoken) {
          setMatchScore(100);
          toast({ title: "Perfect pronunciation! 🎯 100% Match", type: "success" });
        } else {
          // Words overlap score
          const targetWords = target.split(/\s+/);
          const spokenWords = spoken.split(/\s+/);
          let matchedCount = 0;
          spokenWords.forEach((w: string) => {
            if (targetWords.includes(w)) matchedCount++;
          });
          const score = Math.round((matchedCount / Math.max(targetWords.length, 1)) * 100);
          setMatchScore(score);
          if (score >= 70) {
            toast({ title: `Great job! Pronunciation score: ${score}%`, type: "success" });
          } else {
            toast({ title: `Pronunciation score: ${score}%. Try reading again aloud!`, type: "info" });
          }
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        toast({ title: "Microphone input error. Please check mic permissions.", type: "error" });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      toast({ title: "Failed to initialize microphone speech recognition.", type: "error" });
    }
  };

  // Run Gemini AI Sentence Reading Analysis
  const handleAnalyzeWithAI = async (textToAnalyze?: string) => {
    const targetText = textToAnalyze || inputSentence;
    if (!targetText.trim() || loadingAI) return;

    setLoadingAI(true);
    setBtnState("loading");

    const res = await requestGeminiAI({
      action: "read_sentence",
      gujarati: targetText,
      userPrompt: targetText,
    });

    setLoadingAI(false);

    if (res.error) {
      setBtnState("error");
      toast({ title: `AI Analysis error: ${res.message || "Failed to analyze sentence."}`, type: "error" });
      setTimeout(() => setBtnState("idle"), 2000);
    } else if (res.text) {
      setBtnState("success");
      setAiAnalysis(res.text);
      toast({ title: "Sentence breakdown loaded!", type: "success" });
      setTimeout(() => setBtnState("idle"), 2000);
    }
  };

  const handleSelectPreset = (preset: { gujarati: string; english: string }) => {
    setInputSentence(preset.gujarati);
    setSelectedEnglish(preset.english);
    setAiAnalysis("");
    setMatchScore(null);
    setSpokenTranscript("");
  };

  const handleToggleFavorite = () => {
    const item: FavoriteItem = {
      id: inputSentence,
      gujarati: inputSentence,
      english: selectedEnglish,
      categoryOrTopic: "AI Reading",
      type: "sentence",
    };
    storage.toggleFavorite(item);
    const updatedFavs = storage.getFavorites();
    const nowFav = updatedFavs.some((f) => f.gujarati === inputSentence);
    setIsFav(nowFav);
    toast({ title: nowFav ? "Saved to Favorites ⭐" : "Removed from Favorites", type: nowFav ? "success" : "info" });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 select-none">
      <SentenceSubNav />

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-[28px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 p-5 sm:p-8 text-white shadow-2xl shadow-purple-600/20"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse-glow" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
            <span>AI Voice & Sentence Reading Assistant</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Sentence Reading AI
          </h2>

          <p className="text-xs sm:text-sm text-purple-100/90 max-w-2xl leading-relaxed">
            Understand how to pronounce, read, and translate any Gujarati sentence into English. Hear native voice reading, get word-by-word phonetics, and practice speaking into your microphone!
          </p>
        </div>
      </motion.div>

      {/* Preset Sentence Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Quick Preset Sentence Examples
        </label>

        <div className="flex flex-wrap gap-2">
          {PRESET_SENTENCES.map((preset, idx) => {
            const isSelected = inputSentence === preset.gujarati;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25 scale-105"
                    : "bg-card text-foreground border-border hover:border-purple-500/50 hover:bg-purple-500/10"
                }`}
              >
                <span className="opacity-80 font-normal">{preset.category}:</span>
                <span>{preset.gujarati}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sentence Reading Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-card p-6 sm:p-8 space-y-6 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1 flex-1 w-full">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Active Sentence to Read & Learn
            </span>
            <input
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Type any Gujarati sentence here..."
              className="w-full text-2xl sm:text-3xl font-black text-foreground bg-transparent border-b border-border/60 focus:border-purple-500 outline-none pb-1 transition-colors"
            />
            {selectedEnglish && (
              <p className="text-sm font-semibold text-muted-foreground">
                English Translation: <span className="text-foreground">{selectedEnglish}</span>
              </p>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all ${
              isFav
                ? "border-amber-500/50 bg-amber-500/10 text-amber-500 shadow-sm"
                : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-amber-500"
            }`}
            title={isFav ? "Remove from Favorites" : "Save to Favorites"}
          >
            <Star className={`h-5 w-5 ${isFav ? "fill-amber-500" : ""}`} />
          </button>
        </div>

        {/* Audio Reading Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-muted/40 p-4 rounded-2xl border border-border">
          {/* Speed Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-bold text-muted-foreground shrink-0">Speech Speed:</span>
            <div className="flex items-center gap-1 rounded-xl bg-card border border-border p-1">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-colors ${
                    playbackSpeed === speed
                      ? "bg-purple-600 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Buttons */}
          <div className="md:col-span-8 flex flex-wrap items-center gap-3 justify-start md:justify-end">
            {/* Gujarati Voice */}
            <button
              type="button"
              onClick={() => handlePlayAudio(inputSentence, "gu-IN")}
              disabled={isPlayingGu}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-purple-600/20 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Volume2 className={`h-4 w-4 ${isPlayingGu ? "animate-bounce" : ""}`} />
              <span>{isPlayingGu ? "Reading Gujarati..." : "Read Gujarati AI"}</span>
            </button>

            {/* English Voice */}
            {selectedEnglish && (
              <button
                type="button"
                onClick={() => handlePlayAudio(selectedEnglish, "en-US")}
                disabled={isPlayingEn}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Volume2 className={`h-4 w-4 ${isPlayingEn ? "animate-bounce" : ""}`} />
                <span>{isPlayingEn ? "Reading English..." : "Read English Voice"}</span>
              </button>
            )}

            {/* Practice Speaking Microphone */}
            <button
              type="button"
              onClick={handleStartListening}
              disabled={isListening}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                isListening
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              <Mic className="h-4 w-4 text-rose-500" />
              <span>{isListening ? "Listening..." : "Practice Speaking Mic"}</span>
            </button>
          </div>
        </div>

        {/* Spoken Practice Results Feedback */}
        {spokenTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-2xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">Your Spoken Input:</span>
              {matchScore !== null && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                    matchScore >= 80
                      ? "bg-emerald-500/10 text-emerald-600"
                      : matchScore >= 50
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  Pronunciation Accuracy: {matchScore}%
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground italic">"{spokenTranscript}"</p>
          </motion.div>
        )}

        {/* AI Sentence Analysis Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Get word-by-word phonetics, grammar structure, and reading rules from Gemini AI.
          </p>

          <StatefulButton
            variant="primary"
            size="lg"
            state={btnState}
            onClick={() => handleAnalyzeWithAI()}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 font-extrabold shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Generate AI Reading Breakdown</span>
          </StatefulButton>
        </div>
      </motion.div>

      {/* Gemini AI Detailed Markdown Breakdown */}
      {loadingAI && (
        <div className="flex flex-col items-center justify-center p-12 rounded-[28px] border border-purple-500/20 bg-card space-y-4 text-center">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
          <div>
            <h4 className="text-base font-bold text-foreground">Analyzing Sentence Structure...</h4>
            <p className="text-xs text-muted-foreground">Preparing word-by-word phonetics & grammar tips</p>
          </div>
        </div>
      )}

      {aiAnalysis && !loadingAI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-purple-500/30 bg-card p-6 sm:p-8 space-y-6 shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">AI Sentence Reading Guide</h3>
              <p className="text-xs text-muted-foreground">Detailed breakdown and reading instructions</p>
            </div>
          </div>

          {/* Formatted Markdown Analysis */}
          <div className="prose prose-purple dark:prose-invert max-w-none text-sm leading-relaxed">
            <FormattedMarkdown content={aiAnalysis} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

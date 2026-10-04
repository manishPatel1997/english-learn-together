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
import { ThemeLoader } from "@/components/beui/loader";
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
    <div className="space-y-8 w-full pb-12 select-none">
      <SentenceSubNav />

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[6px] border-[2.5px] border-black dark:border-white bg-[#18181B] text-white p-6 sm:p-8 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000]"
      >
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-[3px] bg-[#FFE600] text-black px-3.5 py-1 text-xs font-black uppercase tracking-wider border-2 border-black">
            <Sparkles className="h-3.5 w-3.5 fill-black" />
            <span>AI Voice & Sentence Reading Assistant</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase">
            Sentence Reading AI
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed font-medium">
            Understand how to pronounce, read, and translate any Gujarati sentence into English. Hear native voice reading, get word-by-word phonetics, and practice speaking into your microphone!
          </p>
        </div>
      </motion.div>

      {/* Preset Sentence Selector */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-foreground block">
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
                className={`flex items-center gap-2 rounded-[4px] px-3.5 py-2 text-xs font-bold transition-transform active:translate-x-0.5 active:translate-y-0.5 border-2 border-black dark:border-white ${
                  isSelected
                    ? "bg-[#FFE600] text-black shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#fff]"
                    : "bg-card text-foreground hover:bg-[#EFE8DD] dark:hover:bg-zinc-800 shadow-[2px_2px_0px_#121212] dark:shadow-[2px_2px_0px_#000]"
                }`}
              >
                <span className="opacity-70 font-semibold">{preset.category}:</span>
                <span className="font-black">{preset.gujarati}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sentence Reading Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[6px] border-[2.5px] border-black dark:border-white bg-card p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000]"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black/10 dark:border-white/10 pb-6">
          <div className="space-y-2 flex-1 w-full">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6B00]">
              Active Sentence to Read & Learn
            </span>
            <input
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Type any Gujarati sentence here..."
              className="w-full text-2xl sm:text-3xl font-black text-foreground bg-transparent border-b-2 border-black dark:border-white focus:border-[#FF6B00] outline-none pb-2 transition-colors"
            />
            {selectedEnglish && (
              <p className="text-sm font-bold text-muted-foreground pt-1">
                English Translation: <span className="text-foreground font-black">{selectedEnglish}</span>
              </p>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] border-2 border-black dark:border-white transition-all shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 ${
              isFav
                ? "bg-[#FFE600] text-black"
                : "bg-card text-foreground hover:bg-[#EFE8DD] dark:hover:bg-zinc-800"
            }`}
            title={isFav ? "Remove from Favorites" : "Save to Favorites"}
          >
            <Star className={`h-5 w-5 ${isFav ? "fill-black" : ""}`} />
          </button>
        </div>

        {/* Audio Reading Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#EFE8DD] dark:bg-zinc-900 p-4 rounded-[4px] border-2 border-black dark:border-white shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#000]">
          {/* Speed Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-foreground shrink-0" />
            <span className="text-xs font-black uppercase text-foreground shrink-0">Speed:</span>
            <div className="flex items-center gap-1 rounded-[3px] bg-card border-2 border-black p-1 shadow-[2px_2px_0px_#121212]">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-3 py-2 sm:px-2.5 sm:py-1 text-xs sm:text-[11px] font-black rounded-[2px] min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 flex items-center justify-center transition-colors ${
                    playbackSpeed === speed
                      ? "bg-[#18181B] text-white"
                      : "text-foreground hover:bg-[#FFE600] hover:text-black"
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
              className="flex items-center gap-2 rounded-[4px] bg-[#FFE600] text-black border-2 border-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
            >
              <Volume2 className={`h-4 w-4 ${isPlayingGu ? "animate-bounce" : ""}`} />
              <span>{isPlayingGu ? "Reading..." : "Read Gujarati"}</span>
            </button>

            {/* English Voice */}
            {selectedEnglish && (
              <button
                type="button"
                onClick={() => handlePlayAudio(selectedEnglish, "en-US")}
                disabled={isPlayingEn}
                className="flex items-center gap-2 rounded-[4px] bg-[#22C55E] text-white border-2 border-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
              >
                <Volume2 className={`h-4 w-4 ${isPlayingEn ? "animate-bounce" : ""}`} />
                <span>{isPlayingEn ? "Reading..." : "Read English"}</span>
              </button>
            )}

            {/* Practice Speaking Microphone */}
            <button
              type="button"
              onClick={handleStartListening}
              disabled={isListening}
              className={`flex items-center gap-2 rounded-[4px] border-2 border-black px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#121212] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isListening
                  ? "bg-[#FF4D4D] text-white animate-pulse"
                  : "bg-card text-foreground hover:bg-[#FFE600] hover:text-black"
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>{isListening ? "Listening..." : "Practice Mic"}</span>
            </button>
          </div>
        </div>

        {/* Spoken Practice Results Feedback */}
        {spokenTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-900 p-4 space-y-2 shadow-[3px_3px_0px_#121212] dark:shadow-[3px_3px_0px_#000]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Your Spoken Input:</span>
              {matchScore !== null && (
                <span
                  className={`rounded-[3px] border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase ${
                    matchScore >= 80
                      ? "bg-[#22C55E] text-white"
                      : matchScore >= 50
                      ? "bg-[#FFE600] text-black"
                      : "bg-[#FF4D4D] text-white"
                  }`}
                >
                  Accuracy: {matchScore}%
                </span>
              )}
            </div>
            <p className="text-base font-black text-foreground italic">"{spokenTranscript}"</p>
          </motion.div>
        )}

        {/* AI Sentence Analysis Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-black/10 dark:border-white/10">
          <p className="text-xs text-muted-foreground font-semibold">
            Get word-by-word phonetics, grammar structure, and reading rules from Gemini AI.
          </p>

          <StatefulButton
            variant="primary"
            size="lg"
            state={btnState}
            onClick={() => handleAnalyzeWithAI()}
            className="w-full sm:w-auto font-black uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Generate AI Reading Breakdown</span>
          </StatefulButton>
        </div>
      </motion.div>

      {/* Gemini AI Detailed Markdown Breakdown */}
      {loadingAI && (
        <ThemeLoader
          variant="card"
          title="Analyzing Sentence Structure with AI..."
          subtitle="Preparing word-by-word phonetics & grammar tips..."
        />
      )}

      {aiAnalysis && !loadingAI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[6px] border-[2.5px] border-black dark:border-white bg-card p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#121212] dark:shadow-[6px_6px_0px_#000]"
        >
          <div className="flex items-center gap-3 border-b-2 border-black/10 dark:border-white/10 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#121212]">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">AI Sentence Reading Guide</h3>
              <p className="text-xs font-semibold text-muted-foreground">Detailed breakdown and reading instructions</p>
            </div>
          </div>

          {/* Formatted Markdown Analysis */}
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-medium">
            <FormattedMarkdown content={aiAnalysis} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  SkipForward,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Sparkles,
  BookOpen,
  Bot,
  Loader2,
  Volume2,
  RotateCcw,
} from "lucide-react";
import { FormattedMarkdown } from "@/components/beui/formatted-markdown";
import { StatefulButton, type ButtonState } from "@/components/beui/stateful-button";
import { DynamicIsland } from "@/components/beui/dynamic-island";
import { Drawer } from "@/components/beui/drawer";
import { storage, type FavoriteItem } from "@/lib/storage";
import { requestGeminiAI } from "@/lib/gemini-client";
import { MotionSpinner } from "@/components/beui/loader";
import { useToast } from "@/components/beui/animated-toast-stack";

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export interface SentenceQuestion {
  id: string | number;
  gujarati: string;
  english: string;
  answers?: string[];
  topic: string;
  difficulty?: string;
  hint?: string;
}

interface SentencePracticeViewProps {
  questions: SentenceQuestion[];
  onComplete: (score: number, accuracy: number, xp: number, mistakes: any[]) => void;
  initialPageMode?: "selection" | "study" | "exam";
}

export interface TopicFormula {
  topicKey: string;
  topicName: string;
  formula: string;
  breakdown: {
    part: string;
    label: string;
    examples: string[];
    color: string;
  }[];
  gujaratiPattern: string;
  exampleSentence: {
    gujarati: string;
    english: string;
    parts: { text: string; label: string }[];
  };
}

export const SENTENCE_FORMULAS: Record<string, TopicFormula> = {
  who_section: {
    topicKey: "who_section",
    topicName: "Who",
    formula: "Who + (is / are / was / were / will be) + (in / on / near / beside / behind / under / in front of) + [Location] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (કોણ)", examples: ["Who"], color: "purple" },
      { part: "2. Helping Verb", label: "State/Tense (હતું/છે/હશે)", examples: ["is", "are", "was", "were", "will be"], color: "blue" },
      { part: "3. Preposition", label: "Position (માં/પર/સામે...)", examples: ["in", "on", "near", "beside", "behind", "under", "in front of"], color: "amber" },
      { part: "4. Location / Object", label: "Place (સ્થળ/સ્થાન)", examples: ["the office", "the table", "London", "Paradise"], color: "emerald" },
    ],
    gujaratiPattern: "[સ્થળ/સ્થાન] + માં/પર/સામે/બાજુમાં + કોણ + [હતું/છે/હશે] + ?",
    exampleSentence: {
      gujarati: "ઓફિસમાં કોણ છે?",
      english: "Who is in the office?",
      parts: [
        { text: "Who", label: "Question Word" },
        { text: "is", label: "Verb (Present)" },
        { text: "in", label: "Preposition" },
        { text: "the office?", label: "Location" },
      ],
    },
  },
  what_section: {
    topicKey: "what_section",
    topicName: "What",
    formula: "What + (is / are / was / were / will be) + (on / in / near / behind / opposite) + [Location/Place] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (શું)", examples: ["What"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (છે/હતું/હશે)", examples: ["is", "are", "was", "were", "will be"], color: "blue" },
      { part: "3. Preposition", label: "Position (પર/માં/સામે...)", examples: ["on", "in", "near", "behind", "opposite"], color: "amber" },
      { part: "4. Location / Container", label: "Place (સ્થાન)", examples: ["the table", "the chair", "the jug", "the wall"], color: "emerald" },
    ],
    gujaratiPattern: "[સ્થળ/વસ્તુ] + પર/માં/સામે + શું + [છે/હતું/હશે] + ?",
    exampleSentence: {
      gujarati: "ટેબલ પર શું છે?",
      english: "What is on the table?",
      parts: [
        { text: "What", label: "Question Word" },
        { text: "is", label: "Verb (Present)" },
        { text: "on", label: "Preposition" },
        { text: "the table?", label: "Location" },
      ],
    },
  },
  whose_section: {
    topicKey: "whose_section",
    topicName: "Whose",
    formula: "Whose + [Noun/Item] + (is / are / was / were / will be) + (on / in / near / behind) + [Location] + ?",
    breakdown: [
      { part: "1. Whose + Noun", label: "Possession (કોનું/કોની + વસ્તુ)", examples: ["Whose purse", "Whose car", "Whose mobile"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (છે/હતું/હશે)", examples: ["is", "are", "was", "were", "will be"], color: "blue" },
      { part: "3. Preposition", label: "Position (પર/માં)", examples: ["on", "in", "near", "behind"], color: "amber" },
      { part: "4. Location", label: "Place (સ્થળ)", examples: ["the table", "the parking", "the office"], color: "emerald" },
    ],
    gujaratiPattern: "[સ્થળ] + માં/પર + કોનું/કોની/કોનો + [વસ્તુ] + [છે/હતું/હશે] + ?",
    exampleSentence: {
      gujarati: "ટેબલ પર કોનું પર્સ છે?",
      english: "Whose purse is on the table?",
      parts: [
        { text: "Whose purse", label: "Whose + Noun" },
        { text: "is", label: "Verb" },
        { text: "on", label: "Preposition" },
        { text: "the table?", label: "Location" },
      ],
    },
  },
  where_section: {
    topicKey: "where_section",
    topicName: "Where",
    formula: "Where + (is / are / was / were / do / does / will be) + [Subject/Person/Object] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (ક્યાં)", examples: ["Where"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (છે/હતું/હશે)", examples: ["is", "are", "was", "were", "will be"], color: "blue" },
      { part: "3. Subject / Person", label: "Person/Thing (વ્યક્તિ/વસ્તુ)", examples: ["you", "Rahul", "the key", "my bag"], color: "emerald" },
    ],
    gujaratiPattern: "[વ્યક્તિ/વસ્તુ] + ક્યાં + [છે/હતું/હશે] + ?",
    exampleSentence: {
      gujarati: "તમે ક્યાં રહો છો?",
      english: "Where do you live?",
      parts: [
        { text: "Where", label: "Question Word" },
        { text: "do", label: "Auxiliary Verb" },
        { text: "you", label: "Subject" },
        { text: "live?", label: "Main Verb" },
      ],
    },
  },
  which_section: {
    topicKey: "which_section",
    topicName: "Which",
    formula: "Which + [Noun/Option] + (do / does / is / are / was / were) + [Subject] + [Verb] + ?",
    breakdown: [
      { part: "1. Which + Noun", label: "Selection (કઈ/કયો/કયું + વસ્તુ)", examples: ["Which color", "Which game", "Which book"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (પસંદ છે/હતું)", examples: ["do", "does", "is", "are"], color: "blue" },
      { part: "3. Subject + Verb", label: "Subject & Action (તમે/તે)", examples: ["you like", "she want", "is best"], color: "emerald" },
    ],
    gujaratiPattern: "તમને + કઈ/કયો/કયું + [વસ્તુ] + પસંદ છે + ?",
    exampleSentence: {
      gujarati: "તમને કઈ રમત પસંદ છે?",
      english: "Which game do you like?",
      parts: [
        { text: "Which game", label: "Which + Choice" },
        { text: "do", label: "Auxiliary" },
        { text: "you", label: "Subject" },
        { text: "like?", label: "Verb" },
      ],
    },
  },
  how_many_much_section: {
    topicKey: "how_many_much_section",
    topicName: "How Many / How Much",
    formula: "How many / How much + [Noun (Plural/Uncountable)] + (do / does / is / are / was / were / will be) + [Subject / Location] + ?",
    breakdown: [
      { part: "1. How Many / How Much", label: "Quantity (કેટલા / કેટલું)", examples: ["How many apples", "How much water"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (છે/હતા/હશે)", examples: ["do you have", "were in", "will be in"], color: "blue" },
      { part: "3. Subject / Location", label: "Owner/Location (તમારી પાસે/વર્ગમાં)", examples: ["do you have", "are on the bench"], color: "emerald" },
    ],
    gujaratiPattern: "તમારી પાસે / [સ્થળમાં] + કેટલા/કેટલું + [વસ્તુ] + [છે/હતા/હશે] + ?",
    exampleSentence: {
      gujarati: "તમારી પાસે કેટલા સફરજન છે?",
      english: "How many apples do you have?",
      parts: [
        { text: "How many apples", label: "Quantity + Noun" },
        { text: "do", label: "Auxiliary" },
        { text: "you", label: "Subject" },
        { text: "have?", label: "Possession Verb" },
      ],
    },
  },
  when_section: {
    topicKey: "when_section",
    topicName: "When",
    formula: "When + (will / do / does / did / is / are) + [Subject] + [Verb] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (ક્યારે)", examples: ["When"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (આવશો/ગયા/છે)", examples: ["will", "do", "did", "is"], color: "blue" },
      { part: "3. Subject & Verb", label: "Person & Action (તમે/તે)", examples: ["you come", "she leave", "we start"], color: "emerald" },
    ],
    gujaratiPattern: "તમે / [વ્યક્તિ] + ક્યારે + [ક્રિયા] + [છે/હતા/હશે] + ?",
    exampleSentence: {
      gujarati: "તમે ક્યારે આવશો?",
      english: "When will you come?",
      parts: [
        { text: "When", label: "Question Word" },
        { text: "will", label: "Future Verb" },
        { text: "you", label: "Subject" },
        { text: "come?", label: "Main Action Verb" },
      ],
    },
  },
  why_section: {
    topicKey: "why_section",
    topicName: "Why",
    formula: "Why + (are / is / were / do / does / did) + [Subject] + [Verb / Adjective] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (શા માટે / કેમ)", examples: ["Why"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense (છો/હતા/કર્યું)", examples: ["are", "is", "were", "did"], color: "blue" },
      { part: "3. Subject & State", label: "Reason Subject (તમે/તે મોડા)", examples: ["you late", "he crying"], color: "emerald" },
    ],
    gujaratiPattern: "તમે / [વ્યક્તિ] + શા માટે/કેમ + [મોડા/આમ] + [છો/હતા] + ?",
    exampleSentence: {
      gujarati: "તમે કેમ મોડા પડ્યા?",
      english: "Why are you late?",
      parts: [
        { text: "Why", label: "Question Word" },
        { text: "are", label: "Helping Verb" },
        { text: "you", label: "Subject" },
        { text: "late?", label: "Adjective" },
      ],
    },
  },
  how_section: {
    topicKey: "how_section",
    topicName: "How",
    formula: "How + (are / is / do / does / can) + [Subject] + [Verb] + ?",
    breakdown: [
      { part: "1. Question Word", label: "Question (કેવી રીતે / કેમ)", examples: ["How"], color: "purple" },
      { part: "2. Helping Verb", label: "Tense/Modal (છો/શકો)", examples: ["are", "is", "can", "do"], color: "blue" },
      { part: "3. Subject & Verb", label: "Action (તમે/હું કરી શકીએ)", examples: ["are you", "can I help"], color: "emerald" },
    ],
    gujaratiPattern: "તમે / [વ્યક્તિ] + કેવી રીતે + [છો/કરશો] + ?",
    exampleSentence: {
      gujarati: "તમે કેમ છો?",
      english: "How are you?",
      parts: [
        { text: "How", label: "Question Word" },
        { text: "are", label: "Verb" },
        { text: "you?", label: "Subject" },
      ],
    },
  },
  can_section: {
    topicKey: "can_section",
    topicName: "Can (Ability)",
    formula: "Subject + Can + [Base Verb] + [Object] / Can + Subject + [Base Verb] + ?",
    breakdown: [
      { part: "1. Subject / Can", label: "Ability Modal (શકવું)", examples: ["I can", "Can you"], color: "purple" },
      { part: "2. Base Verb", label: "Main Action (ચલાવવું/બોલવું)", examples: ["drive", "speak", "help"], color: "blue" },
      { part: "3. Object", label: "Thing/Language (કાર/અંગ્રેજી)", examples: ["a car", "English", "me"], color: "emerald" },
    ],
    gujaratiPattern: "હું/તમે + [વસ્તુ/ક્રિયા] + [કરી] + શકું છું/શકશો + ?",
    exampleSentence: {
      gujarati: "હું કાર ચલાવી શકું છું.",
      english: "I can drive a car.",
      parts: [
        { text: "I", label: "Subject" },
        { text: "can", label: "Modal Verb" },
        { text: "drive", label: "Base Action Verb" },
        { text: "a car.", label: "Object" },
      ],
    },
  },
  could_section: {
    topicKey: "could_section",
    topicName: "Could (Polite Request)",
    formula: "Could + [Subject] + (please) + [Base Verb] + [Object] + ?",
    breakdown: [
      { part: "1. Polite Modal", label: "Polite Request (શું તમે... શકશો)", examples: ["Could"], color: "purple" },
      { part: "2. Subject", label: "Person (તમે/તેઓ)", examples: ["you"], color: "blue" },
      { part: "3. Action Verb", label: "Action (મદદ કરવી/આપવું)", examples: ["please help", "pass the salt"], color: "emerald" },
    ],
    gujaratiPattern: "શું તમે + [મને/અમને] + [મદદ] + કરી શકશો + ?",
    exampleSentence: {
      gujarati: "શું તમે મને મદદ કરી શકશો?",
      english: "Could you please help me?",
      parts: [
        { text: "Could", label: "Polite Request" },
        { text: "you", label: "Subject" },
        { text: "please help", label: "Action Verb" },
        { text: "me?", label: "Object" },
      ],
    },
  },
  will_section: {
    topicKey: "will_section",
    topicName: "Will (Future Tense)",
    formula: "Subject + Will + [Base Verb] + [Object / Time] / Will + Subject + [Verb] + ?",
    breakdown: [
      { part: "1. Subject", label: "Person/Agent (હું/તમે/તે)", examples: ["I", "He", "They", "Will you"], color: "purple" },
      { part: "2. Will + Verb", label: "Future Action (આવશે/જશે/કરશે)", examples: ["will come", "will buy", "will go"], color: "blue" },
      { part: "3. Time / Object", label: "Time/Place (આવતીકાલે/નવો ફોન)", examples: ["tomorrow", "a new phone"], color: "emerald" },
    ],
    gujaratiPattern: "હું/તે + [આવતીકાલે/સ્થળે] + [જશે/આવશે/ખરીદશે]",
    exampleSentence: {
      gujarati: "હું આવતીકાલે આવીશ.",
      english: "I will come tomorrow.",
      parts: [
        { text: "I", label: "Subject" },
        { text: "will come", label: "Future Verb" },
        { text: "tomorrow.", label: "Time Specification" },
      ],
    },
  },
  would_section: {
    topicKey: "would_section",
    topicName: "Would (Offer / Preference)",
    formula: "Would + you + like + (to have / to drink) + [Object] + ?",
    breakdown: [
      { part: "1. Offer Modal", label: "Polite Offer (શું લેવાનું પસંદ કરશો)", examples: ["Would"], color: "purple" },
      { part: "2. Subject + Like", label: "Preference (તમને પસંદ પડશે)", examples: ["you like"], color: "blue" },
      { part: "3. Object / Drink", label: "Item (ચા/કોફી)", examples: ["some tea", "a cup of coffee"], color: "emerald" },
    ],
    gujaratiPattern: "શું તમે + [ચા/કોફી] + લેવાનું પસંદ કરશો + ?",
    exampleSentence: {
      gujarati: "શું તમે ચા લેશો?",
      english: "Would you like some tea?",
      parts: [
        { text: "Would", label: "Polite Offer" },
        { text: "you like", label: "Preference Verb" },
        { text: "some tea?", label: "Offer Item" },
      ],
    },
  },
  should_section: {
    topicKey: "should_section",
    topicName: "Should (Advice)",
    formula: "Subject + Should + [Base Verb] + [Object] / Should + Subject + [Verb] + ?",
    breakdown: [
      { part: "1. Subject / Modal", label: "Advice Modal (જોઈએ)", examples: ["You should", "Should I"], color: "purple" },
      { part: "2. Base Action Verb", label: "Action (અભ્યાસ કરવો/જવું)", examples: ["study", "go home", "consult"], color: "blue" },
      { part: "3. Object", label: "Target (ડૉક્ટર/નિયમિત)", examples: ["a doctor", "daily"], color: "emerald" },
    ],
    gujaratiPattern: "તમારે + [અભ્યાસ/ડૉક્ટરની સલાહ] + લેવી જોઈએ",
    exampleSentence: {
      gujarati: "તમારે રોજ અભ્યાસ કરવો જોઈએ.",
      english: "You should study daily.",
      parts: [
        { text: "You", label: "Subject" },
        { text: "should", label: "Advice Modal" },
        { text: "study", label: "Base Action" },
        { text: "daily.", label: "Frequency" },
      ],
    },
  },
  must_section: {
    topicKey: "must_section",
    topicName: "Must (Compulsion)",
    formula: "Subject + Must + [Base Verb] + [Object]",
    breakdown: [
      { part: "1. Subject", label: "Person (તમારે/આપણે)", examples: ["You", "We", "Drivers"], color: "purple" },
      { part: "2. Must + Action", label: "Strong Obligation (જરૂરથી જ કરવું જ પડશે)", examples: ["must follow", "must stop"], color: "blue" },
      { part: "3. Rule / Target", label: "Rule/Object (ટ્રાફિક નિયમો)", examples: ["traffic rules", "here"], color: "emerald" },
    ],
    gujaratiPattern: "તમારે + [નિયમોનું] + ચોક્કસપણે પાલન કરવું જ પડશે",
    exampleSentence: {
      gujarati: "તમારે ટ્રાફિકના નિયમો પાળવા જ પડશે.",
      english: "You must follow traffic rules.",
      parts: [
        { text: "You", label: "Subject" },
        { text: "must follow", label: "Compulsory Action" },
        { text: "traffic rules.", label: "Rules" },
      ],
    },
  },
  has_have_had_section: {
    topicKey: "has_have_had_section",
    topicName: "Has / Have / Had (Possession & Tense)",
    formula: "Subject + (has / have / had) + [Noun / Possession / Past Participle]",
    breakdown: [
      { part: "1. Subject", label: "Owner (હું/તેણી/તેઓ)", examples: ["I", "She", "We", "He"], color: "purple" },
      { part: "2. Has / Have / Had", label: "Tense Possession (પાસે છે/હતું)", examples: ["has", "have", "had"], color: "blue" },
      { part: "3. Noun / Item", label: "Item (કાર/પેન/પ્રશ્ન)", examples: ["a car", "a new pen", "finished the work"], color: "emerald" },
    ],
    gujaratiPattern: "[વ્યક્તિ] + પાસે + [વસ્તુ] + [છે/હતી]",
    exampleSentence: {
      gujarati: "તેણી પાસે નવી કાર છે.",
      english: "She has a new car.",
      parts: [
        { text: "She", label: "Subject" },
        { text: "has", label: "Possession Verb (Present)" },
        { text: "a new car.", label: "Item/Noun" },
      ],
    },
  },
};

const getValidAnswers = (question?: SentenceQuestion): string[] => {
  if (!question) return [];
  const list: string[] = [];
  if (question.english) {
    list.push(question.english);
  }
  if (Array.isArray(question.answers)) {
    question.answers.forEach((ans) => {
      if (ans && typeof ans === "string") {
        list.push(ans);
      }
    });
  }
  return Array.from(new Set(list.map((a) => a.trim()))).filter((a) => a.length > 0);
};

const normalizeSentence = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()'"’]/g, "")
    .replace(/\s+/g, " ");
};

const getBestMatchingAnswer = (user: string, validAnswers: string[]): string => {
  if (validAnswers.length === 0) return "";
  const userWords = normalizeSentence(user).split(" ").filter(Boolean);

  let best = validAnswers[0];
  let maxMatches = -1;

  for (const ans of validAnswers) {
    const ansWords = normalizeSentence(ans).split(" ").filter(Boolean);
    const matches = ansWords.filter((w) => userWords.includes(w)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      best = ans;
    }
  }
  return best;
};

// Derive formula helper for current question topic
export const getTopicFormula = (topicNameOrKey?: string): TopicFormula => {
  const name = (topicNameOrKey || "").toLowerCase();
  if (name.includes("who_section") || name === "who" || name.includes("who ")) return SENTENCE_FORMULAS.who_section;
  if (name.includes("what_section") || name === "what" || name.includes("what ")) return SENTENCE_FORMULAS.what_section;
  if (name.includes("whose_section") || name === "whose" || name.includes("whose ")) return SENTENCE_FORMULAS.whose_section;
  if (name.includes("where_section") || name === "where" || name.includes("where ")) return SENTENCE_FORMULAS.where_section;
  if (name.includes("which_section") || name === "which" || name.includes("which ")) return SENTENCE_FORMULAS.which_section;
  if (name.includes("how_many") || name.includes("how_much") || name.includes("how many") || name.includes("how much")) return SENTENCE_FORMULAS.how_many_much_section;
  if (name.includes("when")) return SENTENCE_FORMULAS.when_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("why")) return SENTENCE_FORMULAS.why_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("how")) return SENTENCE_FORMULAS.how_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("can")) return SENTENCE_FORMULAS.can_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("could")) return SENTENCE_FORMULAS.could_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("will")) return SENTENCE_FORMULAS.will_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("would")) return SENTENCE_FORMULAS.would_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("should")) return SENTENCE_FORMULAS.should_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("must")) return SENTENCE_FORMULAS.must_section || SENTENCE_FORMULAS.who_section;
  if (name.includes("has") || name.includes("have") || name.includes("had")) return SENTENCE_FORMULAS.has_have_had_section || SENTENCE_FORMULAS.who_section;
  return SENTENCE_FORMULAS.who_section;
};

export function SentencePracticeView({ questions, onComplete, initialPageMode }: SentencePracticeViewProps) {
  const { toast } = useToast();
  const [pageMode, setPageMode] = useState<"selection" | "study" | "exam">(initialPageMode || "selection");
  const [studyIndex, setStudyIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "revealed">("idle");
  const [btnState, setBtnState] = useState<ButtonState>("idle");
  const [shake, setShake] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(storage.getStats().streak);
  const [islandMsg, setIslandMsg] = useState<string | null>(null);
  const [mistakesList, setMistakesList] = useState<any[]>([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const examId = `sentence_${questions[0]?.topic || 'all'}`;
  const [activeDraft, setActiveDraft] = useState<any | null>(null);

  useEffect(() => {
    if (pageMode === "exam") {
      const draft = storage.getExamDraft(examId);
      if (draft && draft.currentIndex > 0) {
        setActiveDraft(draft);
      }
    }
  }, [pageMode, examId]);

  const handleResumeExamDraft = () => {
    if (!activeDraft) return;
    setCurrentIndex(activeDraft.currentIndex || 0);
    setCorrectCount(activeDraft.correctCount || 0);
    setSessionXP(activeDraft.sessionXP || 0);
    if (activeDraft.mistakesList) setMistakesList(activeDraft.mistakesList);
    setActiveDraft(null);
    toast({
      title: "Sentence Practice Resumed 🚀",
      description: `Restored your practice session on question ${activeDraft.currentIndex + 1}.`,
      type: "success",
    });
  };

  const handleStartFreshExam = () => {
    storage.clearExamDraft(examId);
    setActiveDraft(null);
    setCurrentIndex(0);
    setUserAnswer("");
    setStatus("idle");
    setBtnState("idle");
    setCorrectCount(0);
    setSessionXP(0);
    setMistakesList([]);
    toast({
      title: "Fresh Exam Started 🔄",
      description: "Cleared previous sentence practice session.",
      type: "info",
    });
  };

  useEffect(() => {
    if (pageMode === "exam" && !activeDraft && currentIndex > 0) {
      storage.saveExamDraft({
        examId,
        examType: "sentence",
        currentIndex,
        correctCount,
        sessionXP,
        mistakesList,
      });
    }
  }, [pageMode, examId, currentIndex, correctCount, sessionXP, mistakesList, activeDraft]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const studyQuestion = questions[studyIndex] || questions[0];
  const validAnswers = getValidAnswers(currentQuestion);
  const studyValidAnswers = getValidAnswers(studyQuestion);

  // Gather ALL unique formulas for all selected topic questions
  const allActiveTopicFormulas = React.useMemo(() => {
    const map = new Map<string, TopicFormula>();
    questions.forEach((q) => {
      const formula = getTopicFormula(q.topic);
      if (formula && !map.has(formula.topicKey)) {
        map.set(formula.topicKey, formula);
      }
    });
    return Array.from(map.values());
  }, [questions]);

  // Selected topic formula tab in study mode
  const [activeFormulaKey, setActiveFormulaKey] = useState<string | null>(null);

  useEffect(() => {
    const currentTopic = pageMode === "study" ? studyQuestion?.topic : currentQuestion?.topic;
    if (currentTopic) {
      const formula = getTopicFormula(currentTopic);
      setActiveFormulaKey(formula.topicKey);
    }
  }, [studyIndex, currentIndex, pageMode, studyQuestion, currentQuestion]);

  const activeTopicFormula = (activeFormulaKey && SENTENCE_FORMULAS[activeFormulaKey])
    ? SENTENCE_FORMULAS[activeFormulaKey]
    : (allActiveTopicFormulas[0] || SENTENCE_FORMULAS.who_section);

  const handleGetAiExplanation = async () => {
    setLoadingAi(true);
    const res = await requestGeminiAI({
      action: "explain_mistake",
      gujarati: currentQuestion.gujarati,
      userAnswer: userAnswer,
      correctAnswers: validAnswers,
      topic: currentQuestion.topic,
    });
    setLoadingAi(false);
    if (res.text) {
      setAiExplanation(res.text);
    } else if (res.message) {
      setAiExplanation(`⚠️ ${res.message}`);
    }
  };

  useEffect(() => {
    if (pageMode === "exam" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentIndex, status, pageMode]);

  useEffect(() => {
    const q = pageMode === "study" ? studyQuestion : currentQuestion;
    if (q) {
      const favs = storage.getFavorites();
      setIsFav(favs.some((f) => f.id === q.id));
    }
  }, [currentQuestion, studyQuestion, pageMode]);

  const fireConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleFavorite = (q: SentenceQuestion) => {
    if (!q) return;
    const item: FavoriteItem = {
      id: q.id,
      gujarati: q.gujarati,
      english: q.english,
      categoryOrTopic: q.topic || "Sentence",
      type: "sentence",
    };
    const added = storage.toggleFavorite(item);
    setIsFav(added);
  };

  const playGujaratiAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "gu-IN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakEnglishAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getWordDiffs = (user: string, targetAnswer: string) => {
    const userWords = normalizeSentence(user).split(" ").filter(Boolean);
    const targetWords = targetAnswer.trim().split(/\s+/);

    return targetWords.map((word) => {
      const cleanWord = normalizeSentence(word);
      const isMatched = userWords.includes(cleanWord);
      return {
        word,
        matched: isMatched,
      };
    });
  };

  const checkAnswer = () => {
    if (!userAnswer.trim() || status === "correct") return;

    const formattedUser = normalizeSentence(userAnswer);
    const isMatched = validAnswers.some((ans) => normalizeSentence(ans) === formattedUser);

    if (isMatched) {
      setStatus("correct");
      setBtnState("success");
      setCorrectCount((prev) => prev + 1);

      const gainedXP = 25;
      setSessionXP((prev) => prev + gainedXP);
      setSessionStreak((prev) => prev + 1);

      storage.addXP(gainedXP, true);
      fireConfetti();
      setIslandMsg("Flawless Sentence Translation! +25 XP 🌟");

      setTimeout(() => {
        setIslandMsg(null);
        nextQuestion();
      }, 900);
    } else {
      setStatus("wrong");
      setBtnState("error");
      setShake(true);
      setSessionStreak(0);

      const mistake = {
        id: currentQuestion.id,
        gujarati: currentQuestion.gujarati,
        correctEnglish: currentQuestion.english,
        answers: validAnswers,
        userAnswer: userAnswer.trim(),
        topic: currentQuestion.topic || "Sentence",
        type: "sentence",
        timestamp: Date.now(),
      };
      storage.addMistake(mistake as any);
      setMistakesList((prev) => [...prev, mistake]);
      storage.addXP(0, false);

      setIslandMsg("Review the word diff below!");

      setTimeout(() => {
        setShake(false);
        setBtnState("idle");
      }, 500);
    }
  };

  const handleSkip = () => {
    setStatus("idle");
    setUserAnswer("");
    setBtnState("idle");
    setAiExplanation(null);
    nextQuestion();
  };

  const handleShowAnswer = () => {
    setStatus("revealed");
    setUserAnswer(validAnswers[0] || currentQuestion.english);
  };

  const nextQuestion = () => {
    setAiExplanation(null);
    if (currentIndex + 1 >= questions.length) {
      const total = questions.length;
      const acc = Math.round((correctCount / total) * 100);
      storage.clearExamDraft(examId);
      onComplete(correctCount, acc, sessionXP, mistakesList);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setStatus("idle");
      setBtnState("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (status === "correct" || status === "revealed") {
        nextQuestion();
      } else {
        checkAnswer();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleSkip();
    }
  };

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);
  const bestTargetAnswer = getBestMatchingAnswer(userAnswer, validAnswers);
  const diffs = getWordDiffs(userAnswer, bestTargetAnswer);

  if (pageMode === "selection") {
    return (
      <div className="space-y-4 max-w-3xl mx-auto py-2 select-none">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-0.5 text-[11px] font-extrabold text-purple-600 dark:text-purple-400">
            <Sparkles className="h-3 w-3" /> Sentence Hub
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-3xl">
            Select Sentence Practice Mode
          </h2>
        </motion.div>

        {/* Compact Mode Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Card 1: Read & Study Sentences */}
          <div
            onClick={() => setPageMode("study")}
            className="group cursor-pointer rounded-2xl border border-indigo-500/30 bg-card p-4 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                  Study Mode
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-foreground group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  📖 Read & Study Sentences
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  Read Gujarati sentences, listen to audio, and review grammar structure formulas.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Grammar Formulas
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="h-3 w-3" /> Audio Pronunciation
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-black text-white group-hover:bg-indigo-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <span>Start Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Take Sentence Exam */}
          <div
            onClick={() => setPageMode("exam")}
            className="group cursor-pointer rounded-2xl border border-purple-500/30 bg-card p-4 shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Star className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-purple-600 dark:text-purple-400">
                  Exam Mode
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-foreground group-hover:text-purple-600 transition-colors flex items-center gap-1.5">
                  ✍️ Take Sentence Exam
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  Type English sentence translations to earn +25 XP, build streaks, and get AI feedback.
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Diff Analysis
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="h-3 w-3" /> Gemini AI Tutor
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-black text-white group-hover:bg-purple-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <span>Start Exam</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-between py-6 max-w-4xl mx-auto select-none space-y-6">
      <DynamicIsland
        streak={sessionStreak}
        xp={sessionXP}
        currentQuestion={pageMode === "study" ? studyIndex + 1 : currentIndex + 1}
        totalQuestions={questions.length}
        activeMessage={islandMsg}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <div className="pt-12 flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setPageMode("selection")}
          className="flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>← Back to Mode Select</span>
        </button>

        {pageMode === "study" ? (
          <button
            type="button"
            onClick={() => setPageMode("exam")}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-purple-700 transition-colors shadow-md"
          >
            <span>Finished Studying? Take Exam 🚀</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPageMode("study")}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-extrabold text-foreground hover:bg-muted transition-colors"
          >
            <span>📖 Read Sentences First</span>
          </button>
        )}
      </div>

      {pageMode === "study" ? (
        <div className="space-y-6">
          {/* GRAMMAR STRUCTURE FORMULA GUIDE CARD */}
          {activeTopicFormula && (
            <div className="rounded-[28px] border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-card p-6 sm:p-8 shadow-xl space-y-5 text-left">
              {/* Topic Formula Selector Tabs (if multiple topics selected) */}
              {allActiveTopicFormulas.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-purple-500/20">
                  <span className="text-xs font-bold text-muted-foreground mr-1">
                    Formulas for Selected Topics ({allActiveTopicFormulas.length}):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {allActiveTopicFormulas.map((f) => {
                      const isSelected = activeTopicFormula?.topicKey === f.topicKey;
                      return (
                        <button
                          key={f.topicKey}
                          type="button"
                          onClick={() => setActiveFormulaKey(f.topicKey)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                              : "bg-background text-foreground border border-border hover:bg-purple-500/10"
                          }`}
                        >
                          {f.topicName} Formula
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-black text-foreground">
                    English Sentence Structure Formula ({activeTopicFormula.topicName})
                  </h3>
                </div>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400 self-start sm:self-auto">
                  Grammar Rule & Pattern Guide
                </span>
              </div>

              {/* Exact Formula Code Box */}
              <div className="p-4 rounded-2xl bg-slate-950 text-purple-300 font-mono text-xs sm:text-sm font-black border border-purple-500/30 shadow-inner overflow-x-auto">
                {activeTopicFormula.formula}
              </div>

              {/* Part-by-part breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeTopicFormula.breakdown.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-border bg-background space-y-1 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500 block">
                      {item.part}
                    </span>
                    <span className="text-xs font-bold text-foreground block">
                      {item.label}
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {item.examples.map((ex, exIdx) => (
                        <span key={exIdx} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/20">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gujarati Pattern Equivalent */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-purple-600 dark:text-purple-400">Gujarati Sentence Pattern:</span>
                <span className="font-black text-foreground font-mono">{activeTopicFormula.gujaratiPattern}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pt-2">
            <span>Sentence Practice Directory ({questions.length} Sentences)</span>
            <span>Click any sentence card for full details & audio 🔊</span>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6 shadow-xl space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {questions.map((q, idx) => {
                return (
                  <div
                    key={q.id || idx}
                    onClick={() => {
                      setStudyIndex(idx);
                      const f = getTopicFormula(q.topic);
                      if (f) setActiveFormulaKey(f.topicKey);
                      setDrawerOpen(true);
                    }}
                    className="cursor-pointer rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500 hover:bg-purple-500/5 transition-all shadow-sm group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs mt-0.5">
                        #{idx + 1}
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-600 dark:text-purple-400">
                            {q.topic}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-foreground block group-hover:text-purple-600 transition-colors">
                          {q.gujarati}
                        </h4>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {q.english}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playGujaratiAudio(q.gujarati);
                        }}
                        title="Listen to Gujarati Audio"
                        className="h-9 w-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-md"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-extrabold text-muted-foreground group-hover:text-purple-600 transition-colors">
                        Details ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setPageMode("exam")}
              className="w-full max-w-md rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-sm font-black text-white hover:from-purple-700 hover:to-indigo-700 shadow-xl transition-all"
            >
              <span>I'm Ready! Start Exam Now 🚀</span>
            </button>
          </div>

          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="Sentence Study & Audio Pronunciation"
            side="right"
          >
            <div className="space-y-6 pt-2 text-center">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400">
                  {studyQuestion.topic || "Sentence"}
                </span>

                <button
                  type="button"
                  onClick={() => handleFavorite(studyQuestion)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                    isFav
                      ? "bg-amber-500/20 border-amber-500 text-amber-500"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
                </button>
              </div>

              {/* Gujarati Sentence & Audio */}
              <div className="space-y-3 py-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Gujarati Sentence
                </span>
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl font-black text-foreground">
                    {studyQuestion.gujarati}
                  </h2>
                  <button
                    type="button"
                    onClick={() => playGujaratiAudio(studyQuestion.gujarati)}
                    title="Listen Gujarati"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-colors"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* English Translation & Audio */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6 space-y-4 text-left">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block text-center">
                  Accepted English Translation(s)
                </span>

                <div className="space-y-2">
                  {studyValidAnswers.map((ans, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border">
                      <span className="text-base font-extrabold text-foreground">{ans}</span>
                      <button
                        type="button"
                        onClick={() => speakEnglishAudio(ans)}
                        title="Listen English"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentence Formula Box for Drawer */}
              {activeTopicFormula && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-left space-y-2">
                  <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 block uppercase tracking-wider">
                    Grammar Formula ({activeTopicFormula.topicName}):
                  </span>
                  <p className="text-xs font-mono font-black text-foreground">
                    {activeTopicFormula.formula}
                  </p>
                </div>
              )}

              {/* Hint / Notes */}
              {studyQuestion.hint && (
                <div className="p-4 rounded-2xl bg-muted/50 border border-border text-left space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground block">Grammar Hint & Usage:</span>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 italic">
                    "{studyQuestion.hint}"
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={studyIndex === 0}
                  onClick={() => setStudyIndex((prev) => Math.max(0, prev - 1))}
                  className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  disabled={studyIndex >= questions.length - 1}
                  onClick={() => setStudyIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  Next →
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setPageMode("exam");
                  }}
                  className="w-full rounded-2xl bg-purple-600 py-3.5 text-xs font-extrabold text-white hover:bg-purple-700 shadow-md transition-colors"
                >
                  Start Practice Exam Now 🚀
                </button>
              </div>
            </div>
          </Drawer>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Resume Saved Exam Banner */}
          {activeDraft && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-indigo-500/40 bg-indigo-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shrink-0 font-bold">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground">Unfinished Sentence Session Found!</h4>
                  <p className="text-xs text-muted-foreground font-medium">
                    You were on Question {activeDraft.currentIndex + 1} of {questions.length} ({formatRelativeTime(new Date(activeDraft.timestamp).toISOString())}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleStartFreshExam}
                  className="flex-1 sm:flex-none h-10 rounded-xl border border-border bg-card hover:bg-muted px-4 text-xs font-extrabold text-foreground transition-all shadow-xs"
                >
                  Start Fresh Exam 🔄
                </button>

                <button
                  type="button"
                  onClick={handleResumeExamDraft}
                  className="flex-1 sm:flex-none h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 text-xs font-black shadow-md shadow-indigo-600/30 transition-all"
                >
                  Resume Saved Session 🚀
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  Sentence {currentIndex + 1} of {questions.length}
                </span>
                <button
                  type="button"
                  onClick={handleStartFreshExam}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card hover:bg-rose-500/10 hover:border-rose-500/30 px-2.5 py-1 text-[11px] font-extrabold text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-all shadow-xs"
                  title="Restart exam from Question 1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Start Fresh</span>
                </button>
              </div>
              <span>{progressPct}% Complete</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
              />
            </div>
          </div>

          <motion.div
            animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`relative my-4 rounded-[32px] border p-8 sm:p-12 shadow-2xl transition-colors bg-card ${
              status === "correct"
                ? "border-emerald-500 bg-emerald-500/5 shadow-emerald-500/20"
                : status === "wrong"
                ? "border-rose-500 bg-rose-500/5 shadow-rose-500/20"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-extrabold text-purple-600 dark:text-purple-400">
                Grammar Topic: {currentQuestion.topic}
              </span>

              <button
                type="button"
                onClick={() => handleFavorite(currentQuestion)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  isFav
                    ? "bg-amber-500/20 border-amber-500 text-amber-500"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
              </button>
            </div>

            <div className="text-center space-y-3 mb-8">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                Translate Complete Gujarati Sentence
              </span>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-wide font-sans leading-tight">
                  {currentQuestion.gujarati}
                </h2>
                <button
                  type="button"
                  onClick={() => playGujaratiAudio(currentQuestion.gujarati)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all shrink-0 shadow-sm"
                  title="Listen to Gujarati sentence audio"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              {currentQuestion.hint && (
                <p className="text-xs text-indigo-500 font-medium flex items-center justify-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> {currentQuestion.hint}
                </p>
              )}
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (status === "wrong") setStatus("idle");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Write complete English translation... (Press Enter to submit)"
                  disabled={status === "correct"}
                  className={`w-full rounded-2xl border p-5 text-base font-semibold text-foreground placeholder:text-muted-foreground/60 outline-none transition-all shadow-inner resize-none ${
                    status === "correct"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : status === "wrong"
                      ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "border-border bg-background focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  }`}
                />
              </div>

              <AnimatePresence>
                {status === "wrong" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-3 text-xs"
                  >
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>Translation Needs Revision</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground font-semibold block">Your Answer:</span>
                      <p className="text-foreground font-medium bg-background/60 p-2.5 rounded-xl border border-border">
                        {userAnswer}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-muted-foreground font-semibold block">
                        Target Answer Analysis (Closest Match: "{bestTargetAnswer}"):
                      </span>
                      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-background border border-border">
                        {diffs.map((d, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              d.matched
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 underline decoration-rose-500 decoration-2"
                            }`}
                          >
                            {d.word}
                          </span>
                        ))}
                      </div>
                    </div>

                    {validAnswers.length > 1 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-muted-foreground font-semibold block">
                          All Valid Translations:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-foreground font-medium bg-background/60 p-2.5 rounded-xl border border-border">
                          {validAnswers.map((ans, idx) => (
                            <li key={idx}>{ans}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      {!aiExplanation ? (
                        <button
                          type="button"
                          onClick={handleGetAiExplanation}
                          disabled={loadingAi}
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-purple-600/10 border border-purple-500/30 p-2.5 text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 transition-colors"
                        >
                          {loadingAi ? (
                            <>
                              <MotionSpinner size="sm" />
                              <span>Gemini AI is analyzing your mistake...</span>
                            </>
                          ) : (
                            <>
                              <Bot className="h-4 w-4 text-purple-500" />
                              <span>Ask Gemini AI to Explain My Mistake ✨</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="rounded-xl border border-purple-500/30 bg-card p-3.5 space-y-1.5 text-left shadow-sm">
                          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-extrabold text-[11px]">
                            <Bot className="h-4 w-4 text-purple-500" />
                            <span>Gemini AI Tutor Explanation:</span>
                          </div>
                          <div className="text-foreground text-xs leading-relaxed font-medium">
                            <FormattedMarkdown content={aiExplanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {status === "revealed" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-center space-y-2"
                  >
                    <span className="text-xs font-semibold text-purple-500 block">
                      Accepted English Translation(s):
                    </span>
                    <div className="space-y-1">
                      {validAnswers.map((ans, idx) => (
                        <p key={idx} className="text-base font-extrabold text-foreground">
                          {ans}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                {status === "idle" || status === "wrong" ? (
                  <>
                    <StatefulButton
                      state={btnState}
                      variant="primary"
                      size="lg"
                      onClick={checkAnswer}
                      className="flex-1 min-w-[140px] bg-purple-600 hover:bg-purple-700"
                    >
                      <span>Submit Sentence</span>
                    </StatefulButton>

                    <button
                      type="button"
                      onClick={handleShowAnswer}
                      className="inline-flex h-14 items-center gap-1.5 rounded-[18px] border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 text-purple-500" /> Show Answer
                    </button>

                    <button
                      type="button"
                      onClick={handleSkip}
                      className="inline-flex h-14 items-center gap-1.5 rounded-[18px] border border-border bg-card px-5 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <SkipForward className="h-4 w-4" /> Skip
                    </button>
                  </>
                ) : (
                  <StatefulButton
                    variant="success"
                    size="lg"
                    onClick={nextQuestion}
                    className="w-full"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-5 w-5" />
                  </StatefulButton>
                )}
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-4">
            <span>Keyboard: <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Enter</kbd> = Submit, <kbd className="rounded border bg-muted px-1.5 py-0.5 font-bold">Esc</kbd> = Skip</span>
            <span>Auto-focus enabled</span>
          </div>
        </div>
      )}
    </div>
  );
}

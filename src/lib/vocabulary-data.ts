import vocabularyJson from "@/data/vocabulary.json";
import adjectivesJson from "@/data/adjectives_section.json";

export interface VocabQuestion {
  id: string | number;
  gujarati: string; // Gujarati meaning (e.g. "નવું", "આ")
  english: string; // English word (e.g. "New", "This")
  pronunciation_gujarati?: string; // Gujarati pronunciation (e.g. "ન્યુ", "Aa")
  phonetic?: string;
  english_pronunciation?: string;
  category?: string;
  difficulty?: string;
  example?: string;
  sectionId: "section1" | "section2" | string;
  sectionName: string;
}

export interface VocabSectionMeta {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  count: number;
  description: string;
  icon: string;
}

// Normalize Section 1 data (vocabulary.json)
const section1Items: VocabQuestion[] = (vocabularyJson as any[]).map((item) => ({
  id: item.id,
  gujarati: item.gujarati,
  english: item.english,
  pronunciation_gujarati: item.english_pronunciation || item.phonetic || item.gujarati,
  phonetic: item.phonetic,
  english_pronunciation: item.english_pronunciation,
  category: item.category || "General",
  difficulty: item.difficulty || "Easy",
  example: item.example,
  sectionId: "section1",
  sectionName: "Section 1: General Vocabulary",
}));

// Normalize Section 2 data (adjectives_section.json)
const section2Items: VocabQuestion[] = ((adjectivesJson as any).adjectives_section || []).map(
  (item: any, index: number) => ({
    id: `adj-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: "Adjectives",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section2",
    sectionName: "Section 2: Adjectives",
  })
);

export const ALL_VOCABULARY_QUESTIONS: VocabQuestion[] = [
  ...section1Items,
  ...section2Items,
];

export const VOCABULARY_SECTIONS: VocabSectionMeta[] = [
  {
    id: "all",
    name: "All Sections (Combined)",
    shortName: "All Sections",
    badge: "Combined",
    count: ALL_VOCABULARY_QUESTIONS.length,
    description: "Practice all words from both Section 1 and Section 2.",
    icon: "🌐",
  },
  {
    id: "section1",
    name: "Section 1: General Vocabulary",
    shortName: "Section 1",
    badge: "Core Vocab",
    count: section1Items.length,
    description: "Everyday pronouns, common words, verbs, and general vocabulary.",
    icon: "📚",
  },
  {
    id: "section2",
    name: "Section 2: Adjectives",
    shortName: "Section 2",
    badge: "Adjectives",
    count: section2Items.length,
    description: "Descriptive adjectives with English spellings, Gujarati pronunciation & meanings.",
    icon: "✨",
  },
];

export function getVocabularyQuestions(sectionId: string = "section1"): VocabQuestion[] {
  if (sectionId === "all") {
    return ALL_VOCABULARY_QUESTIONS;
  }
  if (sectionId === "section2") {
    return section2Items;
  }
  // Default to section 1
  return section1Items;
}

const STORAGE_KEY = "selected_vocab_section_id";

export function getStoredVocabSectionId(): string {
  if (typeof window === "undefined") return "section1";
  return localStorage.getItem(STORAGE_KEY) || "section1";
}

export function setStoredVocabSectionId(sectionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, sectionId);
}

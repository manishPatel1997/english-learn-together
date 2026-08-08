import vocabularyJson from "@/data/vocabulary.json";
import adjectivesJson from "@/data/adjectives_section.json";
import phoneticsJson from "@/data/phonetics_section.json";
import relativesJson from "@/data/relatives_section.json";
import professionalsJson from "@/data/professionals_section.json";

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
  sectionId: "section1" | "section2" | "section3" | "section4" | "section5" | string;
  sectionName: string;
}

export interface VocabSectionMeta {
  id: string;
  index: number;
  stepLabel: string;
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
  sectionName: "Section 1: General Vocabulary & Core Words",
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
    sectionName: "Section 2: Descriptive Adjectives",
  })
);

// Normalize Section 3 data (phonetics_section.json)
const section3Items: VocabQuestion[] = ((phoneticsJson as any).phonetics_section || []).map(
  (item: any, index: number) => ({
    id: `phonetic-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: item.category || "Phonetics",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section3",
    sectionName: "Section 3: Phonetics & Sound Rules",
  })
);

// Normalize Section 4 data (relatives_section.json)
const section4Items: VocabQuestion[] = ((relativesJson as any).relatives_section || []).map(
  (item: any, index: number) => ({
    id: `relative-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: item.category || "1. Relatives – સગાસંબંધીઓ",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section4",
    sectionName: "Section 4: 1. Relatives – સગાસંબંધીઓ",
  })
);

// Normalize Section 5 data (professionals_section.json)
const section5Items: VocabQuestion[] = ((professionalsJson as any).professionals_section || []).map(
  (item: any, index: number) => ({
    id: `prof-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: item.category || "2. Professionals – ધંધાદારીઓ",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section5",
    sectionName: "Section 5: 2. Professionals – ધંધાદારીઓ",
  })
);

export const ALL_VOCABULARY_QUESTIONS: VocabQuestion[] = [
  ...section1Items,
  ...section2Items,
  ...section3Items,
  ...section4Items,
  ...section5Items,
];

export const VOCABULARY_SECTIONS: VocabSectionMeta[] = [
  {
    id: "section1",
    index: 1,
    stepLabel: "Step 1",
    name: "Section 1: General Vocabulary & Core Words",
    shortName: "#1 Core Vocab",
    badge: "Start Here",
    count: section1Items.length,
    description: "Everyday pronouns, common words, verbs, and foundational vocabulary.",
    icon: "📚",
  },
  {
    id: "section2",
    index: 2,
    stepLabel: "Step 2",
    name: "Section 2: Descriptive Adjectives",
    shortName: "#2 Adjectives",
    badge: "Descriptive",
    count: section2Items.length,
    description: "Descriptive adjectives with English spellings, Gujarati pronunciation & meanings.",
    icon: "✨",
  },
  {
    id: "section3",
    index: 3,
    stepLabel: "Step 3",
    name: "Section 3: Phonetics & Sound Rules (Vowels)",
    shortName: "#3 Sound Rules",
    badge: "Pronunciation",
    count: section3Items.length,
    description: "Vowel pronunciations, sound endings (tion, ture, dge), and phonetic rules.",
    icon: "🔤",
  },
  {
    id: "section4",
    index: 4,
    stepLabel: "Step 4",
    name: "Section 4: 1. Relatives – સગાસંબંધીઓ",
    shortName: "#4 Relatives",
    badge: "Relationships",
    count: section4Items.length,
    description: "Family relations, relatives, titles, and social roles vocabulary.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "section5",
    index: 5,
    stepLabel: "Step 5",
    name: "Section 5: 2. Professionals – ધંધાદારીઓ",
    shortName: "#5 Professionals",
    badge: "Occupations",
    count: section5Items.length,
    description: "Professions, occupations, trades, jobs, and career vocabulary.",
    icon: "💼",
  },
  {
    id: "all",
    index: 0,
    stepLabel: "All",
    name: "All Sections (Combined Master List)",
    shortName: "All Sections",
    badge: "Combined",
    count: ALL_VOCABULARY_QUESTIONS.length,
    description: "Practice all words across Section 1, 2, 3, 4, and 5 combined.",
    icon: "🌐",
  },
];

export function getVocabularyQuestions(sectionId: string = "section1"): VocabQuestion[] {
  if (sectionId === "all") {
    return ALL_VOCABULARY_QUESTIONS;
  }
  if (sectionId === "section2") {
    return section2Items;
  }
  if (sectionId === "section3") {
    return section3Items;
  }
  if (sectionId === "section4") {
    return section4Items;
  }
  if (sectionId === "section5") {
    return section5Items;
  }
  // Default to section 1
  return section1Items;
}

export async function fetchVocabularyFromApi(sectionId: string = "section1"): Promise<VocabQuestion[]> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${API_BASE}/content/vocabulary?sectionId=${sectionId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("API fetch error, falling back to static dataset:", err);
  }
  return getVocabularyQuestions(sectionId);
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


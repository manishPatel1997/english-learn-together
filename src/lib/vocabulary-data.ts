import vocabularyJson from "@/data/vocabulary.json";
import adjectivesJson from "@/data/adjectives_section.json";
import phoneticsJson from "@/data/phonetics_section.json";
import relativesJson from "@/data/relatives_section.json";
import professionalsJson from "@/data/professionals_section.json";
import verbsJson from "@/data/verbs_section.json";
import animalsJson from "@/data/animals_and_birds_section.json";
import disastersJson from "@/data/disasters_and_epidemics_section.json";

export interface VocabQuestion {
  id: string | number;
  gujarati: string; // Gujarati meaning (e.g. "ખાવું", "નવું")
  english: string; // English word (e.g. "Eat", "New")
  pronunciation_gujarati?: string; // Gujarati pronunciation (e.g. "ઈટ", "ન્યુ")
  phonetic?: string;
  english_pronunciation?: string;
  category?: string;
  difficulty?: string;
  example?: string;
  sectionId: "section1" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "section8" | string;
  sectionName: string;
  v1_base_form?: string;
  v1_pronunciation_gujarati?: string;
  v2_past_simple?: string;
  v2_pronunciation_gujarati?: string;
  v3_past_participle?: string;
  v3_pronunciation_gujarati?: string;
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

// Normalize Section 6 data (verbs_section.json)
const section6Items: VocabQuestion[] = ((verbsJson as any).verbs_section || []).map(
  (item: any, index: number) => ({
    id: `verb-${item.id || index + 1}`,
    gujarati: item.gujarati,
    english: item.v1_base_form,
    pronunciation_gujarati: item.v1_pronunciation_gujarati,
    phonetic: `V1: ${item.v1_base_form} (${item.v1_pronunciation_gujarati}) | V2: ${item.v2_past_simple} (${item.v2_pronunciation_gujarati}) | V3: ${item.v3_past_participle} (${item.v3_pronunciation_gujarati})`,
    english_pronunciation: item.v1_base_form,
    category: "3. Verbs – ક્રિયાપદો (V1, V2, V3)",
    difficulty: "Easy",
    example: `V1: ${item.v1_base_form} (${item.v1_pronunciation_gujarati}) | V2: ${item.v2_past_simple} (${item.v2_pronunciation_gujarati}) | V3: ${item.v3_past_participle} (${item.v3_pronunciation_gujarati})`,
    sectionId: "section6",
    sectionName: "Section 6: 3. Verbs – ક્રિયાપદો (V1, V2, V3)",
    v1_base_form: item.v1_base_form,
    v1_pronunciation_gujarati: item.v1_pronunciation_gujarati,
    v2_past_simple: item.v2_past_simple,
    v2_pronunciation_gujarati: item.v2_pronunciation_gujarati,
    v3_past_participle: item.v3_past_participle,
    v3_pronunciation_gujarati: item.v3_pronunciation_gujarati,
  })
);

// Normalize Section 7 data (animals_and_birds_section.json)
const section7Items: VocabQuestion[] = ((animalsJson as any).animals_and_birds_section || []).map(
  (item: any, index: number) => ({
    id: `animal-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: item.category || "4. Animals & Birds – પ્રાણીઓ અને પક્ષીઓ",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section7",
    sectionName: "Section 7: 4. Animals & Birds – પ્રાણીઓ અને પક્ષીઓ",
  })
);

// Normalize Section 8 data (disasters_and_epidemics_section.json)
const section8Items: VocabQuestion[] = ((disastersJson as any).disasters_and_epidemics_section || []).map(
  (item: any, index: number) => ({
    id: `disaster-${index + 1}`,
    gujarati: item.meaning_gujarati || item.english,
    english: item.english,
    pronunciation_gujarati: item.pronunciation_gujarati,
    phonetic: item.pronunciation_gujarati,
    english_pronunciation: item.english,
    category: item.category || "5. Disasters & Epidemics – આપત્તિઓ અને રોગચાળો",
    difficulty: "Easy",
    example: undefined,
    sectionId: "section8",
    sectionName: "Section 8: 5. Disasters & Epidemics – આપત્તિઓ અને રોગચાળો",
  })
);

export const ALL_VOCABULARY_QUESTIONS: VocabQuestion[] = [
  ...section1Items,
  ...section2Items,
  ...section3Items,
  ...section4Items,
  ...section5Items,
  ...section6Items,
  ...section7Items,
  ...section8Items,
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
    id: "section6",
    index: 6,
    stepLabel: "Step 6",
    name: "Section 6: 3. Verbs – ક્રિયાપદો (V1, V2, V3)",
    shortName: "#6 Verbs",
    badge: "Verb Forms",
    count: section6Items.length,
    description: "Action verbs with V1 Base, V2 Past Simple & V3 Past Participle forms and Gujarati pronunciations.",
    icon: "⚡",
  },
  {
    id: "section7",
    index: 7,
    stepLabel: "Step 7",
    name: "Section 7: 4. Animals & Birds – પ્રાણીઓ અને પક્ષીઓ",
    shortName: "#7 Animals & Birds",
    badge: "Animals & Birds",
    count: section7Items.length,
    description: "Animals, birds, reptiles, insects, and wildlife vocabulary with Gujarati meanings & pronunciations.",
    icon: "🦁",
  },
  {
    id: "section8",
    index: 8,
    stepLabel: "Step 8",
    name: "Section 8: 5. Disasters & Epidemics – આપત્તિઓ અને રોગચાળો",
    shortName: "#8 Disasters",
    badge: "Disasters",
    count: section8Items.length,
    description: "Natural disasters, weather events, and epidemics terminology with Gujarati meanings.",
    icon: "🌪️",
  },
  {
    id: "all",
    index: 0,
    stepLabel: "All",
    name: "All Sections (Combined Master List)",
    shortName: "All Sections",
    badge: "Combined",
    count: ALL_VOCABULARY_QUESTIONS.length,
    description: "Practice all words across Section 1 to Section 8 combined.",
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
  if (sectionId === "section6") {
    return section6Items;
  }
  if (sectionId === "section7") {
    return section7Items;
  }
  if (sectionId === "section8") {
    return section8Items;
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


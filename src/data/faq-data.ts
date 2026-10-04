export interface FAQItem {
  id: string;
  category: "Learning Strategy" | "Vocabulary & Sentences" | "AI Tutor" | "General";
  question: string;
  answer: string;
  highlight?: string;
  relatedLink?: {
    url: string;
    label: string;
  };
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "gujarati-speakers-learn-english",
    category: "Learning Strategy",
    question: "How can Gujarati speakers learn English?",
    answer:
      "Native Gujarati speakers often struggle with English because the two languages follow different word orders: Gujarati uses Subject-Object-Verb (SOV, e.g., \"હું પુસ્તક વાંચું છું\"), whereas English uses Subject-Verb-Object (SVO, e.g., \"I read a book\"). The most effective way to learn is by practicing these structural shifts directly through contextual translations, active recall, and everyday conversational patterns rather than memorizing isolated grammar rules.",
    highlight: "Focus on SOV to SVO sentence pattern shifts and daily active practice.",
    relatedLink: {
      url: "/learn-english",
      label: "Read Beginner Roadmap: Master the SOV to SVO Shift",
    },
  },
  {
    id: "practice-english-vocabulary",
    category: "Vocabulary & Sentences",
    question: "How do I practice English vocabulary?",
    answer:
      "The best way to build vocabulary is active recall combined with spaced repetition. Instead of passively reading word lists, test yourself on words with Gujarati meanings, review sample usage in context, and revisit challenging words at regular intervals until they enter your long-term memory. English Learn Together organizes words by practical themes with instant recall quizzes.",
    highlight: "Spaced repetition and contextual examples maximize long-term retention.",
    relatedLink: {
      url: "/english-vocabulary-practice",
      label: "Explore Interactive English Vocabulary Practice Deck",
    },
  },
  {
    id: "improve-sentence-formation",
    category: "Vocabulary & Sentences",
    question: "How can I improve English sentence formation?",
    answer:
      "To improve sentence formation, practice constructing sentences step-by-step: Subject + Auxiliary/Helping Verb + Main Verb + Object. Pay close attention to verb tenses and prepositions (in, at, on), which often differ from Gujarati usage. Practicing daily sentence translation with immediate feedback trains your brain to think in English order without translating word-for-word.",
    highlight: "Build sentences in chunks to stop translating word-for-word.",
    relatedLink: {
      url: "/english-sentence-practice",
      label: "Practice SVO English Sentence Construction Puzzles",
    },
  },
  {
    id: "gujarati-to-english-translation",
    category: "Vocabulary & Sentences",
    question: "Can I practice Gujarati-to-English translation?",
    answer:
      "Yes! Gujarati-to-English sentence translation is a core practice module in English Learn Together. You receive everyday Gujarati sentences and translate them into English. The app analyzes your syntax, tense, and vocabulary choices in real time, highlighting errors and showing natural conversational phrasing.",
    highlight: "Real-time checks for grammatical accuracy and natural phrasing.",
    relatedLink: {
      url: "/gujarati-to-english",
      label: "Master 12 High-Frequency Gujarati to English Translation Examples",
    },
  },
  {
    id: "ai-english-tutor-workings",
    category: "AI Tutor",
    question: "How does the AI English tutor work?",
    answer:
      "The AI tutor acts as an on-demand personal language coach. When you submit a sentence or translation, it checks beyond basic keyword matching—evaluating grammatical correctness, verb tense agreement, and natural phrasing. If you make a mistake, it explains the underlying rule and shows you alternative ways native speakers express the same thought.",
    highlight: "Explains grammatical reasons behind mistakes with natural alternatives.",
    relatedLink: {
      url: "/english-reading-practice",
      label: "Practice Graded Reading Stories with AI Comprehension Checks",
    },
  },
  {
    id: "is-app-free",
    category: "General",
    question: "Is English Learn Together free?",
    answer:
      "Yes, English Learn Together is 100% free to use. All interactive practice modules—including Gujarati-to-English translation exercises, vocabulary builders, reading comprehension, and daily streak tracking—are completely free for all learners.",
    highlight: "Free access to all core learning and practice modules.",
    relatedLink: {
      url: "/learn-english",
      label: "Explore All Practice Modules in the English Learning Hub",
    },
  },
];

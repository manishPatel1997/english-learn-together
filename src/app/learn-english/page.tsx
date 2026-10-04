import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Sparkles, Languages, Brain, HelpCircle, ArrowRight, Milestone, CheckCircle2 } from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "Learn English",
  description:
    "Start learning English with our free, interactive Gujarati-to-English practice platform. Discover vocabulary, sentence translation, reading exercises, and AI feedback.",
  alternates: {
    canonical: "/learn-english",
  },
  openGraph: {
    title: "Learn English | English Learn Together",
    description:
      "Start learning English with our free, interactive Gujarati-to-English practice platform. Discover vocabulary, sentence translation, reading exercises, and AI feedback.",
    url: `${SITE_URL}/learn-english`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn English | English Learn Together",
    description:
      "Start learning English with our free, interactive Gujarati-to-English practice platform. Discover vocabulary, sentence translation, reading exercises, and AI feedback.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LearnEnglishPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb / Top Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase">
          <Link href="/" className="hover:underline text-neutral-600 dark:text-neutral-400">Home</Link>
          <span className="text-neutral-400">/</span>
          <span className="bg-[#FFE600] text-black px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">Learning Hub</span>
        </nav>

        {/* Hero Section */}
        <header className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 bg-[#FFE600] border-2 border-black px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] mb-4">
            <Milestone className="h-4 w-4 stroke-[2.5]" />
            <span>Gujarati to English Learning Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            Learn English <br />
            <span className="bg-[#00F0FF] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">
              with Practical Daily Practice
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            A step-by-step roadmap built specifically for native Gujarati speakers. Master English by understanding the structural differences between Gujarati and English, practicing active vocabulary recall, and constructing natural sentences with instant AI feedback.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/english-vocabulary-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <span>Step 1: Vocabulary Practice Deck</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
            <Link
              href="/english-sentence-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Step 2: Sentence Construction</span>
            </Link>
            <Link
              href="/gujarati-to-english"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <Languages className="h-4 w-4" />
              <span>Step 3: Translation Guide</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-sm uppercase shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all"
            >
              <span>Create Free Account &amp; Start Section 1</span>
            </Link>
          </div>
        </header>

        {/* How to Start Learning English: The Fundamental Shift */}
        <section aria-labelledby="how-to-start-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#FF6B00] text-white border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Core Foundation
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">The #1 Rule For Gujarati Learners</span>
          </div>
          <h2 id="how-to-start-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-3">
            How to Start Learning English: SOV to SVO Shift
          </h2>
          <p className="text-sm sm:text-base font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
            Gujarati and English arrange words in completely different orders. If you translate word-by-word in your head, your English will sound unnatural. To speak and write fluent English, you must master the structural shift from Gujarati <strong className="text-black dark:text-white bg-[#FFE600] px-1">SOV</strong> (Subject-Object-Verb) to English <strong className="text-black dark:text-white bg-[#00F0FF] px-1">SVO</strong> (Subject-Verb-Object).
          </p>

          <div className="overflow-x-auto border-2 border-black dark:border-white rounded-[4px]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF7F2] dark:bg-zinc-800 border-b-2 border-black dark:border-white">
                  <th className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Feature</th>
                  <th className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Gujarati Pattern (SOV)</th>
                  <th className="p-3 font-black uppercase">English Pattern (SVO)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-white font-medium">
                <tr className="bg-white dark:bg-zinc-900">
                  <td className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Sentence Rule</td>
                  <td className="p-3 border-r-2 border-black dark:border-white">
                    <span className="font-bold">Subject</span> + <span className="font-bold text-[#FF6B00]">Object</span> + <span className="font-bold text-[#22C55E]">Verb</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold">Subject</span> + <span className="font-bold text-[#22C55E]">Verb</span> + <span className="font-bold text-[#FF6B00]">Object</span>
                  </td>
                </tr>
                <tr className="bg-[#FAF7F2]/50 dark:bg-zinc-800/50">
                  <td className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Simple Example</td>
                  <td className="p-3 border-r-2 border-black dark:border-white font-gujarati">
                    હું <span className="text-[#FF6B00] font-bold">પુસ્તક</span> <span className="text-[#22C55E] font-bold">વાંચું છું</span>.
                  </td>
                  <td className="p-3">
                    I <span className="text-[#22C55E] font-bold">read</span> <span className="text-[#FF6B00] font-bold">a book</span>.
                  </td>
                </tr>
                <tr className="bg-white dark:bg-zinc-900">
                  <td className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Daily Habit</td>
                  <td className="p-3 border-r-2 border-black dark:border-white font-gujarati">
                    રાહુલ <span className="text-[#FF6B00] font-bold">ચા</span> <span className="text-[#22C55E] font-bold">પીવે છે</span>.
                  </td>
                  <td className="p-3">
                    Rahul <span className="text-[#22C55E] font-bold">drinks</span> <span className="text-[#FF6B00] font-bold">tea</span>.
                  </td>
                </tr>
                <tr className="bg-[#FAF7F2]/50 dark:bg-zinc-800/50">
                  <td className="p-3 font-black uppercase border-r-2 border-black dark:border-white">Word Order Trap</td>
                  <td className="p-3 border-r-2 border-black dark:border-white text-rose-600 font-bold">
                    Literal: &ldquo;I book read&rdquo; ❌
                  </td>
                  <td className="p-3 text-emerald-600 font-bold">
                    Natural SVO: &ldquo;I read a book&rdquo; ✅
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4-Stage Learning Roadmap */}
        <section aria-labelledby="roadmap-steps-heading" className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#FFE600] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Curriculum Roadmap
            </span>
            <h2 id="roadmap-steps-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground">
              4 Steps from Beginner to Fluent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 rounded-[6px] shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-[#FFE600] border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]">
                    Step 1 • Foundation
                  </span>
                  <Brain className="h-6 w-6 stroke-[2.5] text-neutral-800 dark:text-neutral-200" />
                </div>
                <h3 className="text-xl font-black uppercase text-foreground">
                  Step 1: Build Everyday Vocabulary
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Start with high-frequency nouns, action verbs, and adjectives. Practice them with exact Gujarati script definitions and phonetic pronunciations so you build accurate recall from day one.
                </p>
                <ul className="text-xs font-bold text-neutral-800 dark:text-neutral-200 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>780+ curated words across 5 textbook sections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Spaced repetition to guarantee long-term retention</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/english-vocabulary-practice"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
                >
                  <span>Start Step 1: Vocabulary Practice Deck</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 rounded-[6px] shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-[#00F0FF] border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]">
                    Step 2 • Structure
                  </span>
                  <Sparkles className="h-6 w-6 stroke-[2.5] text-neutral-800 dark:text-neutral-200" />
                </div>
                <h3 className="text-xl font-black uppercase text-foreground">
                  Step 2: Learn Basic Sentence Patterns
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Learn to connect subjects, helping verbs (am, is, are, was, were), and objects into complete sentences. Practice questioning words (Who, What, Where, When, How) step-by-step.
                </p>
                <ul className="text-xs font-bold text-neutral-800 dark:text-neutral-200 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Subject-Verb-Agreement training for Gujarati natives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Real-time AI syntax error diagnosis</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/english-sentence-practice"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] border-2 border-black bg-[#00F0FF] text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] transition-all"
                >
                  <span>Advance to Step 2: Sentence Construction</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 rounded-[6px] shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-[#22C55E] border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]">
                    Step 3 • Immersion
                  </span>
                  <BookOpen className="h-6 w-6 stroke-[2.5] text-neutral-800 dark:text-neutral-200" />
                </div>
                <h3 className="text-xl font-black uppercase text-foreground">
                  Step 3: Practice Reading
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Engage with graded English reading passages tailored for non-native speakers. Test comprehension with instant quizzes and expand your contextual word understanding.
                </p>
                <ul className="text-xs font-bold text-neutral-800 dark:text-neutral-200 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Contextual vocabulary tooltips with Gujarati hints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Comprehension questions to verify understanding</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/english-reading-practice"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] border-2 border-black bg-[#22C55E] text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] transition-all"
                >
                  <span>Advance to Step 3: Reading Practice</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 rounded-[6px] shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-[#FF6B00] border-2 border-black px-2 py-0.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#000]">
                    Step 4 • Synthesis
                  </span>
                  <Languages className="h-6 w-6 stroke-[2.5] text-neutral-800 dark:text-neutral-200" />
                </div>
                <h3 className="text-xl font-black uppercase text-foreground">
                  Step 4: Translate Gujarati Ideas into Natural English
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Put your vocabulary and sentence skills together. Convert real-life Gujarati prompts into natural English, checking for tense accuracy and natural phrasing.
                </p>
                <ul className="text-xs font-bold text-neutral-800 dark:text-neutral-200 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Everyday office, family, and social dialogs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                    <span>Avoid literal translation pitfalls with smart hints</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/gujarati-to-english"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] border-2 border-black bg-[#FF6B00] text-white font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all"
                >
                  <span>Advance to Step 4: Translation Guide</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Learning Architecture Section */}
        <section aria-labelledby="learning-flow-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#00F0FF] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Curriculum Flow
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">How The Modules Connect</span>
          </div>
          <h2 id="learning-flow-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-3">
            Recommended Practice Sequence
          </h2>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-6">
            For maximum retention, follow this structured learning pathway. Build foundational words, practice chunking sentences, reinforce with reading, synthesize with full translations, and check common questions in the FAQ.
          </p>

          <div className="space-y-4">
            {/* Top Level Hub */}
            <div className="p-3 bg-[#FFE600] border-2 border-black rounded-[4px] text-center shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-black">Hub: Learn English Methodology</span>
              <p className="text-[11px] font-bold text-neutral-800">You Are Here • Understand SOV to SVO Shift</p>
            </div>

            <div className="flex justify-center text-neutral-400 font-black">↓</div>

            {/* Middle 3 Practice Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                href="/english-vocabulary-practice"
                className="p-3.5 border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 rounded-[4px] hover:bg-[#FFE600] hover:text-black transition-all shadow-[2.5px_2.5px_0px_#000] group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase">1. Vocabulary</span>
                  <Brain className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-black">
                  780+ words with Gujarati phonetics and active recall.
                </p>
              </Link>

              <Link
                href="/english-sentence-practice"
                className="p-3.5 border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 rounded-[4px] hover:bg-[#00F0FF] hover:text-black transition-all shadow-[2.5px_2.5px_0px_#000] group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase">2. Sentences</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-black">
                  SVO construction frames and drag-and-drop builder.
                </p>
              </Link>

              <Link
                href="/english-reading-practice"
                className="p-3.5 border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 rounded-[4px] hover:bg-[#22C55E] hover:text-black transition-all shadow-[2.5px_2.5px_0px_#000] group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase">3. Reading</span>
                  <BookOpen className="h-4 w-4" />
                </div>
                <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-black">
                  Graded stories with bilingual comprehension checks.
                </p>
              </Link>
            </div>

            <div className="flex justify-center text-neutral-400 font-black">↓</div>

            {/* Synthesis Step */}
            <Link
              href="/gujarati-to-english"
              className="block p-4 border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 rounded-[4px] hover:bg-[#FF6B00] hover:text-white transition-all shadow-[3px_3px_0px_#000] group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black uppercase">4. Full Gujarati-to-English Translation Synthesis</span>
                <Languages className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-white">
                Apply your vocabulary, sentence structure, and reading fluency to live translation prompts with AI feedback.
              </p>
            </Link>

            <div className="flex justify-center text-neutral-400 font-black">↓</div>

            {/* FAQ Endpoint */}
            <Link
              href="/faq"
              className="block p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[4px] hover:bg-[#FFE600] hover:text-black transition-all shadow-[2.5px_2.5px_0px_#000] group text-center"
            >
              <span className="text-xs font-black uppercase">5. Knowledge Base &amp; FAQ →</span>
              <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Have questions about grammar rules, retention methods, or AI tutor grading? Find detailed answers here.
              </p>
            </Link>
          </div>
        </section>

        {/* How to Practice Every Day: Common Traps for Gujarati Speakers */}
        <section aria-labelledby="how-to-practice-heading" className="border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Daily Habit
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">Consistency &amp; Accuracy</span>
          </div>
          <h2 id="how-to-practice-heading" className="text-2xl font-black uppercase tracking-tight mb-2">
            How to Practice Every Day
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-900 mb-4 max-w-3xl leading-relaxed">
            Fluency comes from short, consistent daily practice—15 to 20 minutes every day is far more effective than 2 hours once a week. Protect your practice by avoiding these three common traps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">1. Omitting Helping Verbs</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">
                In Gujarati, the verb comes at the end. Learners often say:
              </p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;He going to office&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;He is going to the office&rdquo; ✅</p>
            </div>

            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">2. In vs. At Preposition Mixup</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">
                Gujarati uses the suffix &ldquo;માં&rdquo; for both &lsquo;in&rsquo; and &lsquo;at&rsquo;:
              </p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;I am in home&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;I am at home&rdquo; ✅</p>
            </div>

            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">3. Present Continuous For Ownership</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">
                Saying &ldquo;I am having&rdquo; for permanent possession:
              </p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;I am having two cars&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;I have two cars&rdquo; ✅</p>
            </div>
          </div>
        </section>

        {/* Choose Your Practice: Practice Modules */}
        <section aria-labelledby="choose-practice-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#00F0FF] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Interactive Modules
            </span>
            <h2 id="choose-practice-heading" className="text-xl sm:text-2xl font-black uppercase text-foreground">
              Choose Your Practice
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/english-vocabulary-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all group"
            >
              <Brain className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Vocabulary Practice Deck</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-white">
                Core daily words, Gujarati script definitions, and spaced recall.
              </p>
            </Link>

            <Link
              href="/english-sentence-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
            >
              <Sparkles className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Sentence Builder Practice</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Subject-verb order exercises and grammar correction drills.
              </p>
            </Link>

            <Link
              href="/english-reading-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#22C55E] hover:text-black transition-all group"
            >
              <BookOpen className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Reading Comprehension</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Short comprehension stories with bilingual questions and summaries.
              </p>
            </Link>

            <Link
              href="/gujarati-to-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
            >
              <Languages className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Gujarati to English Guide</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Bilingual translation practice with grammar breakdowns and 12 examples.
              </p>
            </Link>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <div className="rounded-[6px] border-[3px] border-black dark:border-white bg-[#00F0FF] text-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Ready to Practice With Real Exercises?
            </h3>
            <p className="text-xs sm:text-sm font-bold max-w-xl">
              Create your free account to track your daily practice streak, earn XP, unlock progressive textbook sections, and get instant Gemini AI feedback.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F2]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Read Learning FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Create Free Account &amp; Start Section 1</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "English Vocabulary Practice",
  description:
    "Practice English vocabulary with interactive exercises. Learn essential words with Gujarati meanings, example sentences, and spaced repetition recall.",
  alternates: {
    canonical: "/english-vocabulary-practice",
  },
  openGraph: {
    title: "English Vocabulary Practice | English Learn Together",
    description:
      "Practice English vocabulary with interactive exercises. Learn essential words with Gujarati meanings, example sentences, and spaced repetition recall.",
    url: `${SITE_URL}/english-vocabulary-practice`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Vocabulary Practice | English Learn Together",
    description:
      "Practice English vocabulary with interactive exercises. Learn essential words with Gujarati meanings, example sentences, and spaced repetition recall.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Link from "next/link";
import { Brain, HelpCircle, ArrowRight, Sparkles, BookOpen, Languages, CheckCircle2, Volume2, Layers, BookmarkCheck, Search } from "lucide-react";

export default function VocabularyPracticePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase">
          <Link href="/" className="hover:underline text-neutral-600 dark:text-neutral-400">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/learn-english" className="hover:underline text-neutral-600 dark:text-neutral-400">Learn English</Link>
          <span className="text-neutral-400">/</span>
          <span className="bg-[#FF6B00] text-white px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">Vocabulary</span>
        </nav>

        {/* Hero Header */}
        <header className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 bg-[#FF6B00] border-2 border-black px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0px_#000000] mb-4">
            <Brain className="h-4 w-4 stroke-[2.5]" />
            <span>Spaced Repetition Vocabulary Builder</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            English Vocabulary <br />
            <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">
              Practice &amp; Recall
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            Expand your working vocabulary with curated English words, exact Gujarati script meanings, and phonetic pronunciation keys. Explore our curated preview of essential verbs, professional terms, and everyday adjectives below.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#vocab-deck"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <span>Explore 20 Preview Words</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </a>
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
              <span>Step 4: Gujarati to English</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-sm uppercase shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all"
            >
              <span>Sign Up Free to Test 780+ Words in App</span>
            </Link>
          </div>
        </header>

        {/* Why Vocabulary With Gujarati Meanings Matters */}
        <section aria-labelledby="why-vocab-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#00F0FF] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Retention Strategy
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Active Recall vs Passive Reading</span>
          </div>
          <h2 id="why-vocab-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-3">
            How to Build a Long-Term Vocabulary
          </h2>
          <p className="text-sm sm:text-base font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
            Memorizing alphabetical word lists doesn&apos;t work. Our practice methodology pairs each English word with its contextual Gujarati definition, Gujarati phonetic guide, and a complete usage example. Once memorized, reinforce these words immediately in our <Link href="/english-sentence-practice" className="underline decoration-2 decoration-[#00F0FF] hover:bg-[#00F0FF] hover:text-black px-1 font-black">English Sentence Practice</Link> exercises or inside <Link href="/english-reading-practice" className="underline decoration-2 decoration-[#22C55E] hover:bg-[#22C55E] hover:text-black px-1 font-black">Graded Reading Passages</Link>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#FF6B00] block">1. Gujarati Phonetics</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Learn how words actually sound in everyday speech to eliminate pronunciation hesitation.
              </p>
            </div>
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#00F0FF] block">2. In-Context Sentences</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Never learn a word in isolation. Understand whether it is a noun, verb, or adjective in real sentences.
              </p>
            </div>
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#22C55E] block">3. 5-Section Progression</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Score 80%+ on Section 1 to unlock Section 2, ensuring mastery before advancing.
              </p>
            </div>
          </div>
        </section>

        {/* 20 Curated Vocabulary Preview Cards */}
        <section id="vocab-deck" aria-labelledby="vocab-deck-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-block bg-[#FFE600] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                Curated Vocabulary Bank
              </span>
              <h2 id="vocab-deck-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mt-1">
                20 High-Utility Words with Gujarati Meanings
              </h2>
            </div>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Sampled from 780+ platform words
            </span>
          </div>

          {/* Group 1: Daily Life */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#FFE600] text-black border border-black font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
                Category 1 • Daily Life
              </span>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Everyday habits, routines, and personal communication</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Word 1 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Habit</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">ટેવ / આદત</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: હેબિટ (/ˈhæb.ɪt/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Reading daily English is a wonderful habit.&rdquo;
                </p>
              </div>

              {/* Word 2 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Decide</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">નિર્ણય લેવો / નક્કી કરવું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ડિસાઈડ (/dɪˈsaɪd/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;We must decide our meeting time today.&rdquo;
                </p>
              </div>

              {/* Word 3 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Routine</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">દિનચર્યા / રોજિંદો ક્રમ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: રૂટીન (/ruːˈtiːn/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;A healthy morning routine gives you energy.&rdquo;
                </p>
              </div>

              {/* Word 4 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Improve</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">સુધારવું / પ્રગતિ કરવી</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ઇમ્પ્રૂવ (/ɪmˈpruːv/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Daily practice improves your English fluency.&rdquo;
                </p>
              </div>

              {/* Word 5 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Encourage</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">પ્રોત્સાહન આપવું / હિંમત વધારવી</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: એન્કરેજ (/ɪnˈkʌr.ɪdʒ/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Teachers encourage students to speak freely.&rdquo;
                </p>
              </div>

              {/* Word 6 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Family</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">પરિવાર / કુટુંબ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ફેમિલી (/ˈfæm.əl.i/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;My family eats dinner together every night.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Group 2: Food & Dining */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#22C55E] text-black border border-black font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
                Category 2 • Food &amp; Dining
              </span>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Cooking, dining, ingredients, and tastes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Word 7 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Delicious</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Adjective</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">સ્વાદિષ્ટ / મીઠું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ડિલિશસ (/dɪˈlɪʃ.əs/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Gujarati food is delicious and nutritious.&rdquo;
                </p>
              </div>

              {/* Word 8 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Prepare</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">તૈયાર કરવું / બનાવવું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: પ્રિપેર (/prɪˈpeər/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;She prepares a fresh breakfast every morning.&rdquo;
                </p>
              </div>

              {/* Word 9 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Healthy</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Adjective</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">તંદુરસ્ત / સ્વાસ્થ્યપ્રદ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: હેલ્થી (/ˈhel.θi/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Eating fresh fruits keeps your body healthy.&rdquo;
                </p>
              </div>

              {/* Word 10 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Vegetable</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">શાકભાજી</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: વેજિટેબલ (/ˈvedʒ.tə.bəl/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;We buy fresh vegetables from the local market.&rdquo;
                </p>
              </div>

              {/* Word 11 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Flavor</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">સ્વાદ / સુગંધ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ફ્લેવર (/ˈfleɪ.vər/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Ginger adds a distinct flavor to hot chai.&rdquo;
                </p>
              </div>

              {/* Word 12 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Breakfast</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#22C55E] block font-gujarati">સવારનો નાસ્તો</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: બ્રેકફાસ્ટ (/ˈbrek.fəst/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Never skip breakfast before going to study or work.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Group 3: Work & Career */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#00F0FF] text-black border border-black font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
                Category 3 • Work &amp; Career
              </span>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Words used in business, office, and job interviews</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Word 13 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Achieve</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">પ્રાપ્ત કરવું / સિદ્ધ કરવું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: અચીવ (/əˈtʃiːv/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;She worked hard to achieve her career goal.&rdquo;
                </p>
              </div>

              {/* Word 14 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Responsible</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Adjective</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">જવાબદાર / કર્તવ્યનિષ્ઠ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: રિસ્પોન્સિબલ (/rɪˈspɒn.sə.bəl/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;He is responsible for managing client accounts.&rdquo;
                </p>
              </div>

              {/* Word 15 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Colleague</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">સાથે કામ કરનાર / સાથી કર્મચારી</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: કોલીગ (/ˈkɒl.iːɡ/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;My colleague helped me finish the project on time.&rdquo;
                </p>
              </div>

              {/* Word 16 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Deadline</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">આખરી મુદત / સમયમર્યાદા</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ડેડલાઇન (/ˈded.laɪn/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;The project deadline is this Friday at 5 PM.&rdquo;
                </p>
              </div>

              {/* Word 17 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Explain</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">સમજાવવું / સ્પષ્ટ કરવું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: એક્સપ્લેન (/ɪkˈspleɪn/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;The manager explained the new workflow clearly.&rdquo;
                </p>
              </div>

              {/* Word 18 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Meeting</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#00F0FF] block font-gujarati">સભા / બેઠક</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: મીટિંગ (/ˈmiː.tɪŋ/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;We scheduled a meeting to discuss team progress.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Group 4: Travel & Directions */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[2px] bg-[#FF6B00] text-white border border-black font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
                Category 4 • Travel &amp; Directions
              </span>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Commuting, transport, journeys, and wayfinding</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Word 19 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Journey</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">મુસાફરી / સફર</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: જર્ની (/ˈdʒɜː.ni/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;The train journey to Ahmedabad was comfortable.&rdquo;
                </p>
              </div>

              {/* Word 20 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Destination</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">મંઝિલ / અંતિમ સ્થળ</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ડેસ્ટિનેશન (/ˌdes.tɪˈneɪ.ʃən/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;We reached our destination before sunset.&rdquo;
                </p>
              </div>

              {/* Word 21 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Arrival</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">આગમન / પહોંચવું</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: અરાઇવલ (/əˈraɪ.vəl/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;The flight arrival was delayed by thirty minutes.&rdquo;
                </p>
              </div>

              {/* Word 22 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Direction</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">દિશા / માર્ગદર્શન</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ડિરેક્શન (/daɪˈrek.ʃən/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Can you give me directions to the railway station?&rdquo;
                </p>
              </div>

              {/* Word 23 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Explore</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Verb</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">શોધખોળ કરવી / મુલાકાત લેવી</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: એક્સપ્લોર (/ɪkˈsplɔːr/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Tourists love to explore historical places in Gujarat.&rdquo;
                </p>
              </div>

              {/* Word 24 */}
              <div className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-foreground">Ticket</span>
                  <span className="text-[10px] font-black uppercase bg-[#FAF7F2] dark:bg-zinc-800 px-2 py-0.5 border border-black dark:border-white rounded-[2px]">Noun</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#FF6B00] block font-gujarati">ટિકિટ / પ્રવેશપત્ર</span>
                  <span className="text-[11px] text-neutral-500 italic">Pronunciation: ટિકિટ (/ˈtɪk.ɪt/)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium pt-1 border-t border-neutral-200 dark:border-zinc-800">
                  Example: &ldquo;Please show your bus ticket to the conductor.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Flashcard Preview */}
        <section aria-labelledby="flashcard-preview-heading" className="border-[3px] border-black dark:border-white bg-[#FFE600] p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] text-black">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Active Recall Test
            </span>
            <span className="text-xs font-black uppercase text-black font-bold">Interactive Flashcard Preview</span>
          </div>
          <h2 id="flashcard-preview-heading" className="text-2xl font-black uppercase tracking-tight mb-4">
            Test Your Gujarati to English Recall
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <details className="group bg-white rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer">
              <summary className="flex items-center justify-between font-black text-sm uppercase select-none list-none">
                <span>Word 1: &ldquo;અનુકૂળ&rdquo; (What is the English word?)</span>
                <span className="px-2 py-0.5 text-xs bg-[#00F0FF] border border-black rounded-[2px] group-open:bg-black group-open:text-white transition-colors">
                  Reveal
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-black space-y-1 text-xs sm:text-sm font-medium">
                <p className="font-black text-[#22C55E]">English: Convenient (/kənˈviː.ni.ənt/)</p>
                <p className="text-neutral-700">Pronunciation in Gujarati: કન્વીનિયન્ટ</p>
                <p className="text-neutral-700">Usage: &ldquo;Online practice is convenient for working professionals.&rdquo;</p>
              </div>
            </details>

            <details className="group bg-white rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer">
              <summary className="flex items-center justify-between font-black text-sm uppercase select-none list-none">
                <span>Word 2: &ldquo;ઉકેલ&rdquo; (What is the English word?)</span>
                <span className="px-2 py-0.5 text-xs bg-[#00F0FF] border border-black rounded-[2px] group-open:bg-black group-open:text-white transition-colors">
                  Reveal
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-black space-y-1 text-xs sm:text-sm font-medium">
                <p className="font-black text-[#22C55E]">English: Solution (/səˈluː.ʃən/)</p>
                <p className="text-neutral-700">Pronunciation in Gujarati: સોલ્યુશન</p>
                <p className="text-neutral-700">Usage: &ldquo;Every problem has a logical solution.&rdquo;</p>
              </div>
            </details>
          </div>
        </section>

        {/* Next Learning Step: Funnel to Gujarati-to-English */}
        <section aria-labelledby="vocab-to-translation-heading" className="border-[3px] border-black dark:border-white bg-[#00F0FF] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Logical Next Step
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">Vocabulary → Translation Synthesis</span>
          </div>
          <h2 id="vocab-to-translation-heading" className="text-2xl font-black uppercase tracking-tight mb-2">
            Apply Your Words to Full Gujarati-to-English Translation
          </h2>
          <p className="text-xs sm:text-sm font-bold max-w-3xl leading-relaxed mb-4">
            Knowing vocabulary in isolation is step one. To achieve fluency, you must use these words inside full sentences that follow English SVO word order. Advance to our comprehensive translation guide to see how these vocabulary words fit into natural bilingual dialogs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gujarati-to-english"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-neutral-800 transition-all"
            >
              <Languages className="h-4 w-4" />
              <span>Practice Gujarati to English Translation</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
            <Link
              href="/english-sentence-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Build Sentences with SVO Builder</span>
            </Link>
          </div>
        </section>

        {/* Practice Hub Cross-Links */}
        <section aria-labelledby="vocab-next-steps-heading" className="space-y-4">
          <h2 id="vocab-next-steps-heading" className="text-xl font-black uppercase text-foreground">
            Apply Your Words Across the Practice Curriculum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/english-sentence-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
            >
              <Sparkles className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Sentence Builder Practice</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Arrange these vocabulary words into grammatically correct SVO sentences.
              </p>
            </Link>

            <Link
              href="/gujarati-to-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
            >
              <Languages className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Gujarati to English Guide</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Practice translating Gujarati expressions into natural English phrasing.
              </p>
            </Link>

            <Link
              href="/english-reading-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#22C55E] hover:text-black transition-all group"
            >
              <BookOpen className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Reading Comprehension</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Read beginner stories and discover these words in natural narrative context.
              </p>
            </Link>

            <Link
              href="/learn-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
            >
              <Brain className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Complete Beginner Roadmap</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Review the 4-step learning plan and understand the SOV to SVO shift.
              </p>
            </Link>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <div className="rounded-[6px] border-[3px] border-black dark:border-white bg-[#FF6B00] text-white p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Ready to Practice All 780+ Words?
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/90 max-w-xl">
              Sign up for free to access Section 1 quizzes, track your daily learning streak, earn mastery badges, and receive AI pronunciation assistance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F2]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Read Vocabulary FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Create Free Account &amp; Start Section 1 Deck</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

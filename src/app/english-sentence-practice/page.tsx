import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "English Sentence Practice",
  description:
    "Master English sentence construction with interactive exercises. Improve grammar, word order, and conversational fluency with free tools.",
  alternates: {
    canonical: "/english-sentence-practice",
  },
  openGraph: {
    title: "English Sentence Practice | English Learn Together",
    description:
      "Master English sentence construction with interactive exercises. Improve grammar, word order, and conversational fluency with free tools.",
    url: `${SITE_URL}/english-sentence-practice`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Sentence Practice | English Learn Together",
    description:
      "Master English sentence construction with interactive exercises. Improve grammar, word order, and conversational fluency with free tools.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Link from "next/link";
import { Sparkles, HelpCircle, ArrowRight, Brain, BookOpen, Languages, CheckCircle2, AlertTriangle, Layers, Shuffle, MessageSquare } from "lucide-react";

export default function SentencePracticePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase">
          <Link href="/" className="hover:underline text-neutral-600 dark:text-neutral-400">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/learn-english" className="hover:underline text-neutral-600 dark:text-neutral-400">Learn English</Link>
          <span className="text-neutral-400">/</span>
          <span className="bg-[#00F0FF] text-black px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">Sentences</span>
        </nav>

        {/* Hero Header */}
        <header className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 bg-[#00F0FF] border-2 border-black px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] mb-4">
            <Sparkles className="h-4 w-4 stroke-[2.5]" />
            <span>Interactive Sentence Builder</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            English Sentence <br />
            <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">
              Construction &amp; Practice
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            Stop translating word-by-word in your head. Learn to build natural English sentences in functional chunks: <strong className="text-foreground">Subject + Auxiliary Verb + Main Verb + Object</strong>. Master essential frames and test your skills with 6 interactive sentence puzzles below.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#sentence-exercises"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <span>Try 6 Sentence Exercises</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </a>
            <Link
              href="/english-vocabulary-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <Brain className="h-4 w-4" />
              <span>Step 1: Vocabulary Deck</span>
            </Link>
            <Link
              href="/gujarati-to-english"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all"
            >
              <Languages className="h-4 w-4" />
              <span>Step 4: Translation Guide</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-sm uppercase shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all"
            >
              <span>Practice Drag-and-Drop Sentence Builder in App</span>
            </Link>
          </div>
        </header>

        {/* 4 Core Sentence Frames */}
        <section aria-labelledby="sentence-frames-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#FF6B00] text-white border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Sentence Patterns
            </span>
            <h2 id="sentence-frames-heading" className="text-2xl font-black uppercase text-foreground">
              4 Sentence Frames You Can Use Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frame 1 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#FFE600] border border-black text-[11px] font-black uppercase text-black">
                  Frame 1 • State &amp; Identity
                </span>
                <span className="text-xs font-bold text-neutral-500">Present Simple Be</span>
              </div>
              <p className="text-xs font-bold font-mono bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[3px] border border-black dark:border-white">
                Subject + [is / am / are] + Adjective / Noun
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400 font-gujarati">તે ખૂબ મહેનતુ છે.</p>
                <p className="font-black text-base text-foreground">&ldquo;He is very hardworking.&rdquo;</p>
                <p className="text-[11px] text-neutral-500">Tip: Gujarati places &lsquo;છે&rsquo; at the end; in English &lsquo;is&rsquo; comes right after &lsquo;He&rsquo;.</p>
              </div>
            </div>

            {/* Frame 2 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#00F0FF] border border-black text-[11px] font-black uppercase text-black">
                  Frame 2 • Habitual Actions
                </span>
                <span className="text-xs font-bold text-neutral-500">Daily Routines</span>
              </div>
              <p className="text-xs font-bold font-mono bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[3px] border border-black dark:border-white">
                Subject + Verb(s) + Object + Time Phrase
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400 font-gujarati">અમે દરરોજ સવારે કસરત કરીએ છીએ.</p>
                <p className="font-black text-base text-foreground">&ldquo;We exercise every morning.&rdquo;</p>
                <p className="text-[11px] text-neutral-500">Tip: Notice the action verb comes before the time phrase &lsquo;every morning&rsquo;.</p>
              </div>
            </div>

            {/* Frame 3 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#FF6B00] border border-black text-[11px] font-black uppercase text-white">
                  Frame 3 • Question Construction
                </span>
                <span className="text-xs font-bold text-neutral-500">Wh- Inversion</span>
              </div>
              <p className="text-xs font-bold font-mono bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[3px] border border-black dark:border-white">
                [Wh-Word] + Helping Verb + Subject + Base Verb?
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400 font-gujarati">તમે ક્યાં રહો છો?</p>
                <p className="font-black text-base text-foreground">&ldquo;Where do you live?&rdquo;</p>
                <p className="text-[11px] text-neutral-500">Tip: Don&apos;t say &ldquo;Where you live?&rdquo; The auxiliary verb &lsquo;do&rsquo; is required.</p>
              </div>
            </div>

            {/* Frame 4 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[2px] bg-[#22C55E] border border-black text-[11px] font-black uppercase text-black">
                  Frame 4 • Past Events
                </span>
                <span className="text-xs font-bold text-neutral-500">Completed Actions</span>
              </div>
              <p className="text-xs font-bold font-mono bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[3px] border border-black dark:border-white">
                Subject + Verb(V2) + Object + Past Time
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400 font-gujarati">તેમણે ગયા અઠવાડિયે કાર ખરીદી.</p>
                <p className="font-black text-base text-foreground">&ldquo;They bought a car last week.&rdquo;</p>
                <p className="text-[11px] text-neutral-500">Tip: Use the V2 past form &lsquo;bought&rsquo; directly without adding &lsquo;was&rsquo;.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Interactive Sentence Construction Exercises */}
        <section id="sentence-exercises" aria-labelledby="exercises-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-block bg-[#FFE600] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                Interactive Exercises
              </span>
              <h2 id="exercises-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mt-1">
                6 Sentence Ordering Puzzles
              </h2>
            </div>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Click to reveal correct syntax order
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Puzzle 1 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase bg-[#FFE600] px-2 py-0.5 border border-black rounded-[2px] text-black">
                  Exercise 1 • Question
                </span>
                <span className="text-[10px] font-bold text-neutral-500 font-gujarati">મંદિરમાં કોણ હતું?</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Jumbled Words</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs font-bold">
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[the temple]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[Who]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[was]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[in]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[?]</span>
                </div>
              </div>
              <details className="group pt-2 border-t border-neutral-200 dark:border-zinc-800 cursor-pointer">
                <summary className="text-xs font-black uppercase text-foreground flex items-center justify-between list-none">
                  <span>Reveal Correct Sentence</span>
                  <span className="text-[11px] px-2 py-0.5 bg-[#00F0FF] border border-black rounded-[2px] text-black">Show Answer</span>
                </summary>
                <div className="mt-2 text-xs font-bold text-[#22C55E] space-y-1">
                  <p className="text-sm font-black text-foreground">&ldquo;Who was in the temple?&rdquo;</p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-normal">Syntax breakdown: Who (Question Word) + was (Past Helping Verb) + in (Preposition) + the temple (Location).</p>
                </div>
              </details>
            </div>

            {/* Puzzle 2 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase bg-[#00F0FF] px-2 py-0.5 border border-black rounded-[2px] text-black">
                  Exercise 2 • Habit
                </span>
                <span className="text-[10px] font-bold text-neutral-500 font-gujarati">તેણી દરરોજ અંગ્રેજી બોલે છે.</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Jumbled Words</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs font-bold">
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[speaks]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[She]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[every day]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[English]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[.]</span>
                </div>
              </div>
              <details className="group pt-2 border-t border-neutral-200 dark:border-zinc-800 cursor-pointer">
                <summary className="text-xs font-black uppercase text-foreground flex items-center justify-between list-none">
                  <span>Reveal Correct Sentence</span>
                  <span className="text-[11px] px-2 py-0.5 bg-[#00F0FF] border border-black rounded-[2px] text-black">Show Answer</span>
                </summary>
                <div className="mt-2 text-xs font-bold text-[#22C55E] space-y-1">
                  <p className="text-sm font-black text-foreground">&ldquo;She speaks English every day.&rdquo;</p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-normal">Syntax breakdown: She (Subject) + speaks (Verb+s) + English (Object) + every day (Frequency).</p>
                </div>
              </details>
            </div>

            {/* Puzzle 3 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase bg-[#FF6B00] px-2 py-0.5 border border-black rounded-[2px] text-white">
                  Exercise 3 • Wh- Question
                </span>
                <span className="text-[10px] font-bold text-neutral-500 font-gujarati">તમે ક્યાં રહો છો?</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Jumbled Words</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs font-bold">
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[live]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[Where]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[you]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[do]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[?]</span>
                </div>
              </div>
              <details className="group pt-2 border-t border-neutral-200 dark:border-zinc-800 cursor-pointer">
                <summary className="text-xs font-black uppercase text-foreground flex items-center justify-between list-none">
                  <span>Reveal Correct Sentence</span>
                  <span className="text-[11px] px-2 py-0.5 bg-[#00F0FF] border border-black rounded-[2px] text-black">Show Answer</span>
                </summary>
                <div className="mt-2 text-xs font-bold text-[#22C55E] space-y-1">
                  <p className="text-sm font-black text-foreground">&ldquo;Where do you live?&rdquo;</p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-normal">Syntax breakdown: Where (Question Word) + do (Auxiliary) + you (Subject) + live (Base Verb).</p>
                </div>
              </details>
            </div>

            {/* Puzzle 4 */}
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase bg-[#22C55E] px-2 py-0.5 border border-black rounded-[2px] text-black">
                  Exercise 4 • Past Event
                </span>
                <span className="text-[10px] font-bold text-neutral-500 font-gujarati">અમે ગઈકાલે ફિલ્મ જોઈ.</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-neutral-500 block">Jumbled Words</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs font-bold">
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[yesterday]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[We]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[watched]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[a movie]</span>
                  <span className="px-2 py-1 bg-[#FAF7F2] dark:bg-zinc-800 border border-black rounded-[2px]">[.]</span>
                </div>
              </div>
              <details className="group pt-2 border-t border-neutral-200 dark:border-zinc-800 cursor-pointer">
                <summary className="text-xs font-black uppercase text-foreground flex items-center justify-between list-none">
                  <span>Reveal Correct Sentence</span>
                  <span className="text-[11px] px-2 py-0.5 bg-[#00F0FF] border border-black rounded-[2px] text-black">Show Answer</span>
                </summary>
                <div className="mt-2 text-xs font-bold text-[#22C55E] space-y-1">
                  <p className="text-sm font-black text-foreground">&ldquo;We watched a movie yesterday.&rdquo;</p>
                  <p className="text-neutral-600 dark:text-neutral-400 font-normal">Syntax breakdown: We (Subject) + watched (V2 Past Verb) + a movie (Object) + yesterday (Time).</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 3 Common Syntax Traps */}
        <section aria-labelledby="syntax-traps-heading" className="border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Syntax Traps
            </span>
            <span className="text-xs font-black uppercase text-black font-bold">Avoid Common Structural Errors</span>
          </div>
          <h2 id="syntax-traps-heading" className="text-2xl font-black uppercase tracking-tight mb-4">
            3 Frequent Mistakes in Sentence Formation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">1. Double Past Tense</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">Never use a past verb after &lsquo;did&rsquo;:</p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;Did you went to market?&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;Did you go to market?&rdquo; ✅</p>
            </div>

            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">2. Negative &lsquo;Doesn&apos;t&rsquo; Trap</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">He/She takes &lsquo;doesn&apos;t&rsquo;, not &lsquo;don&apos;t&rsquo;:</p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;He don&apos;t know English.&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;He doesn&apos;t know English.&rdquo; ✅</p>
            </div>

            <div className="bg-white p-4 rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-rose-600 block">3. Missing Indefinite Articles</span>
              <p className="text-xs font-medium text-neutral-800 mt-1">Singular countable nouns require a/an:</p>
              <p className="text-xs font-bold text-rose-600 mt-1">&ldquo;I have brother and sister.&rdquo; ❌</p>
              <p className="text-xs font-bold text-emerald-700">&ldquo;I have a brother and a sister.&rdquo; ✅</p>
            </div>
          </div>
        </section>

        {/* Next Learning Step: Funnel to Gujarati-to-English */}
        <section aria-labelledby="sentence-to-translation-heading" className="border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Logical Next Step
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">Sentences → Translation Synthesis</span>
          </div>
          <h2 id="sentence-to-translation-heading" className="text-2xl font-black uppercase tracking-tight mb-2">
            Apply Sentence Patterns to Full Gujarati-to-English Translation
          </h2>
          <p className="text-xs sm:text-sm font-bold max-w-3xl leading-relaxed mb-4">
            You now understand how English shifts Gujarati SOV word order into SVO chunks. The next milestone is translating complex real-life Gujarati thoughts into natural English phrasing without hesitation.
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
              href="/english-reading-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#22C55E] transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>See Sentences in Reading Stories</span>
            </Link>
          </div>
        </section>

        {/* Practice Hub Cross-Links */}
        <section aria-labelledby="sentence-cross-links-heading" className="space-y-4">
          <h2 id="sentence-cross-links-heading" className="text-xl font-black uppercase text-foreground">
            Explore Related Practice Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/gujarati-to-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
            >
              <Languages className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Gujarati to English Guide</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Practice translating full sentences with grammar breakdowns and 12 examples.
              </p>
            </Link>

            <Link
              href="/english-reading-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#22C55E] hover:text-black transition-all group"
            >
              <BookOpen className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Reading Comprehension</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Read beginner stories and observe how sentence patterns connect.
              </p>
            </Link>

            <Link
              href="/english-vocabulary-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all group"
            >
              <Brain className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Vocabulary Practice Deck</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-white">
                Learn 780+ words with Gujarati meanings and phonetics to expand your sentences.
              </p>
            </Link>

            <Link
              href="/learn-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
            >
              <Sparkles className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Beginner Learning Roadmap</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Understand the core SOV-to-SVO grammar shift and common traps.
              </p>
            </Link>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <div className="rounded-[6px] border-[3px] border-black dark:border-white bg-[#00F0FF] text-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Ready to Practice Real Sentence Puzzles?
            </h3>
            <p className="text-xs sm:text-sm font-bold max-w-xl">
              Log into English Learn Together to try our drag-and-drop sentence builder with instant Gemini AI error explanations and streak tracking.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F2]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Read Sentence FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Create Free Account &amp; Build Sentences in App</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "English Reading Practice",
  description:
    "Improve your English reading comprehension with interactive passages, vocabulary context, and comprehension questions. Free practice for all levels.",
  alternates: {
    canonical: "/english-reading-practice",
  },
  openGraph: {
    title: "English Reading Practice | English Learn Together",
    description:
      "Improve your English reading comprehension with interactive passages, vocabulary context, and comprehension questions. Free practice for all levels.",
    url: `${SITE_URL}/english-reading-practice`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "English Reading Practice | English Learn Together",
    description:
      "Improve your English reading comprehension with interactive passages, vocabulary context, and comprehension questions. Free practice for all levels.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Link from "next/link";
import { BookOpen, HelpCircle, ArrowRight, Brain, Sparkles, Languages, CheckCircle2, Award, Clock, Lightbulb, Bookmark } from "lucide-react";

export default function EnglishReadingPracticePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase">
          <Link href="/" className="hover:underline text-neutral-600 dark:text-neutral-400">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/learn-english" className="hover:underline text-neutral-600 dark:text-neutral-400">Learn English</Link>
          <span className="text-neutral-400">/</span>
          <span className="bg-[#22C55E] text-black px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">Reading</span>
        </nav>

        {/* Hero Header */}
        <header className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 bg-[#22C55E] border-2 border-black px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] mb-4">
            <BookOpen className="h-4 w-4 stroke-[2.5]" />
            <span>Graded Bilingual Reading Comprehension</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            English Reading <br />
            <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">
              Passages &amp; Quizzes
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            Read authentic, beginner-friendly English passages designed specifically for Gujarati native learners. Build vocabulary in context, verify comprehension with interactive questions, and view toggleable Gujarati summaries below.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#passage-1"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <span>Read Passage 1 (Beginner)</span>
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
              <span>Sign Up Free to Access 50+ Interactive Stories</span>
            </Link>
          </div>
        </header>

        {/* 3 Active Reading Strategies */}
        <section aria-labelledby="reading-strategies-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#00F0FF] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Study Method
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Read Fluently Without A Dictionary</span>
          </div>
          <h2 id="reading-strategies-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-3">
            3 Secrets to Effective English Reading
          </h2>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-6">
            Reading in English can feel challenging if you stop at every unfamiliar term. Master these techniques alongside our <Link href="/english-vocabulary-practice" className="underline decoration-2 decoration-[#FF6B00] font-black">Vocabulary Practice Deck</Link> and <Link href="/english-sentence-practice" className="underline decoration-2 decoration-[#00F0FF] font-black">Sentence Construction Patterns</Link>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#22C55E] block">1. Skim for the Big Picture</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Read the whole paragraph once without pausing at unfamiliar words to understand the overarching theme.
              </p>
            </div>
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#FF6B00] block">2. Context Clues</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Deduce word meanings from the surrounding sentence rather than stopping to look up every single term.
              </p>
            </div>
            <div className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 space-y-1">
              <span className="text-xs font-black uppercase text-[#00F0FF] block">3. Read Out Loud</span>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Speaking the words aloud builds oral fluency, rhythm, and vocal confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Passage 1: A Busy Morning in Ahmedabad */}
        <article id="passage-1" aria-labelledby="passage-1-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
          <div className="bg-[#FFE600] text-black p-4 sm:p-5 border-b-2 border-black flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[2px] bg-black text-white font-black text-xs uppercase">
                Story 1 • Level A1
              </span>
              <h2 id="passage-1-heading" className="text-lg sm:text-xl font-black uppercase tracking-tight">
                A Busy Morning in Ahmedabad
              </h2>
            </div>
            <span className="text-xs font-bold text-black flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2 Min Read
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Story Text */}
            <div className="p-5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-sm sm:text-base font-medium leading-relaxed space-y-3">
              <p>
                Every morning at six o&apos;clock, Anand wakes up to the sound of temple bells in Ahmedabad. The city is calm, and the cool morning air feels <strong className="bg-[#FFE600] px-1 text-black font-black">pleasant</strong>. Anand prepares a hot cup of masala tea for his family and sits on the balcony with the morning newspaper.
              </p>
              <p>
                He reads the <strong className="bg-[#00F0FF] px-1 text-black font-black">headlines</strong> carefully in English to improve his vocabulary. By eight o&apos;clock, the quiet streets come alive with auto-rickshaws, vegetable vendors, and energetic students heading to school. Anand takes his bag, locks the front door, and catches the bus to his IT office with a <strong className="bg-[#22C55E] px-1 text-black font-black">confident</strong> smile.
              </p>
            </div>

            {/* Vocabulary Spotlight */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-neutral-500 block">Vocabulary Spotlight</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Pleasant</span>
                  <span className="font-gujarati text-[#FF6B00] font-bold">આનંદદાયક / સુખદ</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: પ્લેઝન્ટ</span>
                </div>
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Headlines</span>
                  <span className="font-gujarati text-[#00F0FF] font-bold">મુખ્ય સમાચાર</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: હેડલાઇન્સ</span>
                </div>
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Confident</span>
                  <span className="font-gujarati text-[#22C55E] font-bold">આત્મવિશ્વાસપૂર્ણ</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: કોન્ફિડન્ટ</span>
                </div>
              </div>
            </div>

            {/* Comprehension Quiz */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black uppercase text-foreground block">Comprehension Check</span>

              <details className="group bg-white dark:bg-zinc-800 rounded-[4px] border-2 border-black dark:border-white p-3 cursor-pointer">
                <summary className="flex items-center justify-between text-xs sm:text-sm font-black uppercase select-none list-none">
                  <span>Q1: At what time does Anand wake up every morning?</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#FFE600] text-black border border-black rounded-[2px]">Show Answer</span>
                </summary>
                <div className="mt-2 pt-2 border-t border-black dark:border-white text-xs font-bold text-[#22C55E]">
                  Answer: Six o&apos;clock (6:00 AM). Anand wakes up to the sound of temple bells at 6:00 AM.
                </div>
              </details>

              <details className="group bg-white dark:bg-zinc-800 rounded-[4px] border-2 border-black dark:border-white p-3 cursor-pointer">
                <summary className="flex items-center justify-between text-xs sm:text-sm font-black uppercase select-none list-none">
                  <span>Q2: Why does Anand read the headlines in English?</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#FFE600] text-black border border-black rounded-[2px]">Show Answer</span>
                </summary>
                <div className="mt-2 pt-2 border-t border-black dark:border-white text-xs font-bold text-[#22C55E]">
                  Answer: To improve his vocabulary. He reads the English headlines daily to build language skills.
                </div>
              </details>
            </div>

            {/* Gujarati Summary Toggle */}
            <details className="group bg-[#FAF7F2] dark:bg-zinc-950 rounded-[4px] border-2 border-black dark:border-white p-4 cursor-pointer">
              <summary className="flex items-center justify-between text-xs font-black uppercase select-none list-none">
                <span className="font-gujarati text-sm">ગુજરાતી સારાંશ (Gujarati Summary)</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#00F0FF] text-black border border-black rounded-[2px]">વાંચો (Read)</span>
              </summary>
              <div className="mt-3 pt-3 border-t border-black dark:border-white text-xs font-medium text-neutral-800 dark:text-neutral-200 font-gujarati leading-relaxed">
                દરરોજ સવારે છ વાગ્યે, આનંદ અમદાવાદમાં મંદિરના ઘંટના અવાજ સાથે જાગે છે. શહેર શાંત છે અને સવારની ઠંડી હવા સુખદ લાગે છે. આનંદ પરિવાર માટે મસાલા ચા બનાવે છે અને અખબાર વાંચવા બેસે છે. તે પોતાનું અંગ્રેજી શબ્દભંડોળ સુધારવા માટે હેડલાઇન્સ અંગ્રેજીમાં વાંચે છે. આઠ વાગ્યા સુધીમાં બજારો અને રસ્તાઓ વાહનોથી ધમધમી ઊઠે છે, અને આનંદ આત્મવિશ્વાસ સાથે તેની ઓફિસની બસ પકડે છે.
              </div>
            </details>
          </div>
        </article>

        {/* Passage 2: Priya's Learning Journey */}
        <article id="passage-2" aria-labelledby="passage-2-heading" className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
          <div className="bg-[#00F0FF] text-black p-4 sm:p-5 border-b-2 border-black flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[2px] bg-black text-white font-black text-xs uppercase">
                Story 2 • Level A2
              </span>
              <h2 id="passage-2-heading" className="text-lg sm:text-xl font-black uppercase tracking-tight">
                Learning Without Fear: Priya&apos;s Journey
              </h2>
            </div>
            <span className="text-xs font-bold text-black flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 3 Min Read
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Story Text */}
            <div className="p-5 rounded-[4px] border-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 text-sm sm:text-base font-medium leading-relaxed space-y-3">
              <p>
                Priya was a talented college student from Rajkot who always felt <strong className="bg-[#FFE600] px-1 text-black font-black">hesitant</strong> when speaking English in front of her classmates. Whenever the professor asked a question, her heart raced, and she worried about making grammar mistakes.
              </p>
              <p>
                One afternoon, her English <strong className="bg-[#FF6B00] px-1 text-white font-black">mentor</strong> gave her valuable advice: &ldquo;Mistakes are not failures; they are proof that you are practicing.&rdquo; Priya decided to practice fifteen minutes every day using short bilingual exercises. She stopped translating word-for-word from Gujarati and started thinking in simple English phrases. Within three months, Priya noticed a remarkable <strong className="bg-[#22C55E] px-1 text-black font-black">transformation</strong>. She began answering questions with confidence and even delivered a seminar presentation without fear.
              </p>
            </div>

            {/* Vocabulary Spotlight */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-neutral-500 block">Vocabulary Spotlight</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Hesitant</span>
                  <span className="font-gujarati text-[#FF6B00] font-bold">ખચકાટ અનુભવવું</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: હેઝિટન્ટ</span>
                </div>
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Mentor</span>
                  <span className="font-gujarati text-[#00F0FF] font-bold">માર્ગદર્શક / ગુરુ</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: મેન્ટર</span>
                </div>
                <div className="p-3 rounded-[4px] border border-black dark:border-white bg-white dark:bg-zinc-900 text-xs">
                  <span className="font-black text-foreground block">Transformation</span>
                  <span className="font-gujarati text-[#22C55E] font-bold">નોંધપાત્ર પરિવર્તન</span>
                  <span className="text-[11px] text-neutral-500 block italic">Pronunciation: ટ્રાન્સફોર્મેશન</span>
                </div>
              </div>
            </div>

            {/* Comprehension Quiz */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black uppercase text-foreground block">Comprehension Check</span>

              <details className="group bg-white dark:bg-zinc-800 rounded-[4px] border-2 border-black dark:border-white p-3 cursor-pointer">
                <summary className="flex items-center justify-between text-xs sm:text-sm font-black uppercase select-none list-none">
                  <span>Q1: What did Priya&apos;s mentor tell her about mistakes?</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#00F0FF] text-black border border-black rounded-[2px]">Show Answer</span>
                </summary>
                <div className="mt-2 pt-2 border-t border-black dark:border-white text-xs font-bold text-[#22C55E]">
                  Answer: Her mentor explained that mistakes are not failures; they are proof that you are practicing.
                </div>
              </details>

              <details className="group bg-white dark:bg-zinc-800 rounded-[4px] border-2 border-black dark:border-white p-3 cursor-pointer">
                <summary className="flex items-center justify-between text-xs sm:text-sm font-black uppercase select-none list-none">
                  <span>Q2: How much time did Priya commit to practicing each day?</span>
                  <span className="text-[10px] px-2 py-0.5 bg-[#00F0FF] text-black border border-black rounded-[2px]">Show Answer</span>
                </summary>
                <div className="mt-2 pt-2 border-t border-black dark:border-white text-xs font-bold text-[#22C55E]">
                  Answer: Fifteen (15) minutes every day using short bilingual exercises.
                </div>
              </details>
            </div>
          </div>
        </article>

        {/* Next Learning Step: Funnel to Gujarati-to-English */}
        <section aria-labelledby="reading-to-translation-heading" className="border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Logical Next Step
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">Reading → Translation Synthesis</span>
          </div>
          <h2 id="reading-to-translation-heading" className="text-2xl font-black uppercase tracking-tight mb-2">
            Put Reading Comprehension into Active Translation
          </h2>
          <p className="text-xs sm:text-sm font-bold max-w-3xl leading-relaxed mb-4">
            You&apos;ve seen how fluent English sentences flow in reading passages. Now practice generating those sentences actively from Gujarati thoughts. Test your skills with our curated translation exercises with instant Gemini AI error analysis.
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Construct SVO Sentences</span>
            </Link>
          </div>
        </section>

        {/* Practice Hub Cross-Links */}
        <section aria-labelledby="reading-cross-links-heading" className="space-y-4">
          <h2 id="reading-cross-links-heading" className="text-xl font-black uppercase text-foreground">
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
              href="/english-sentence-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
            >
              <Sparkles className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Sentence Builder Practice</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Construct sentences chunk-by-chunk with AI feedback.
              </p>
            </Link>

            <Link
              href="/english-vocabulary-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all group"
            >
              <Brain className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Vocabulary Practice Deck</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-white">
                Learn 780+ words with Gujarati meanings and phonetics.
              </p>
            </Link>

            <Link
              href="/learn-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#22C55E] hover:text-white transition-all group"
            >
              <BookOpen className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Beginner Learning Roadmap</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-white">
                Review the core 4-step framework and SOV vs SVO grammar differences.
              </p>
            </Link>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <div className="rounded-[6px] border-[3px] border-black dark:border-white bg-[#22C55E] text-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Ready to Read 50+ Interactive Stories?
            </h3>
            <p className="text-xs sm:text-sm font-bold max-w-xl">
              Log into English Learn Together to access audio narration, instant vocabulary tap-to-translate, comprehension streaks, and personalized AI tips.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F2]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Read Reading FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Create Free Account &amp; Read 50+ Stories</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

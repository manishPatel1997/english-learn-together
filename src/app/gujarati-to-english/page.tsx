import type { Metadata } from "next";
import Link from "next/link";
import {
  Languages,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "Gujarati to English Translation Practice",
  description:
    "Translate Gujarati sentences to English with instant feedback. Master English grammar, phrasing, and vocabulary tailored for native Gujarati speakers.",
  alternates: {
    canonical: "/gujarati-to-english",
  },
  openGraph: {
    title: "Gujarati to English Translation Practice | English Learn Together",
    description:
      "Translate Gujarati sentences to English with instant feedback. Master English grammar, phrasing, and vocabulary tailored for native Gujarati speakers.",
    url: `${SITE_URL}/gujarati-to-english`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gujarati to English Translation Practice | English Learn Together",
    description:
      "Translate Gujarati sentences to English with instant feedback. Master English grammar, phrasing, and vocabulary tailored for native Gujarati speakers.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function GujaratiToEnglishPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase">
          <Link href="/" className="hover:underline text-neutral-600 dark:text-neutral-400">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/learn-english" className="hover:underline text-neutral-600 dark:text-neutral-400">Learn English</Link>
          <span className="text-neutral-400">/</span>
          <span className="bg-[#00F0FF] text-black px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000]">Translation Guide</span>
        </nav>

        {/* Hero Section */}
        <header className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 bg-[#00F0FF] border-2 border-black px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] mb-4">
            <Languages className="h-4 w-4 stroke-[2.5]" />
            <span>Bilingual Translation Practice &amp; Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            Gujarati to English <br />
            <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">
              Translation
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            Master the art of converting everyday Gujarati expressions into natural, grammatically correct English. Explore high-frequency sentence pairs, syntax breakdowns, and practical rules designed specifically for Gujarati native speakers.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#examples-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-[#FFE600] text-black font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all"
            >
              <span>View 12 Translation Examples</span>
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
              href="/english-sentence-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Step 2: Sentence Construction</span>
            </Link>
            <Link
              href="/english-reading-practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-800 text-foreground font-black text-sm uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#22C55E] hover:text-black transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Step 3: Reading Stories</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-sm uppercase shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all"
            >
              <span>Sign Up Free to Test 780+ Translations in App</span>
            </Link>
          </div>
        </header>

        {/* 3 Core Rules for Gujarati to English Translation */}
        <section aria-labelledby="translation-rules-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-[#FF6B00] text-white border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
              Grammar Cheatsheet
            </span>
            <h2 id="translation-rules-heading" className="text-2xl font-black uppercase text-foreground">
              3 Core Rules You Must Follow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-[2px] bg-[#FFE600] border border-black text-[11px] font-black uppercase text-black">
                Rule 1 • Word Order
              </span>
              <h3 className="text-base font-black uppercase text-foreground">Move Verb Before Object</h3>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                In Gujarati, the verb is at the end (<span className="font-gujarati font-bold">હું ક્રિકેટ રમું છું</span>). In English, verbs immediately follow the subject (<strong className="text-foreground">I play cricket</strong>). Never place the object before the verb.
              </p>
            </div>

            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-[2px] bg-[#00F0FF] border border-black text-[11px] font-black uppercase text-black">
                Rule 2 • Prepositions
              </span>
              <h3 className="text-base font-black uppercase text-foreground">Postposition to Preposition</h3>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Gujarati places location markers after the noun: <span className="font-gujarati font-bold">ઓફિસમાં</span> (Office + in). English places them <em>before</em>: <strong className="text-foreground">in the office</strong>, <strong className="text-foreground">at home</strong>.
              </p>
            </div>

            <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 rounded-[6px] shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-[2px] bg-[#22C55E] border border-black text-[11px] font-black uppercase text-black">
                Rule 3 • Helping Verbs
              </span>
              <h3 className="text-base font-black uppercase text-foreground">Never Drop &lsquo;is&rsquo;, &lsquo;am&rsquo;, &lsquo;are&rsquo;</h3>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Gujarati sentences sometimes omit state verbs. In English, every sentence requires a finite verb: <span className="text-rose-600 font-bold">&ldquo;He clever&rdquo; ❌</span> → <span className="text-emerald-600 font-bold">&ldquo;He is clever&rdquo; ✅</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Real Gujarati to English Examples Section */}
        <section id="examples-section" aria-labelledby="examples-table-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-block bg-[#FFE600] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
                Practical Examples
              </span>
              <h2 id="examples-table-heading" className="text-2xl sm:text-3xl font-black uppercase text-foreground mt-1">
                Everyday Gujarati to English Sentence Bank
              </h2>
            </div>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Categorized with linguistic notes
            </span>
          </div>

          {/* Group 1: Questions (Who, What, Where) */}
          <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
            <div className="bg-[#FAF7F2] dark:bg-zinc-800 p-4 border-b-2 border-black dark:border-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 stroke-[2.5]" />
                <h3 className="text-sm font-black uppercase text-foreground">
                  Category 1: Everyday Questions &amp; Inquiries
                </h3>
              </div>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Question Word + Helping Verb</span>
            </div>

            <div className="divide-y-2 divide-black dark:divide-white">
              {/* Row 1 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">ઓફિસમાં કોણ છે?</p>
                  <p className="text-xs text-neutral-500 italic">Oficema kon chhe?</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">Who is in the office?</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Syntax Tip</strong>
                  Starts with &lsquo;Who is&rsquo; + preposition &lsquo;in&rsquo; + place.
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">તમારું નામ શું છે?</p>
                  <p className="text-xs text-neutral-500 italic">Tamaru naam shu chhe?</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">What is your name?</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Syntax Tip</strong>
                  &lsquo;What&rsquo; precedes the helping verb &lsquo;is&rsquo;.
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">બસ સ્ટેન્ડ ક્યાં છે?</p>
                  <p className="text-xs text-neutral-500 italic">Bus stand kyaan chhe?</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">Where is the bus stand?</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Syntax Tip</strong>
                  Use definite article &lsquo;the&rsquo; for a specific destination.
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Daily Routines & Habits */}
          <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
            <div className="bg-[#FAF7F2] dark:bg-zinc-800 p-4 border-b-2 border-black dark:border-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 stroke-[2.5]" />
                <h3 className="text-sm font-black uppercase text-foreground">
                  Category 2: Daily Routines &amp; Habits (Simple Present)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Subject + Base Verb(s)</span>
            </div>

            <div className="divide-y-2 divide-black dark:divide-white">
              {/* Row 4 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">હું સવારે ૬ વાગ્યે ઉઠું છું.</p>
                  <p className="text-xs text-neutral-500 italic">Hu savare 6 vaagye uthu chhu.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">I wake up at 6 AM.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Preposition Tip</strong>
                  Always use &lsquo;at&rsquo; for clock times (never &lsquo;in 6 AM&rsquo;).
                </div>
              </div>

              {/* Row 5 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">તે દરરોજ અંગ્રેજી શીખે છે.</p>
                  <p className="text-xs text-neutral-500 italic">Te darroj Angreji seekhe chhe.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">He learns English every day.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Third Person &lsquo;s&rsquo;</strong>
                  Third person singular (He/She) takes &lsquo;s&rsquo; on the verb.
                </div>
              </div>

              {/* Row 6 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">અમે સાંજે ચા પીએ છીએ.</p>
                  <p className="text-xs text-neutral-500 italic">Ame saanje chaa peeye chhiye.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">We drink tea in the evening.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Time Phrase</strong>
                  Notice time phrase &lsquo;in the evening&rsquo; goes at the end.
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Workplace & Professional Dialogue */}
          <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
            <div className="bg-[#FAF7F2] dark:bg-zinc-800 p-4 border-b-2 border-black dark:border-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 stroke-[2.5]" />
                <h3 className="text-sm font-black uppercase text-foreground">
                  Category 3: Office, Business &amp; Professional Use
                </h3>
              </div>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Conversational Workplace</span>
            </div>

            <div className="divide-y-2 divide-black dark:divide-white">
              {/* Row 7 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">મેનેજર મીટિંગમાં વ્યસ્ત છે.</p>
                  <p className="text-xs text-neutral-500 italic">Manager meetingma vyast chhe.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">The manager is busy in a meeting.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Helping Verb</strong>
                  Do not omit &lsquo;is&rsquo; before the adjective &lsquo;busy&rsquo;.
                </div>
              </div>

              {/* Row 8 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">કૃપા કરીને આ ફાઇલ મોકલો.</p>
                  <p className="text-xs text-neutral-500 italic">Krupa karine aa file moklo.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">Please send this file.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Polite Imperative</strong>
                  &lsquo;Please&rsquo; followed directly by base verb &lsquo;send&rsquo;.
                </div>
              </div>

              {/* Row 9 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">શું તમે મને મદદ કરી શકો છો?</p>
                  <p className="text-xs text-neutral-500 italic">Shu tame mane madad kari shako chho?</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">Can you please help me?</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Modal Verb</strong>
                  Modal &lsquo;Can&rsquo; inversion for polite requests.
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Past Events */}
          <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] overflow-hidden">
            <div className="bg-[#FAF7F2] dark:bg-zinc-800 p-4 border-b-2 border-black dark:border-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 stroke-[2.5]" />
                <h3 className="text-sm font-black uppercase text-foreground">
                  Category 4: Past Actions &amp; Events (Simple Past)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Subject + V2 Past Form</span>
            </div>

            <div className="divide-y-2 divide-black dark:divide-white">
              {/* Row 10 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">ગઈકાલે હું અમદાવાદ ગયો હતો.</p>
                  <p className="text-xs text-neutral-500 italic">Gaikale hu Ahmedabad gayo hato.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">Yesterday, I went to Ahmedabad.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Irregular V2</strong>
                  Use past form &lsquo;went&rsquo; (never &lsquo;was go&rsquo;).
                </div>
              </div>

              {/* Row 11 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">તેમણે નવું ઘર ખરીદ્યું.</p>
                  <p className="text-xs text-neutral-500 italic">Temne navu ghar kharidyu.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">They bought a new house.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Irregular Verb</strong>
                  &lsquo;Buy&rsquo; becomes &lsquo;bought&rsquo; in simple past.
                </div>
              </div>

              {/* Row 12 */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-black uppercase text-neutral-500 block mb-0.5">Gujarati</span>
                  <p className="text-base sm:text-lg font-bold font-gujarati text-foreground">અમે સમયસર પહોંચ્યા નહોતા.</p>
                  <p className="text-xs text-neutral-500 italic">Ame samaysar pahochya nahota.</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-black uppercase text-[#22C55E] block mb-0.5">Natural English</span>
                  <p className="text-base sm:text-lg font-black text-foreground">We did not arrive on time.</p>
                </div>
                <div className="md:col-span-3 text-xs bg-[#FAF7F2] dark:bg-zinc-800 p-2.5 rounded-[4px] border border-black dark:border-white font-medium">
                  <strong className="block text-[10px] font-black uppercase text-neutral-700 dark:text-neutral-300">Negative Past</strong>
                  &lsquo;Did not&rsquo; takes the base verb &lsquo;arrive&rsquo; (not &lsquo;arrived&rsquo;).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Self-Check Cards */}
        <section aria-labelledby="interactive-check-heading" className="border-[3px] border-black dark:border-white bg-[#00F0FF] p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] text-black">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Quick Quiz
            </span>
            <span className="text-xs font-black uppercase text-black font-bold">Test Your Understanding</span>
          </div>
          <h2 id="interactive-check-heading" className="text-2xl font-black uppercase tracking-tight mb-4">
            Click to Reveal Translation &amp; Analysis
          </h2>

          <div className="space-y-3">
            <details className="group bg-white rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer">
              <summary className="flex items-center justify-between font-black text-sm uppercase select-none list-none">
                <span>Quiz 1: &ldquo;હું તમને ઓળખું છું.&rdquo; (Translate to English)</span>
                <span className="px-2 py-0.5 text-xs bg-[#FFE600] border border-black rounded-[2px] group-open:bg-black group-open:text-white transition-colors">
                  Reveal Answer
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-black space-y-1 text-xs sm:text-sm font-medium">
                <p className="font-black text-[#22C55E]">Correct: &ldquo;I know you.&rdquo;</p>
                <p className="text-neutral-700">Notice Gujarati order: હું (I) + તમને (you) + ઓળખું છું (know) → English SVO: I + know + you.</p>
              </div>
            </details>

            <details className="group bg-white rounded-[4px] border-2 border-black shadow-[3px_3px_0px_#000] p-4 cursor-pointer">
              <summary className="flex items-center justify-between font-black text-sm uppercase select-none list-none">
                <span>Quiz 2: &ldquo;તેણી ટેબલ પર પુસ્તક મૂકે છે.&rdquo; (Translate to English)</span>
                <span className="px-2 py-0.5 text-xs bg-[#FFE600] border border-black rounded-[2px] group-open:bg-black group-open:text-white transition-colors">
                  Reveal Answer
                </span>
              </summary>
              <div className="mt-3 pt-3 border-t-2 border-black space-y-1 text-xs sm:text-sm font-medium">
                <p className="font-black text-[#22C55E]">Correct: &ldquo;She puts the book on the table.&rdquo;</p>
                <p className="text-neutral-700">Preposition shift: &lsquo;ટેબલ પર&rsquo; becomes &lsquo;on the table&rsquo; at the end of the sentence.</p>
              </div>
            </details>
          </div>
        </section>

        {/* Downstream Funnel: Translation & Grammar FAQ */}
        <section aria-labelledby="translation-faq-heading" className="border-[3px] border-black dark:border-white bg-[#00F0FF] text-black p-6 sm:p-8 rounded-[6px] shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff]">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-black text-white px-2 py-0.5 text-xs font-black uppercase shadow-[1.5px_1.5px_0px_#ffffff]">
              Knowledge Base
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black">Common Translation Questions</span>
          </div>
          <h2 id="translation-faq-heading" className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">
            Questions About Gujarati to English Translation?
          </h2>
          <p className="text-xs sm:text-sm font-bold max-w-3xl leading-relaxed mb-4">
            Struggling with SOV vs SVO word order, auxiliary verb placement (is, are, have, had), or wondering how our AI tutor evaluates your exercises? Explore our in-depth answers in the English Learn Together FAQ.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Link
              href="/faq"
              className="p-3.5 bg-white border-2 border-black rounded-[4px] shadow-[2.5px_2.5px_0px_#000] hover:bg-[#FFE600] transition-all group"
            >
              <span className="text-xs font-black uppercase block group-hover:text-black">
                How do Gujarati speakers learn English effectively? →
              </span>
              <span className="text-[11px] font-medium text-neutral-600 group-hover:text-black">
                Understand the mental shift required to stop translating word-by-word.
              </span>
            </Link>
            <Link
              href="/faq"
              className="p-3.5 bg-white border-2 border-black rounded-[4px] shadow-[2.5px_2.5px_0px_#000] hover:bg-[#FFE600] transition-all group"
            >
              <span className="text-xs font-black uppercase block group-hover:text-black">
                How does the AI English tutor evaluate translations? →
              </span>
              <span className="text-[11px] font-medium text-neutral-600 group-hover:text-black">
                Learn how natural phrasing, tense agreement, and grammar are scored.
              </span>
            </Link>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border-2 border-black bg-black text-white font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-neutral-800 transition-all"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Read All Frequently Asked Questions</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </section>

        {/* Practice Hub Cross-Links */}
        <section aria-labelledby="related-modules-heading" className="space-y-4">
          <h2 id="related-modules-heading" className="text-xl font-black uppercase text-foreground">
            Continue Your Practice Across the Curriculum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              href="/english-reading-practice"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#22C55E] hover:text-black transition-all group"
            >
              <BookOpen className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Reading Comprehension</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Short bilingual comprehension passages with quizzes and summaries.
              </p>
            </Link>

            <Link
              href="/learn-english"
              className="p-4 rounded-[6px] border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
            >
              <Languages className="h-5 w-5 mb-2" />
              <div className="font-black uppercase text-sm mb-1">Beginner Learning Roadmap</div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
                Review the core 4-step framework and SOV vs SVO grammar differences.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="rounded-[6px] border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Ready to Practice Real Sentences?
            </h3>
            <p className="text-xs sm:text-sm font-bold max-w-xl">
              Log into the app to start active Gujarati-to-English translation tests. Get instant grading, grammar corrections, and alternate natural phrasings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] border-2 border-black bg-white text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-[#FAF7F2]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Read Translation FAQ</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
            >
              <span>Sign Up Free to Test 780+ Translations in App</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

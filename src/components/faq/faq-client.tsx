"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  BookOpen,
  Languages,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Smartphone,
  Flame,
  Award,
} from "lucide-react";

import { FAQ_DATA, type FAQItem } from "@/data/faq-data";

const CATEGORIES = ["All", "Learning Strategy", "Vocabulary & Sentences", "AI Tutor", "General"] as const;

export function FAQClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("gujarati-speakers-learn-english");

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.highlight && item.highlight.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 select-none">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="inline-flex items-center gap-2 rounded-[2px] border-2 border-black dark:border-white bg-[#FFE600] text-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000]">
          <HelpCircle className="h-4 w-4 stroke-[2.5]" />
          <span>Knowledge Base &amp; FAQ</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-black uppercase text-foreground shadow-[2px_2px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-colors"
        >
          <span>Create Free Account</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </Link>
      </div>

      {/* Hero Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[6px] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
          <div className="inline-block bg-[#00F0FF] border-2 border-black px-3 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] mb-3">
            Got Questions? We&apos;ve Got Answers.
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            Frequently Asked <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] inline-block mt-1">Questions</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-bold max-w-3xl leading-relaxed">
            Everything you need to know about practicing Gujarati-to-English translation, mastering vocabulary, utilizing AI tutor explanations, and maximizing daily retention.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 relative">
            <div className="flex items-center rounded-[4px] border-[3px] border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-800 p-2 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]">
              <Search className="h-5 w-5 text-neutral-600 dark:text-neutral-300 stroke-[2.5] ml-2 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. Gujarati, AI tutor, vocabulary, mobile)..."
                className="w-full bg-transparent text-sm sm:text-base font-bold text-foreground focus:outline-none placeholder:text-neutral-500 placeholder:font-medium"
                aria-label="Search questions"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-2 py-0.5 text-xs font-black uppercase border border-black bg-[#FF6B00] text-white rounded-[2px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-[4px] border-2 border-black dark:border-white font-black text-xs uppercase whitespace-nowrap transition-all shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] ${
                isSelected
                  ? "bg-[#FFE600] text-black shadow-[4px_4px_0px_#000000]"
                  : "bg-white dark:bg-zinc-800 text-foreground hover:bg-[#FAF7F2] dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-8 rounded-[6px] text-center shadow-[6px_6px_0px_#000000]">
            <HelpCircle className="h-10 w-10 mx-auto text-neutral-400 mb-3" />
            <p className="text-base font-black uppercase text-foreground">No questions found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mt-1">Try searching for other terms like &ldquo;sentence&rdquo;, &ldquo;free&rdquo;, or reset filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-1.5 rounded-[3px] border-2 border-black bg-[#FFE600] text-black font-black text-xs uppercase shadow-[2px_2px_0px_#000000]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-[6px] shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 hover:bg-[#FAF7F2] dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-[2px] border border-black dark:border-white text-[10px] font-black uppercase bg-[#00F0FF] text-black shadow-[1.5px_1.5px_0px_#000000] mr-2">
                      {faq.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                      {faq.question}
                    </h2>
                  </div>
                  <div
                    className={`h-8 w-8 shrink-0 rounded-[3px] border-2 border-black dark:border-white flex items-center justify-center font-black transition-transform ${
                      isExpanded ? "bg-[#FFE600] text-black rotate-180" : "bg-neutral-100 dark:bg-zinc-800 text-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4 stroke-[3]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t-2 border-black dark:border-white bg-[#FAF7F2] dark:bg-zinc-950/70"
                    >
                      <div className="p-4 sm:p-6 space-y-3">
                        <p className="text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                        {faq.highlight && (
                          <div className="inline-flex items-center gap-2 rounded-[3px] border-2 border-black dark:border-white bg-[#FFE600] text-black px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#000000]">
                            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                            <span>{faq.highlight}</span>
                          </div>
                        )}
                        {faq.relatedLink && (
                          <div className="pt-2">
                            <Link
                              href={faq.relatedLink.url}
                              className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black bg-[#00F0FF] border-2 border-black px-3 py-1.5 rounded-[4px] shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] transition-colors"
                            >
                              <span>{faq.relatedLink.label}</span>
                              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Internal SEO Hub Links */}
      <section className="mt-12 pt-8 border-t-[3px] border-black dark:border-white">
        <h3 className="text-lg font-black uppercase text-foreground mb-4">
          Explore Free Practice Modules &amp; Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/learn-english"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Beginner Learning Roadmap</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
              Comprehensive overview of the 4-step framework and SOV-to-SVO shift.
            </p>
          </Link>

          <Link
            href="/gujarati-to-english"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <Languages className="h-4 w-4" />
              <span>Gujarati to English Guide</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
              Bilingual practice with syntax breakdowns and 12 curated examples.
            </p>
          </Link>

          <Link
            href="/english-vocabulary-practice"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <Brain className="h-4 w-4" />
              <span>Vocabulary Practice Deck</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-white">
              780+ words with Gujarati script meanings, phonetics, and flashcards.
            </p>
          </Link>

          <Link
            href="/english-sentence-practice"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#000000] hover:bg-[#FFE600] hover:text-black transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Sentence Builder Practice</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
              Construct grammatically sound English sentences with AI error diagnosis.
            </p>
          </Link>

          <Link
            href="/english-reading-practice"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_#000000] hover:bg-[#00F0FF] hover:text-black transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Reading Comprehension</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-black">
              Interactive reading passages, comprehension quizzes, and summaries.
            </p>
          </Link>

          <Link
            href="/"
            className="p-4 rounded-[4px] border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[3px_3px_0px_#000000] hover:bg-[#FF6B00] hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-1">
              <Award className="h-4 w-4" />
              <span>Create Free Account</span>
            </div>
            <p className="text-xs font-bold">
              Sign up for free to unlock Section 1 and track your daily practice streak!
            </p>
          </Link>
        </div>
      </section>

      {/* Bottom CTA Box */}
      <div className="mt-12 rounded-[6px] border-[3px] border-black dark:border-white bg-[#FFE600] text-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h4 className="text-2xl font-black uppercase tracking-tight">
            Ready to Accelerate Your English Fluency?
          </h4>
          <p className="text-xs sm:text-sm font-bold max-w-xl">
            Join learners improving their vocabulary and sentence skills every day. Practice freely with immediate AI tutor feedback.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] border-2 border-black bg-black text-white hover:bg-neutral-800 font-black text-sm uppercase shadow-[3px_3px_0px_#ffffff] transition-transform active:translate-x-[2px] active:translate-y-[2px] shrink-0"
        >
          <span>Create Free Account &amp; Start Daily Practice</span>
          <ArrowRight className="h-4 w-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}

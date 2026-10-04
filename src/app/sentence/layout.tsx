import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentence Practice",
  description:
    "Practise Gujarati to English sentence translation with topic-based exercises, grammar structure guides, audio pronunciation, and AI-powered feedback.",
  alternates: {
    canonical: "/sentence",
  },
  openGraph: {
    title: "Sentence Practice | English Learn Together",
    description:
      "Practise Gujarati to English sentence translation with topic-based exercises, grammar guides, and AI feedback.",
    url: "/sentence",
  },
  twitter: {
    title: "Sentence Practice | English Learn Together",
    description:
      "Practise Gujarati to English sentence translation with topic-based exercises and AI feedback.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SentenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

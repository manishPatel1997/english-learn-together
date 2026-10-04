import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentence Reading & AI Analysis",
  description:
    "Read and analyse English sentences with AI-powered breakdown. Understand grammar structure, word meanings, and sentence composition in context.",
  alternates: {
    canonical: "/sentence-reading",
  },
  openGraph: {
    title: "Sentence Reading & AI Analysis | English Learn Together",
    description:
      "Read and analyse English sentences with AI-powered grammar breakdown and word-level explanations.",
    url: "/sentence-reading",
  },
  twitter: {
    title: "Sentence Reading & AI Analysis | English Learn Together",
    description:
      "Analyse English sentences with AI-powered grammar breakdown and word-level explanations.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SentenceReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

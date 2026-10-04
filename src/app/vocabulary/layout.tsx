import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocabulary Practice",
  description:
    "Practise Gujarati to English vocabulary with interactive spelling exercises, multiple-choice questions, section-based word lists, and personalised review.",
  alternates: {
    canonical: "/vocabulary",
  },
  openGraph: {
    title: "Vocabulary Practice | English Learn Together",
    description:
      "Practise Gujarati to English vocabulary with interactive spelling exercises, multiple-choice questions, and personalised review.",
    url: "/vocabulary",
  },
  twitter: {
    title: "Vocabulary Practice | English Learn Together",
    description:
      "Practise Gujarati to English vocabulary with interactive spelling exercises and personalised review.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

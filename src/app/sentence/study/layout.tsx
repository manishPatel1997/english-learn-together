import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentence Study Mode",
  description:
    "Study Gujarati to English sentence translations, listen to audio pronunciations, and review grammar structure formulas.",
  robots: { index: false, follow: false },
};

export default function SentenceStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

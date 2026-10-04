import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocabulary Results",
  description:
    "Review your vocabulary practice session results including score, accuracy, and XP earned.",
  robots: { index: false, follow: false },
};

export default function VocabularyResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

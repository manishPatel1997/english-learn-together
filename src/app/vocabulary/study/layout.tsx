import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocabulary Study List",
  description:
    "Study Gujarati to English vocabulary words section by section before taking the practice exam.",
  robots: { index: false, follow: false },
};

export default function VocabularyStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

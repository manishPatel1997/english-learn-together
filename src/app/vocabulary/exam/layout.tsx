import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocabulary Exam",
  description:
    "Test your Gujarati to English vocabulary knowledge with a timed exam session.",
  robots: { index: false, follow: false },
};

export default function VocabularyExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

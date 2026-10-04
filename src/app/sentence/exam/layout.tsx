import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentence Exam",
  description:
    "Test your Gujarati to English sentence translation skills with a timed exam and AI-powered feedback.",
  robots: { index: false, follow: false },
};

export default function SentenceExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

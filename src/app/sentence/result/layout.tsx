import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentence Practice Results",
  description:
    "Review your sentence practice results including score, accuracy, and XP earned.",
  robots: { index: false, follow: false },
};

export default function SentenceResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

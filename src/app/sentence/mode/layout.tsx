import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose Practice Mode",
  description:
    "Select Study Mode or Exam Mode for Gujarati to English sentence translation practice.",
  robots: { index: false, follow: false },
};

export default function SentenceModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

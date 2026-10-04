import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Progress",
  description:
    "View your English learning progress including XP earned, accuracy rates, session history, and vocabulary mastery across all practice modes.",
  alternates: {
    canonical: "/progress",
  },
  openGraph: {
    title: "Learning Progress | English Learn Together",
    description:
      "View your XP, accuracy, session history, and vocabulary mastery across all practice modes.",
    url: "/progress",
  },
  twitter: {
    title: "Learning Progress | English Learn Together",
    description:
      "View your XP, accuracy, session history, and vocabulary mastery.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

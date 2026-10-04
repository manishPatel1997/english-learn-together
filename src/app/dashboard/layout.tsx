import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your English learning dashboard. Track your XP, streaks, accuracy, and daily practice goals for Gujarati to English vocabulary and sentence exercises.",
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: "Dashboard | English Learn Together",
    description:
      "Track your learning progress, XP, streak, and daily practice goals in one place.",
    url: "/dashboard",
  },
  twitter: {
    title: "Dashboard | English Learn Together",
    description:
      "Track your learning progress, XP, streak, and daily practice goals in one place.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

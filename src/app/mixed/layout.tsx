import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mixed Practice",
  description:
    "Challenge yourself with a mixed practice session combining Gujarati to English vocabulary and sentence translation exercises in a single randomised session.",
  alternates: {
    canonical: "/mixed",
  },
  openGraph: {
    title: "Mixed Practice | English Learn Together",
    description:
      "Combined vocabulary and sentence translation practice in a single randomised session.",
    url: "/mixed",
  },
  twitter: {
    title: "Mixed Practice | English Learn Together",
    description:
      "Combined vocabulary and sentence translation practice in a single randomised session.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MixedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

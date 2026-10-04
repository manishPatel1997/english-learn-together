import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mistakes Review",
  description:
    "Review the vocabulary and sentences you got wrong in past practice sessions to reinforce your weak areas.",
  alternates: {
    canonical: "/mistakes",
  },
  openGraph: {
    title: "Mistakes Review | English Learn Together",
    description:
      "Review past mistakes to reinforce vocabulary and sentence translation skills.",
    url: "/mistakes",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function MistakesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

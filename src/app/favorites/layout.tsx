import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favourites",
  description:
    "Access your saved favourite vocabulary words and sentences for quick review and focused practice.",
  alternates: {
    canonical: "/favorites",
  },
  openGraph: {
    title: "Favourites | English Learn Together",
    description:
      "Access your saved favourite vocabulary words and sentences for focused practice.",
    url: "/favorites",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

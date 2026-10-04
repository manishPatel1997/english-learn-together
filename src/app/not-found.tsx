import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | English Learn Together",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <h1 className="mb-4 text-4xl font-bold text-primary">404 – Not Found</h1>
      <p className="mb-6 text-lg">
        Oops! The page you are trying to reach doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Return to Home
      </Link>
    </main>
  );
}

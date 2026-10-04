import type { Metadata } from "next";
import { FAQClient } from "@/components/faq/faq-client";
import { FAQ_DATA } from "@/data/faq-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description:
    "Explore common questions about English Learn Together. Learn how our Gujarati-to-English translation exercises, vocabulary retention system, and AI feedback help you build fluency.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | English Learn Together",
    description:
      "Find answers to frequently asked questions about learning English from Gujarati with our interactive practice exercises, AI feedback, and progress tracking.",
    url: `${SITE_URL}/faq`,
    siteName: "English Learn Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | English Learn Together",
    description:
      "Find answers to frequently asked questions about learning English from Gujarati with our interactive practice exercises and AI feedback.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function FAQPage() {
  // Construct Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/\n/g, " "),
      },
    })),
  };

  return (
    <>
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-foreground">
        <FAQClient />
      </main>
    </>
  );
}

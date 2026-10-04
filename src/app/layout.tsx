import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://english-learn-together.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "English Learn Together | Learn English Through Practice",
    template: "%s | English Learn Together",
  },
  description:
    "Practice Gujarati to English vocabulary, sentence translation, and grammar with interactive exercises, AI feedback, and personalised progress tracking.",

  applicationName: "English Learn Together",
  authors: [{ name: "English Learn Together" }],
  generator: "Next.js",
  keywords: [
    "Gujarati to English",
    "learn English",
    "English vocabulary practice",
    "English sentence practice",
    "Gujarati English translation",
    "English learning app",
  ],
  referrer: "origin-when-cross-origin",

  // Canonical is handled per-page; the default falls back to metadataBase
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type: "website",
    siteName: "English Learn Together",
    title: "English Learn Together | Learn English Through Practice",
    description:
      "Practice Gujarati to English vocabulary, sentence translation, and grammar with interactive exercises, AI feedback, and personalised progress tracking.",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "English Learn Together – interactive Gujarati to English practice app",
      },
    ],
    locale: "en_US",
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "English Learn Together | Learn English Through Practice",
    description:
      "Practice Gujarati to English vocabulary, sentence translation, and grammar with interactive exercises and AI feedback.",
    images: [OG_IMAGE],
  },

  // Icons — favicon.ico is auto-picked from /app/favicon.ico
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: "/favicon.ico",
  },

  // Web Manifest
  manifest: "/site.webmanifest",

  // Robots — allow all public pages (see robots.ts for full control)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data — WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "English Learn Together",
              url: SITE_URL,
              description:
                "An interactive web application for practising Gujarati to English vocabulary, sentence translation, and grammar through exercises, AI feedback, and progress tracking.",
              applicationCategory: "EducationApplication",
              operatingSystem: "All",
              browserRequirements: "Requires JavaScript",
              inLanguage: "en",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Vocabulary Practice",
                "Sentence Translation Practice",
                "AI-powered Feedback",
                "Progress Tracking",
                "Streak & XP System",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

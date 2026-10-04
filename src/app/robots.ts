import type { MetadataRoute } from "next";

/**
 * robots.ts — Crawler access rules for English Learn Together.
 *
 * The application is fully gated behind authentication. No page content
 * is accessible to unauthenticated crawlers. The root URL serves the
 * authentication landing gate, which is the only genuinely public surface.
 *
 * Private/authenticated routes are explicitly disallowed to prevent
 * any accidental indexing of user-specific application state.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://english-learn-together.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        // Allow public pages and landing pages
        allow: [
          "/",
          "/faq",
          "/learn-english",
          "/english-vocabulary-practice",
          "/english-sentence-practice",
          "/gujarati-to-english",
          "/english-reading-practice",
        ],
        // Disallow all private / application / API routes
        disallow: [
          "/dashboard",
          "/vocabulary",
          "/sentence",
          "/sentence-reading",
          "/mixed",
          "/progress",
          "/mistakes",
          "/favorites",
          "/settings",
          "/admin",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

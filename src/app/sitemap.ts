import type { MetadataRoute } from "next";

/**
 * sitemap.ts — XML sitemap for English Learn Together.
 *
 * This application is a fully authenticated practice tool. All practice pages
 * (vocabulary, sentence, progress, settings, etc.) require a user account and
 * are behind an authentication gate — they should NOT appear in search engines.
 *
 * The only URL included here is the root URL, which renders the auth landing
 * gate and is the only genuinely public-facing surface of the application.
 *
 * If public landing pages, blog posts, or marketing pages are added in future,
 * they should be added to this sitemap at that time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://english-learn-together.vercel.app";

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/learn-english`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/english-vocabulary-practice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/english-sentence-practice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/gujarati-to-english`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/english-reading-practice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}

import { MetadataRoute } from "next";

interface SitemapEntry {
  url: string;
  lastModified: Date | string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Site configuration - uses environment variable for production flexibility
 * Falls back to production URL if not set
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://legacyglobalbank.com";

/**
 * Centralized route definitions for maintainability
 * Easy to add/remove routes without duplicating base URL logic
 */
const routes: Omit<SitemapEntry, "url">[] = [
  // Homepage - highest priority
  {
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  // Calculators - high priority tools
  {
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  // Main business pages
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  // Supporting pages
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  // Legal/compliance pages - lower priority, infrequent changes
  {
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  // Other pages
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

/**
 * Path mappings corresponding to routes array
 * Maintains order for easy maintenance
 */
const paths: string[] = [
  "/",
  "/calculators/pip-calculator",
  "/calculators/profit-calculator",
  "/calculators/margin-calculator",
  "/calculators/lot-size-calculator",
  "/calculators/gold-calculator",
  "/accounts",
  "/market",
  "/forex-news",
  "/contact",
  "/education",
  "/demo",
  "/testimonials",
  "/why-us",
  "/privacy-policy",
  "/refund-policy",
  "/terms-and-conditions",
  "/career",
  "/downloads",
];

/**
 * Generates sitemap with proper type safety and environment configuration
 * @returns MetadataRoute.Sitemap array for Next.js
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: SitemapEntry[] = paths.map((path, index) => ({
    url: `${SITE_URL}${path}`,
    ...routes[index],
  }));

  return sitemap;
}

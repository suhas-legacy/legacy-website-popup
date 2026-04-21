import { MetadataRoute } from "next";

/**
 * Site configuration - uses environment variable for production flexibility
 * Falls back to production URL if not set
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://legacyglobalbank.com";

/**
 * Generates robots.txt with comprehensive crawler rules
 * Includes specific rules for major search engines and bot management
 * @returns MetadataRoute.Robots configuration for Next.js
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // Global rules for all crawlers
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Block API endpoints from indexing
          "/_next/", // Block Next.js internal files
          "/admin/", // Block admin area
          "/private/", // Block private routes
          "/*.json$", // Block JSON files
          "/*.xml$", // Block XML files except sitemap
        ],
      },
      // Specific rules for major search engines
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
        crawlDelay: 1, // Respectful crawling rate
      },
      // Block aggressive crawlers
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot"],
        disallow: "/",
      },
    ],
    // Sitemap location for search engines
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Additional host directive for search engines
    host: SITE_URL,
  };
}

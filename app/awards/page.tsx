import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AwardsSection } from "@/components/AwardsSection";
import { JsonLd } from "@/components/JsonLd";
import { PANEL_URL_REGISTER } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Awards & Recognition | Legacy Global Bank",
  description:
    "Legacy Global Bank has been recognized globally for excellence in trading, customer support, and financial transparency. Explore our industry awards.",
  openGraph: {
    title: "Awards & Recognition | Legacy Global Bank",
    description:
      "Legacy Global Bank has been recognized globally for excellence in trading, customer support, and financial transparency.",
    url: "https://legacyglobalbank.com/awards",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/awards",
  },
};

const awardsSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Legacy Global Bank",
  url: "https://legacyglobalbank.com",
  award: [
    "Best Multi-Asset Trading Platform – FxDailyInfo 2025",
    "Excellence in Customer Support – International Business Magazine 2025",
    "Most Transparent Broker – World Finance Magazine 2024",
    "Most Trusted Financial Broker – World Business Outlook 2024",
  ],
};

export default function AwardsPage() {
  return (
    <>
      <JsonLd data={awardsSchema} />
      <Navbar />
      <main className="page-main awards-page-main">
        <div className="awards-hero">
          <div className="awards-hero-inner">
            <PageBreadcrumb currentPage="Awards" />
            <h1 className="awards-page-h1">
              Awards &amp; <span className="gold-text">Recognition</span>
            </h1>
            <p className="awards-page-subtitle">
              Trusted by traders worldwide. Recognized by the industry&apos;s most prestigious institutions for excellence, transparency, and innovation.
            </p>
          </div>
          <div className="awards-hero-stats">
            <div className="awards-stat">
              <span className="awards-stat-num">4+</span>
              <span className="awards-stat-label">Industry Awards</span>
            </div>
            <div className="awards-stat-divider" />
            <div className="awards-stat">
              <span className="awards-stat-num">2</span>
              <span className="awards-stat-label">Years of Excellence</span>
            </div>
            <div className="awards-stat-divider" />
            <div className="awards-stat">
              <span className="awards-stat-num">Global</span>
              <span className="awards-stat-label">Recognition</span>
            </div>
          </div>
        </div>

        <AwardsSection />

        <div className="page-container">
          <div className="page-cta awards-cta">
            <h2>Trade with an <span className="gold-text">Award-Winning</span> Broker</h2>
            <p className="awards-cta-desc">
              Join thousands of traders who trust Legacy Global Bank for secure, transparent, and powerful trading.
            </p>
            <div className="page-cta-buttons">
              <a href={PANEL_URL_REGISTER} className="btn-gold">
                Open Live Account
              </a>
              <Link href="/why-us" className="btn-outline">
                Why Choose Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

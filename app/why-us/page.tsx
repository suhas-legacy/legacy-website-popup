import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PANEL_URL_REGISTER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Why Choose Legacy Global Bank | Secure Forex & CFD Trading",
  description:
    "Discover why traders choose Legacy Global Bank — lightning-fast execution, 256-bit security, 24/7 multilingual support, and expert education resources.",
  openGraph: {
    title: "Why Choose Legacy Global Bank | Secure Forex & CFD Trading",
    description:
      "Discover why traders choose Legacy Global Bank — lightning-fast execution, 256-bit security, 24/7 multilingual support, and expert education resources.",
    url: "https://legacyglobalbank.com/why-us",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/why-us",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Legacy Global Bank",
  url: "https://legacyglobalbank.com",
  logo: "https://legacyglobalbank.com/logo.svg",
  description:
    "Legacy Global Bank is a leading forex and CFD trading platform offering secure trading, lightning-fast execution, and 24/7 multilingual support.",
};

export default function WhyUsPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Why Us" />
          <h1 className="page-title">
            Why traders choose <span className="gold-text">Legacy Global Bank</span>
          </h1>
          <p className="page-subtitle">
            State-of-the-art technology, bank-grade security, and round-the-clock
            support — built for serious traders.
          </p>

          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">⚡</span>
              <div className="why-title">Advanced Platform</div>
              <p className="why-desc">
                Lightning execution, 50+ indicators
              </p>
            </div>
            <div className="why-card">
              <span className="why-icon">🔒</span>
              <div className="why-title">Secure Trading</div>
              <p className="why-desc">
                256-bit encryption protects every trade
              </p>
            </div>
            <div className="why-card">
              <span className="why-icon">🌐</span>
              <div className="why-title">24/7 Support</div>
              <p className="why-desc">
                Expert team available in multiple languages
              </p>
            </div>
            <div className="why-card">
              <span className="why-icon">🎓</span>
              <div className="why-title">Educational Resources</div>
              <p className="why-desc">
                Webinars, market analysis & trading guides
              </p>
            </div>
          </div>

          <div className="page-cta">
            <h2>Ready to trade with confidence?</h2>
            <div className="page-cta-buttons">
              <a href={PANEL_URL_REGISTER} className="btn-gold">
                Open Live Account
              </a>
              <a href="/demo" className="btn-outline">
                Try Demo Free
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

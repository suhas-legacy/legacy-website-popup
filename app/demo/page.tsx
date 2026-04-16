import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PANEL_URL_REGISTER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Demo Account | Practice Forex Trading | Legacy Global Bank",
  description:
    "Open a free $10,000 demo trading account with Legacy Global Bank. Practice forex, CFD and crypto trading with zero risk in real market conditions.",
  openGraph: {
    title: "Free Demo Account | Practice Forex Trading | Legacy Global Bank",
    description:
      "Open a free $10,000 demo trading account with Legacy Global Bank. Practice forex, CFD and crypto trading with zero risk in real market conditions.",
    url: "https://legacyglobalbank.com/demo",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/demo",
  },
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "Free Demo Trading Account",
  description:
    "Open a free $10,000 demo trading account with Legacy Global Bank. Practice forex, CFD and crypto trading with zero risk.",
  price: "0",
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  offeredBy: {
    "@type": "Organization",
    name: "Legacy Global Bank",
  },
};

export default function DemoPage() {
  return (
    <>
      <JsonLd data={offerSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Demo Account" />
          <h1 className="page-title">
            Start trading risk-free with a <span className="gold-text">$10,000 demo account</span>
          </h1>
        </div>

        <section className="demo-section">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Demo Account
          </div>
          <h2 className="vf-title">
            Trade Live Charts With
            <br />
            <span className="gold-text">Virtual Funds</span>
          </h2>

          <div className="counter-machine">
            <div className="counter-row">
              <span className="counter-symbol">$</span>
              <span className="counter-digit">1</span>
              <span className="counter-digit">0</span>
              <span className="counter-digit">0</span>
              <span className="counter-digit">0</span>
              <span className="counter-digit">0</span>
            </div>
          </div>

          <div className="vf-features">
            <div className="vf-feat">
              <div className="check">✓</div> $10,000 preloaded in your demo account
            </div>
            <div className="vf-feat">
              <div className="check">✓</div> Unlimited balance refills at any time
            </div>
            <div className="vf-feat">
              <div className="check">✓</div> Real market conditions, zero risk
            </div>
            <div className="vf-feat">
              <div className="check">✓</div> Switch to live account anytime
            </div>
          </div>

          <a
            href={PANEL_URL_REGISTER}
            className="btn-gold"
            style={{
              fontSize: "0.85rem",
              padding: "1rem 3rem",
              display: "inline-block",
            }}
          >
            Try Demo Account Free
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

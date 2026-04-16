import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { MarketView } from "@/components/MarketView";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

export const metadata: Metadata = {
  title: "Live Markets | Forex, CFD, Crypto & Commodities | Legacy Global Bank",
  description:
    "Trade 500+ instruments live — Forex pairs, Gold, Oil, Indices, Crypto and more. View real-time charts and market prices on Legacy Global Bank.",
  openGraph: {
    title: "Live Markets | Forex, CFD, Crypto & Commodities | Legacy Global Bank",
    description:
      "Trade 500+ instruments live — Forex pairs, Gold, Oil, Indices, Crypto and more. View real-time charts and market prices on Legacy Global Bank.",
    url: "https://legacyglobalbank.com/market",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/market",
  },
};

const financialProductSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "Live CFD Markets",
  description:
    "Trade 500+ instruments live including Forex pairs, Gold, Oil, Indices, and Crypto on Legacy Global Bank.",
  brand: {
    "@type": "Brand",
    name: "Legacy Global Bank",
  },
  category: ["Forex", "Commodities", "Indices", "Crypto", "Metals"],
};

export default function MarketPage() {
  return (
    <>
      <JsonLd data={financialProductSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Live Markets" />
          <h1 className="page-title">
            Live global markets — trade <span className="gold-text">500+ instruments</span>
          </h1>
          <p className="page-subtitle">
            Tap any instrument for a live chart. Trade Forex, Commodities, Indices, Crypto and Metals — all from one platform.
          </p>
        </div>
        <MarketView hideHeader />  {/* ← pass prop to suppress internal header */}
      </main>
      <Footer />
    </>
  );
}
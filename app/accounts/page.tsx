import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PANEL_URL_REGISTER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Trading Account Types | Standard, Pro & VIP | Legacy Global Bank",
  description:
    "Choose from Standard, Classic, Pro, or VIP trading accounts. All accounts offer up to 1:500 leverage. Find the account that matches your trading style.",
  openGraph: {
    title: "Trading Account Types | Standard, Pro & VIP | Legacy Global Bank",
    description:
      "Choose from Standard, Classic, Pro, or VIP trading accounts. All accounts offer up to 1:500 leverage. Find the account that matches your trading style.",
    url: "https://legacyglobalbank.com/accounts",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/accounts",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Trading Accounts",
  description:
    "Choose from Standard, Classic, Pro, or VIP trading accounts. All accounts offer up to 1:500 leverage.",
  brand: {
    "@type": "Brand",
    name: "Legacy Global Bank",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Standard Account",
      price: "0",
      priceCurrency: "USD",
      description: "Flexible minimum deposit, 1.8 pip spread, no commission",
    },
    {
      "@type": "Offer",
      name: "Classic Account",
      price: "0",
      priceCurrency: "USD",
      description: "Flexible minimum deposit, 1.5 pip spread, no commission",
    },
    {
      "@type": "Offer",
      name: "Pro Account",
      price: "500",
      priceCurrency: "USD",
      description: "$500 minimum deposit, 0 pip spread, $2 commission per lot",
    },
    {
      "@type": "Offer",
      name: "VIP Account",
      price: "1000",
      priceCurrency: "USD",
      description: "$1,000 minimum deposit, 0 pip spread, $1 commission per lot",
    },
  ],
};

export default function AccountsPage() {
  return (
    <>
      <JsonLd data={productSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Accounts" />
          <h1 className="page-title">
            Choose your <span className="gold-text">trading account</span>
          </h1>
          <p className="page-subtitle">
            Select the account that matches your trading style and experience level.
            All accounts include up to 1:500 leverage.
          </p>

          <div className="accounts-grid">
            <div className="acc-card">
              <div className="acc-type">Standard</div>
              <div className="acc-deposit">Min. Deposit: Flexible</div>
              <ul className="acc-rows">
                <li>
                  <span>Spread From</span>
                  <span>1.8 pip</span>
                </li>
                <li>
                  <span>Commission</span>
                  <span>$0</span>
                </li>
                <li>
                  <span>Max Leverage</span>
                  <span>1:500</span>
                </li>
                <li>
                  <span>Min. Lot</span>
                  <span>0.01</span>
                </li>
                <li>
                  <span>Execution</span>
                  <span>Market</span>
                </li>
              </ul>
              <a href={PANEL_URL_REGISTER} className="acc-cta">
                Open Account
              </a>
            </div>

            <div className="acc-card">
              <div className="acc-type">Classic</div>
              <div className="acc-deposit">Min. Deposit: Flexible</div>
              <ul className="acc-rows">
                <li>
                  <span>Spread From</span>
                  <span>1.5 pip</span>
                </li>
                <li>
                  <span>Commission</span>
                  <span>$0</span>
                </li>
                <li>
                  <span>Max Leverage</span>
                  <span>1:500</span>
                </li>
                <li>
                  <span>Min. Lot</span>
                  <span>0.01</span>
                </li>
                <li>
                  <span>Execution</span>
                  <span>Market</span>
                </li>
              </ul>
              <a href={PANEL_URL_REGISTER} className="acc-cta">
                Open Account
              </a>
            </div>

            <div className="acc-card featured">
              <div className="acc-badge">Popular</div>
              <div className="acc-type gold-text">Pro</div>
              <div className="acc-deposit">Min. Deposit: $500</div>
              <ul className="acc-rows">
                <li>
                  <span>Spread From</span>
                  <span>0 pip</span>
                </li>
                <li>
                  <span>Commission</span>
                  <span>2-Side / Lot</span>
                </li>
                <li>
                  <span>Max Leverage</span>
                  <span>1:500</span>
                </li>
                <li>
                  <span>Min. Lot</span>
                  <span>0.01</span>
                </li>
                <li>
                  <span>Execution</span>
                  <span>Market</span>
                </li>
              </ul>
              <a href={PANEL_URL_REGISTER} className="acc-cta">
                Open Account
              </a>
            </div>

            <div className="acc-card">
              <div className="acc-type">VIP</div>
              <div className="acc-deposit">Min. Deposit: $1,000</div>
              <ul className="acc-rows">
                <li>
                  <span>Spread From</span>
                  <span>0 pip</span>
                </li>
                <li>
                  <span>Commission</span>
                  <span>1-Side / Lot</span>
                </li>
                <li>
                  <span>Max Leverage</span>
                  <span>1:500</span>
                </li>
                <li>
                  <span>Min. Lot</span>
                  <span>0.01</span>
                </li>
                <li>
                  <span>Execution</span>
                  <span>Market</span>
                </li>
              </ul>
              <a href={PANEL_URL_REGISTER} className="acc-cta">
                Open Account
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

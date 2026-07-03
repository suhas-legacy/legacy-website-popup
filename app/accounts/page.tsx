import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PANEL_URL_REGISTER } from "@/lib/constants";
import accountTypesData from "@/lib/data/account-types.json";
import { AccountTypeData } from "@/lib/accountTypes";

const accountTypes = accountTypesData as AccountTypeData[];

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
  offers: accountTypes.map((account) => ({
    "@type": "Offer",
    name: `${account.name} Account`,
    price: account.price,
    priceCurrency: "USD",
    description: account.schemaDescription,
  })),
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
            {accountTypes.map((account) => (
              <div
                key={account.id}
                className={`acc-card ${account.isFeatured ? "featured" : ""}`}
              >
                {account.badge && <div className="acc-badge">{account.badge}</div>}
                <div className={`acc-type ${account.isGoldText ? "gold-text" : ""}`}>
                  {account.name}
                </div>
                <div className="acc-deposit">{account.deposit}</div>
                <ul className="acc-rows">
                  {account.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <span>{feature.label}</span>
                      <span>{feature.value}</span>
                    </li>
                  ))}
                </ul>
                <a href={PANEL_URL_REGISTER} className="acc-cta">
                  Open Account
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


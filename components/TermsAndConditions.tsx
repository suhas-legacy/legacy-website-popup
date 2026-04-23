import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";

export function TermsAndConditions() {
  return (
    <div className="terms-and-conditions-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <h1 className="section-title">
            Terms & <span className="gold-text">Conditions</span>
          </h1>
          <p className="section-desc">
            Read the terms and conditions governing your use of Legacy Global Bank Capital Limited services.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="policy-content">
        <div className="policy-container">
          <div className="policy-text">
            <p className="policy-intro">
              These Terms & Conditions ("Terms") form a legally binding agreement between you ("User", "Trader", "You") and Legacy Global Bank Capital Limited ("Company", "We", "Us", "Our"). By accessing our website, registering an account, or using our services, you agree to comply fully with these Terms.
            </p>

            <section className="policy-section">
              <h2>1. Eligibility</h2>
              <ul>
                <li>You must be at least 18 years old or meet the legal age requirement in your jurisdiction.</li>
                <li>You must not reside in or be a citizen of any region where our services are restricted or prohibited.</li>
                <li>You confirm that your use of our services complies with all applicable laws and regulations.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>2. Account Registration & Management</h2>
              <ul>
                <li>You must provide accurate, complete, and truthful information during registration.</li>
                <li>You are responsible for safeguarding your account credentials.</li>
                <li>Notify us immediately if you suspect unauthorized account access.</li>
                <li>We reserve the right to approve or reject registrations at our discretion.</li>
                <li>Only one account per user is allowed unless explicitly authorized.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>3. Deposits & Withdrawals</h2>
              <ul>
                <li>Deposits must be made using approved payment methods listed on our platform.</li>
                <li>Withdrawals will only be processed to verified accounts using the original payment method.</li>
                <li>All transactions are subject to AML/KYC verification and may be delayed if required.</li>
                <li>Applicable fees, commissions, or charges will be transparently displayed.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>4. Trading Services</h2>
              <ul>
                <li>Our platform offers trading in forex, cryptocurrencies, commodities, indices, stocks, and CFDs.</li>
                <li>Prices are sourced from liquidity providers, but real-time accuracy is not guaranteed.</li>
                <li>Service interruptions may occur due to maintenance or technical issues.</li>
                <li>Trading conditions, including leverage and margin, may change without prior notice.</li>
              </ul>
              <p>The Company does not provide market positions or trading signals at any time, nor does it solicit or manage client funds under any circumstances. Any individual claiming to offer such services or requesting funds on our behalf is acting without authorization. Clients are advised to report such instances immediately. The Company shall not be liable for any losses arising from reliance on such unauthorized communications or transactions.</p>
            </section>

            <section className="policy-section">
              <h2>5. Prohibited Trading Practices</h2>
              <p>The following activities are strictly prohibited:</p>
              <ul>
                <li>Market manipulation (e.g., spoofing, layering)</li>
                <li>Insider trading</li>
                <li>Front-running</li>
                <li>Quote stuffing</li>
                <li>Use of unauthorized bots or software</li>
                <li>Latency arbitrage</li>
              </ul>
              <p>We reserve the right to cancel or reverse trades that violate these rules.</p>
            </section>

            <section className="policy-section">
              <h2>6. No Scalping Policy</h2>
              <p>Scalping is restricted and includes:</p>
              <ul>
                <li>Opening and closing trades within 2 minutes</li>
                <li>Excessive short-term trades exceeding 25% without approval</li>
                <li>Use of ultra-fast automated trading systems</li>
                <li>Exploiting system delays, bugs, or pricing inefficiencies</li>
                <li>Using multiple accounts to bypass restrictions</li>
              </ul>
              <p>Violations may result in penalties including account suspension or profit forfeiture.</p>
            </section>

            <section className="policy-section">
              <h2>7. Leverage & Margin Policy</h2>
              <ul>
                <li>Users must maintain required margin levels at all times.</li>
                <li>Positions may be automatically closed if margin requirements are not met.</li>
                <li>Margin rules and leverage may change depending on market conditions.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>8. AML & KYC Compliance</h2>
              <ul>
                <li>Users must comply with all anti-money laundering and counter-terrorism regulations.</li>
                <li>Identity verification documents may be requested at any time.</li>
                <li>Failure to comply may result in account suspension or transaction denial.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>9. Privacy & Data Usage</h2>
              <ul>
                <li>Personal data is handled in accordance with our Privacy Policy.</li>
                <li>We implement standard security measures but cannot guarantee absolute protection.</li>
                <li>Data will not be shared with third parties unless legally required.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>10. Intellectual Property</h2>
              <ul>
                <li>All platform content, branding, and technology belong exclusively to the Company.</li>
                <li>Users are granted a limited, non-transferable license for personal trading use only.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>11. Risk Disclosure</h2>
              <ul>
                <li>Trading financial instruments involves significant risk.</li>
                <li>Past performance does not guarantee future results.</li>
                <li>Losses may exceed your initial investment.</li>
                <li>Only trade with funds you can afford to lose.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>12. Limitation of Liability</h2>
              <p>We are not responsible for losses caused by:</p>
              <ul>
                <li>Internet failures or system outages</li>
                <li>Market disruptions or delays</li>
                <li>Pricing inaccuracies</li>
                <li>Unauthorized account access due to user negligence</li>
              </ul>
              <p>Our total liability is limited to the amount paid by you in the last 6 months.</p>
            </section>

            <section className="policy-section">
              <h2>13. Force Majeure</h2>
              <p>We are not liable for delays or failures caused by events beyond our control, including natural disasters, war, cyberattacks, or government actions.</p>
            </section>

            <section className="policy-section">
              <h2>14. Account Termination</h2>
              <ul>
                <li>We may suspend or terminate accounts without notice if Terms are violated.</li>
                <li>Users may request account closure after settling all balances.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>15. Dispute Resolution</h2>
              <ul>
                <li>Disputes should first be resolved amicably.</li>
                <li>Unresolved disputes will be handled through binding arbitration in the UAE.</li>
                <li>UAE laws will govern all legal matters.</li>
              </ul>
              <p>All disputes shall be governed by the laws of Saint Lucia.</p>
            </section>

            <section className="policy-section">
              <h2>16. Amendments</h2>
              <ul>
                <li>We reserve the right to update these Terms at any time.</li>
                <li>Continued use of our services indicates acceptance of revised Terms.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Additional Information</h2>
              <p>Legacy Global Bank is registered in Saint Lucia (Registration No: 00744).</p>
              <p>The website may contain external links for informational purposes.</p>
              <p>We do not endorse third-party products or services.</p>
              <p>Services may not be available in jurisdictions where restricted by law.</p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

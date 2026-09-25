"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PARTNERSHIP_LOGIN_URL, PARTNERSHIP_REGISTER_URL } from "@/lib/constants";

export default function PartnershipPage() {
  return (
    <>
      <Navbar />
      <main className="partner-page-main">
        {/* Hero Section */}
        <section className="partner-hero">
          <div className="partner-badge">Institutional & Retail Partnerships</div>
          <h1 className="partner-title">
            Grow Your Business With A <span className="gold-text">Global Leader</span>
          </h1>
          <p className="partner-subtitle">
            The Legacy Global Bank Partnership Program is a collaborative framework built for financial
            professionals, introducing brokers, community mentors, and digital marketers. Connect your network
            to institutional-grade trading infrastructure, transparent rebate models, and real-time portal reporting.
          </p>
          <div className="page-cta-buttons">
            <a
              href={PARTNERSHIP_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Register as a Partner
            </a>
            <a
              href={PARTNERSHIP_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Partner Portal Login
            </a>
          </div>
        </section>

        {/* What is Partnership Section */}
        <section className="partner-overview-section">
          <div className="partner-section-header">
            <h2>What is the Partnership Program?</h2>
            <p>
              A mutually beneficial alliance connecting market participants to world-class execution while rewarding
              partners with sustainable, recurring commercial returns.
            </p>
          </div>
          <div className="partner-overview-grid">
            <div className="partner-overview-card">
              <div className="partner-overview-card-icon">🏛️</div>
              <h3>The Collaborative Model</h3>
              <p>
                A partnership is a cooperative business relationship where you introduce active traders, corporate
                clients, or fellow institutions to Legacy Global Bank. Rather than trading alone, you monetize your
                reputation and reach by providing your clients access to an institutional trading environment.
              </p>
            </div>
            <div className="partner-overview-card">
              <div className="partner-overview-card-icon">⚡</div>
              <h3>Automated Attribution</h3>
              <p>
                Through your dedicated Partner Portal, you receive exclusive tracking links and promotional collateral.
                Our automated attribution system links your referred traders to your partner profile, ensuring every
                qualifying transaction and executed trade calculates your rebates seamlessly.
              </p>
            </div>
            <div className="partner-overview-card">
              <div className="partner-overview-card-icon">👥</div>
              <h3>Who Can Partner With Us?</h3>
              <p>
                Our doors are open to trading coaches, financial educators, signal providers, website publishers,
                influencers, fund managers, algorithmic developers, and corporate entities looking to expand their
                commercial revenue in global financial markets.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Models Grid */}
        <section className="partner-grid">
          {/* Introducing Broker (IB) */}
          <div className="partner-card">
            <div className="partner-card-icon">👥</div>
            <h2 className="partner-card-title">Introducing Broker</h2>
            <p className="partner-card-desc">
              Introduce active traders to our platform and earn recurring rebates derived from their continuous trading activity across global markets.
            </p>
            <div className="partner-card-reward">Volume-Based Rebates</div>
            <ul className="partner-card-features">
              <li>Rebate accrual on completed client transactions</li>
              <li>Multi-tier sub-partner architecture for extended reach</li>
              <li>Bespoke referral tracking links and materials</li>
              <li>Dedicated institutional relationship manager</li>
              <li>Instant visibility into client trading activity</li>
            </ul>
            <div className="partner-card-actions">
              <a
                href={PARTNERSHIP_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-gold"
              >
                Register as IB
              </a>
              <a
                href={PARTNERSHIP_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-outline"
              >
                Portal Login
              </a>
            </div>
          </div>

          {/* Affiliate Program */}
          <div className="partner-card">
            <div className="partner-card-icon">🔗</div>
            <h2 className="partner-card-title">Affiliate Partner</h2>
            <p className="partner-card-desc">
              Leverage your digital presence, content channels, and media traffic to earn performance-driven payouts for every active trader you refer.
            </p>
            <div className="partner-card-reward">Acquisition-Based Rewards</div>
            <ul className="partner-card-features">
              <li>High-conversion promotional banners and landing pages</li>
              <li>Advanced real-time tracking metrics and conversion analytics</li>
              <li>Dynamic marketing widgets and embeddable assets</li>
              <li>Flexible withdrawal options with routine settlement</li>
              <li>Custom campaign generation and tracking parameters</li>
            </ul>
            <div className="partner-card-actions">
              <a
                href={PARTNERSHIP_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-gold"
              >
                Join Affiliates
              </a>
              <a
                href={PARTNERSHIP_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-outline"
              >
                Portal Login
              </a>
            </div>
          </div>

          {/* White Label Solutions */}
          <div className="partner-card">
            <div className="partner-card-icon">🏛️</div>
            <h2 className="partner-card-title">White Label & Enterprise</h2>
            <p className="partner-card-desc">
              Launch your own branded financial brokerage backed by our institutional liquidity, cutting-edge trade execution, and comprehensive back-office tech.
            </p>
            <div className="partner-card-reward">Turnkey Enterprise Architecture</div>
            <ul className="partner-card-features">
              <li>Fully customized and branded trading platforms</li>
              <li>Direct connectivity to institutional liquidity feeds</li>
              <li>Integrated client relationship management back office</li>
              <li>Comprehensive risk management advisory and oversight</li>
              <li>Complete technical setup and continuous operational backing</li>
            </ul>
            <div className="partner-card-actions">
              <a
                href={PARTNERSHIP_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-gold"
              >
                Inquire Enterprise
              </a>
              <a
                href={PARTNERSHIP_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-btn partner-card-btn-outline"
              >
                Portal Login
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="partner-benefits-section">
          <div className="partner-benefits-container">
            <div className="partner-section-header">
              <h2>Key Partnership Advantages</h2>
              <p>Why leading financial professionals and digital marketers partner with Legacy Global Bank</p>
            </div>
            <div className="partner-benefits-grid">
              <div className="partner-benefit-card">
                <div className="partner-benefit-icon">📊</div>
                <div className="partner-benefit-info">
                  <h3>Real-Time Portal Tracking</h3>
                  <p>Track referrals, registration conversions, active positions, and accrued rebates instantly inside your partner dashboard.</p>
                </div>
              </div>
              <div className="partner-benefit-card">
                <div className="partner-benefit-icon">💳</div>
                <div className="partner-benefit-info">
                  <h3>Flexible Settlement Channels</h3>
                  <p>Withdraw accumulated commissions and volume rebates swiftly through a broad spectrum of global and local settlement methods.</p>
                </div>
              </div>
              <div className="partner-benefit-card">
                <div className="partner-benefit-icon">🛠️</div>
                <div className="partner-benefit-info">
                  <h3>Marketing & Media Arsenal</h3>
                  <p>Access ready-to-deploy promotional banners, educational trading materials, localized landers, and responsive interactive widgets.</p>
                </div>
              </div>
              <div className="partner-benefit-card">
                <div className="partner-benefit-icon">👔</div>
                <div className="partner-benefit-info">
                  <h3>Dedicated Account Executives</h3>
                  <p>Receive strategic guidance and around-the-clock onboarding assistance from seasoned partnership professionals committed to your success.</p>
                </div>
              </div>
              <div className="partner-benefit-card">
                <div className="partner-benefit-icon">🌎</div>
                <div className="partner-benefit-info">
                  <h3>Institutional Market Execution</h3>
                  <p>Equip your clientele with ultra-low latency execution and competitive spreads across multiple asset classes for superior retention.</p>
                </div>
              </div>
              <div className="partner-benefit-card">
                <div className="partner-benefit-info">📈</div>
                <div className="partner-benefit-info">
                  <h3>Unrestricted Growth Capacity</h3>
                  <p>Expand your revenue without artificial ceilings or restrictions as your referred volume and sub-partner tree expand over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Onboarding Timeline Section */}
        <section className="partner-steps-section">
          <div className="partner-steps-container">
            <div className="partner-section-header">
              <h2>How to Launch Your Partnership</h2>
              <p>A streamlined journey from registration to continuous commercial expansion</p>
            </div>
            <div className="partner-steps-grid">
              <div className="partner-step-card">
                <div className="partner-step-icon">📝</div>
                <h3>Register Online</h3>
                <p>Submit your partner registration through our onboarding portal to activate your profile swiftly.</p>
              </div>
              <div className="partner-step-card">
                <div className="partner-step-icon">🔑</div>
                <h3>Access Your Portal</h3>
                <p>Log in to your dedicated partner dashboard to retrieve personalized tracking links and promotional assets.</p>
              </div>
              <div className="partner-step-card">
                <div className="partner-step-icon">📢</div>
                <h3>Engage Your Network</h3>
                <p>Introduce traders and clients through your community, web properties, webinars, or advisory network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Partner Portal & Access Hub (No Form!) */}
        <section className="partner-portal-section">
          <div className="partner-portal-container">
            <div className="partner-section-header">
              <h2>Access the Dedicated Partner Portal</h2>
              <p>Direct portal access for registered partners and new partner onboarding</p>
            </div>
            <div className="partner-portal-grid">
              <div className="partner-portal-card">
                <div>
                  <span className="partner-portal-badge">New Partners</span>
                  <div className="partner-portal-card-header">
                    <div className="partner-portal-icon">✨</div>
                    <h3>Register as a Partner</h3>
                  </div>
                  <p>
                    Ready to partner with Legacy Global Bank? Create your partner account to obtain your unique referral
                    tracking links, access full promotional resources, and connect with your dedicated partnership director.
                  </p>
                </div>
                <a
                  href={PARTNERSHIP_REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-portal-btn-primary"
                >
                  Register Now →
                </a>
              </div>

              <div className="partner-portal-card">
                <div>
                  <span className="partner-portal-badge">Existing Partners</span>
                  <div className="partner-portal-card-header">
                    <div className="partner-portal-icon">🔐</div>
                    <h3>Partner Portal Login</h3>
                  </div>
                  <p>
                    Already registered as an Introducing Broker or Affiliate? Sign in to your dedicated partner portal to monitor
                    client transactions, review accrued rebates, download updated creatives, and request settlements.
                  </p>
                </div>
                <a
                  href={PARTNERSHIP_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-portal-btn-secondary"
                >
                  Login to Partner Portal →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership FAQ Section */}
        <section className="partner-faq-section">
          <div className="partner-section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about partnering with Legacy Global Bank</p>
          </div>
          <div className="partner-faq-grid">
            <div className="partner-faq-card">
              <h3>What is the role of an Introducing Broker?</h3>
              <p>
                An Introducing Broker connects individual and corporate traders to Legacy Global Bank. In return for introducing
                active clients to our institutional trading environment, the partner receives recurring volume rebates whenever
                referred traders open and close positions.
              </p>
            </div>
            <div className="partner-faq-card">
              <h3>How are partner rebates tracked and settled?</h3>
              <p>
                Our proprietary attribution technology monitors client trading activity in real time. Accrued rebates and commissions
                are reflected inside your partner portal, where you can inspect comprehensive reports and initiate settlement
                withdrawals on demand.
              </p>
            </div>
            <div className="partner-faq-card">
              <h3>Is there any cost to register as a partner?</h3>
              <p>
                Joining our partnership program is entirely complimentary. There are no registration fees, platform subscription
                costs, or ongoing operational charges required to maintain your partner standing.
              </p>
            </div>
            <div className="partner-faq-card">
              <h3>Can I introduce fellow partners to build a network?</h3>
              <p>
                Yes. Our multi-tiered sub-partner architecture enables you to introduce other partners. You receive override
                rebates on the trading activity generated across your extended network alongside your direct client referrals.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

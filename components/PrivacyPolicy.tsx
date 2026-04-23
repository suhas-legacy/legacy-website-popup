import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";
import { PANEL_URL, PANEL_URL_REGISTER } from "@/lib/constants";

export function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          {/* <span className="section-label">Legal</span> */}
          <h1 className="section-title">
            Privacy <span className="gold-text">Policy</span>
          </h1>
          <p className="section-desc">
            Learn how Legacy Global Bank Capital Limited collects, uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="policy-content">
        <div className="policy-container">
          <div className="policy-text">
            <p className="policy-intro">
              This Privacy Policy outlines how Legacy Global Bank Capital Limited ("Company", "We", "Us", "Our") collects, uses, stores, and protects your personal information when you ("User", "Client", "You") access our website and services.
            </p>
            <p className="policy-intro">
              By using our platform, you consent to the practices described in this policy.
            </p>

            <section className="policy-section">
              <h2>1. Information We Collect</h2>
              
              <h3>1.1 Personal Information</h3>
              <ul>
                <li>Full name</li>
                <li>Date of birth</li>
                <li>Residential address</li>
                <li>Email address and phone number</li>
                <li>Government-issued identification (for KYC verification)</li>
              </ul>

              <h3>1.2 Financial Information</h3>
              <ul>
                <li>Bank account details</li>
                <li>Payment method information</li>
                <li>Transaction history</li>
              </ul>

              <h3>1.3 Technical Information</h3>
              <ul>
                <li>IP address</li>
                <li>Device type and browser information</li>
                <li>Operating system</li>
                <li>Log data and usage activity</li>
              </ul>

              <h3>1.4 Cookies & Tracking Technologies</h3>
              <ul>
                <li>Cookies to enhance user experience and platform performance</li>
                <li>Analytics tools to understand user behavior and improve services</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>2. How We Use Your Information</h2>
              <p>Your information may be used for the following purposes:</p>
              <ul>
                <li>Account creation and management</li>
                <li>Identity verification (KYC/AML compliance)</li>
                <li>Processing deposits and withdrawals</li>
                <li>Providing customer support</li>
                <li>Improving platform performance and user experience</li>
                <li>Sending important updates, notifications, and promotional content (where permitted)</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>3. Sharing of Information</h2>
              <p>We do not sell your personal data. However, your information may be shared with:</p>
              <ul>
                <li>Regulatory authorities and law enforcement agencies when required</li>
                <li>Payment processors and financial institutions</li>
                <li>Third-party service providers assisting in operations (e.g., hosting, analytics)</li>
                <li>Legal advisors and auditors</li>
              </ul>
              <p>All third parties are required to maintain confidentiality and data protection standards.</p>
            </section>

            <section className="policy-section">
              <h2>4. Data Security</h2>
              <ul>
                <li>We implement industry-standard security measures to protect your data.</li>
                <li>Data is stored securely and access is restricted to authorized personnel only.</li>
                <li>Despite our efforts, no system can guarantee complete security against all threats.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>5. Data Retention</h2>
              <ul>
                <li>Your personal data is retained only as long as necessary for legal, regulatory, and operational purposes.</li>
                <li>We may retain certain records even after account closure to comply with legal obligations.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Withdraw consent for data processing</li>
                <li>Object to certain data uses</li>
              </ul>
              <p>Requests can be made through our official support channels.</p>
            </section>

            <section className="policy-section">
              <h2>7. Cookies Policy</h2>
              <ul>
                <li>Cookies are used to improve functionality and personalize your experience.</li>
                <li>You may disable cookies through your browser settings, though some features may not function properly.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>8. International Data Transfers</h2>
              <ul>
                <li>Your data may be processed and stored in jurisdictions outside your country.</li>
                <li>By using our services, you consent to such transfers, subject to applicable data protection laws.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>9. Third-Party Links</h2>
              <ul>
                <li>Our platform may contain links to third-party websites.</li>
                <li>We are not responsible for the privacy practices or content of such external sites.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>10. Children's Privacy</h2>
              <ul>
                <li>Our services are not intended for individuals under the age of 18.</li>
                <li>We do not knowingly collect personal data from minors.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>11. Policy Updates</h2>
              <ul>
                <li>We reserve the right to update this Privacy Policy at any time.</li>
                <li>Changes will be effective upon posting on our website.</li>
                <li>Continued use of our services constitutes acceptance of the updated policy.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>12. Contact Information</h2>
              <p>For any privacy-related questions or requests, please contact our support team through official communication channels available on our website.</p>
            </section>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
}

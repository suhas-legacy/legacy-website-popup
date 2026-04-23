import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";

export function RefundPolicy() {
  return (
    <div className="refund-policy-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-content">
          <span className="section-label">Legal</span>
          <h1 className="section-title">
            Refund <span className="gold-text">Policy</span>
          </h1>
          <p className="section-desc">
            Learn about the terms and conditions governing refunds for services provided by Legacy Global Bank Capital Limited.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="policy-content">
        <div className="policy-container">
          <div className="policy-text">
            <p className="policy-intro">
              This Refund Policy outlines the terms and conditions governing refunds for services provided by Legacy Global Bank Capital Limited ("Company", "We", "Us", "Our"). By using our services, you ("User", "Client", "You") agree to this policy.
            </p>

            <section className="policy-section">
              <h2>1. General Policy</h2>
              <ul>
                <li>All payments made to the Company are considered final and non-refundable unless explicitly stated otherwise.</li>
                <li>Refunds are issued solely at the discretion of the Company and in accordance with this policy.</li>
                <li>By completing a transaction, you acknowledge and accept these refund terms.</li>
              </ul>
              <p>The Company shall exercise its discretion reasonably, in good faith, and in accordance with applicable laws.</p>
            </section>

            <section className="policy-section">
              <h2>2. Eligibility for Refunds</h2>
              <p>Refunds may be considered under the following conditions:</p>
              <ul>
                <li>Duplicate or accidental payments made by the user</li>
                <li>Technical errors resulting in incorrect transactions</li>
                <li>Unauthorized transactions (subject to verification)</li>
                <li>Failure of the Company to deliver a paid service</li>
              </ul>
              <p>All refund requests are subject to internal review and approval.</p>
              <p>The Company reserves the right to issue partial refunds based on service usage.” 
The Company may approve full or partial refunds depending on the nature and extent of service utilization.
</p>
            </section>

            <section className="policy-section">
              <h2>3. Non-Refundable Situations</h2>
              <p>Refunds will not be provided in the following cases:</p>
              <ul>
                <li>Losses incurred through trading activities</li>
                <li>Market volatility or unfavorable trading outcomes</li>
                <li>User negligence, including incorrect transaction details</li>
                <li>Failure to complete required KYC/AML verification</li>
                <li>Violation of Company Terms & Conditions</li>
                <li>Change of mind after completing a transaction</li>
              </ul>
              <p>All applicable fees including payment gateway charges, processing fees, taxes, and currency conversion costs are non-refundable.</p>
            </section>

            <section className="policy-section">
              <h2>4. Refund Request Process</h2>
              <ul>
                <li>All refund requests must be submitted through official support channels.</li>
                <li>Requests must include relevant details such as:</li>
              </ul>
              <ul>
                <li>Transaction ID</li>
                <li>Payment method</li>
                <li>Reason for the refund request</li>
              </ul>
              <ul>
                <li>The Company may request additional documentation for verification purposes.</li>
                <li>Requests must be submitted within <strong>7 days</strong> of the transaction date.</li>
              </ul>
              <p>The Company reserves the right to reject refund requests in cases of suspected fraud, abuse, or misuse of services.</p>
            </section>

            <section className="policy-section">
              <h2>5. Processing Time</h2>
              <ul>
                <li>Approved refunds will be processed within <strong>7–14 business days</strong>.</li>
                <li>Processing time may vary depending on the payment provider or banking institution.</li>
                <li>The Company is not responsible for delays caused by third-party payment processors.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>6. Refund Method</h2>
              <ul>
                <li>Refunds will be issued using the original payment method whenever possible.</li>
                <li>If the original method is unavailable, an alternative method may be used at the Company's discretion.</li>
                <li>Currency conversion fees or transaction charges may apply and will be deducted from the refund amount.</li>
                <li>Submission of a refund request does not guarantee approval.</li>
              </ul>
              <p>The Company reserves the right to suspend or restrict account access during refund investigations.</p>
            </section>

            <section className="policy-section">
              <h2>7. Chargebacks & Disputes</h2>
              <ul>
                <li>Users are encouraged to contact the Company before initiating a chargeback.</li>
                <li>Unauthorized chargebacks may result in account suspension or termination.</li>
                <li>The Company reserves the right to dispute any chargeback claim.</li>
              </ul>
              <p>Unauthorized transactions will be considered only if reported immediately and subject to strict verification. The Company is not liable for losses arising from compromised user credentials.</p>
            </section>

            <section className="policy-section">
              <h2>8. Amendments</h2>
              <ul>
                <li>The Company reserves the right to modify this Refund Policy at any time without prior notice.</li>
                <li>Continued use of our services constitutes acceptance of any updated policy.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>9. Contact Information</h2>
              <p>For refund-related inquiries, please contact our support team through official communication channels provided on our website.</p>
            </section>

            <section className="policy-section">
              <h2>10. Fraud & Misuse</h2>
              <p>The Company reserves the right to deny refunds and take appropriate action, including account suspension or termination, in cases of suspected fraud, abuse, or misuse of services.</p>
            </section>

            <section className="policy-section">
              <h2>11.  Governing Law & Jurisdiction</h2>
              <p>This Refund Policy shall be governed by the laws of Mauritius/UAE. Any disputes shall be subject to the exclusive jurisdiction of courts located in Saint Lucia.</p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

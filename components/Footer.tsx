import Image from "next/image";
import Link from "next/link";
import logo from "./logo.svg";

export function Footer() {
  return (
    <footer>
      <div className="risk-disc">
        ⚠️ RISK DISCLAIMER: Trading financial products on margin involves a
        significant level of risk and may not be suitable for all investors.
        It&apos;s important to note that losses can exceed the initial investment.
        Therefore, it&apos;s crucial to fully comprehend the risks involved and take
        appropriate measures to manage them effectively. Investing in derivatives
        carries the possibility of losing an amount that exceeds the initial
        investment. It&apos;s imperative for investors to understand these risks
        thoroughly before engaging in any trading activities. Anyone wishing to
        invest in any of the products mentioned in https://legacyglobalbank.com/
        should seek their own financial or professional advice. Trading of
        securities, forex, metals, commodities may not be suitable for everyone and
        involves the risk of losing part or all of your money. Trading in the
        financial markets has large potential rewards, but also large potential
        risk. You must be aware of the risks and be willing to accept them in order
        to invest in the markets. Don&apos;t invest and trade with money which you
        can&apos;t afford to lose. Forex Trading is not allowed in some countries,
        before investing your money, make sure whether your country is allowing this
        or not.
        <br />
        <br />
        Restricted Regions: Legacy Global Bank does not provide services for
        citizens/residents of the United States, Cuba, Iraq, Myanmar, North Korea,
        Sudan. The services of Legacy Global Bank are not intended for distribution
        to, or use by, any person in any country or jurisdiction where such
        distribution or use would be contrary to local law or regulation.
      </div>
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <Image
              src={logo}
              alt="Legacy Global Bank"
              width={500}
              height={500}
              unoptimized
              style={{
                height: 45,
                width: "auto",
                filter: "drop-shadow(0 0 10px rgba(255,215,0,0.3))",
              }}
            />
          </div>
          <p>
            Your trusted international broker for Forex, Stocks, Crypto, Commodities
            and Indices. Trade with confidence, backed by cutting-edge technology.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="X">
              𝕏
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              in
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              ▶
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Trading</h4>
          <ul>
            <li>
              <a href="#instruments">Forex</a>
            </li>
            <li>
              <a href="#instruments">Commodities</a>
            </li>
            <li>
              <a href="#instruments">Indices</a>
            </li>
            <li>
              <a href="#instruments">Crypto</a>
            </li>
            <li>
              <a href="#instruments">Metals</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#why">About Us</a>
            </li>
            <li>
              <Link href="/career">Careers</Link>
            </li>
            <li>
              <a href="https://legacyglobalbank.com/privacy-policy.html">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://legacyglobalbank.com/terms-condition.html">
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a href="https://legacyglobalbank.com/refund-policy.html">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Live Chat</a>
            </li>
            <li>
              <a href="#">Trading Education</a>
            </li>
            <li>
              <a href="#">Market Analysis</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 Legacy Global Bank Capital Limited. All rights reserved. Reg. No.
          00744 · Saint Lucia
        </p>
        <p>Designed for Professional Traders · Powered by Advanced Technology</p>
      </div>
    </footer>
  );
}

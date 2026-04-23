import Image from "next/image";
import Link from "next/link";
import logo from "./logo.svg";
import {FaFacebook, FaInstagram, FaLinkedin, FaYoutube} from 'react-icons/fa';

export function Footer() {
  return (
    <footer>
      <div className="risk-disc">
        <span className="risk-disc-title font-bold">⚠️ RISK DISCLAIMER:</span> Trading financial products on margin involves a
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
            <a href="https://www.facebook.com/profile.php?id=61581286876956" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/legacy_global_bank/" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="/why-us">About Us</Link>
            </li>
            <li>
              <Link href="/career">Careers</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link href="/refund-policy">Refund Policy</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Trading Tools</h4>
          <ul>
            <li>
              <Link href="/calculators/pip-calculator">Pip Calculator</Link>
            </li>
            <li>
              <Link href="/calculators/profit-calculator">Profit Calculator</Link>
            </li>
            <li>
              <Link href="/calculators/margin-calculator">Margin Calculator</Link>
            </li>
            <li>
              <Link href="/calculators/lot-size-calculator">Lot Size Calculator</Link>
            </li>
            <li>
              <Link href="/forex-news">Forex News</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            {/* <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Live Chat</a>
            </li> */}
            <li>
              <Link href="/education">Trading Education</Link>
            </li>
            {/* <li>
              <a href="#">Market Analysis</a>
            </li> */}
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="ctrader-logo">
          <Image
            src="/ctraderlogo.png"
            alt="cTrader"
            width={200}
            height={90}
            unoptimized
            style={{ filter: "brightness(100) invert(0)" }}
          />
        </div>
        <p>
          © 2026 All rights reserved.
        </p>
      </div>
    </footer>
  );
}

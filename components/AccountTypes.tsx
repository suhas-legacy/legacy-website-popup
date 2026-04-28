"use client";

import posthog from "posthog-js";
import { PANEL_URL_REGISTER } from "@/lib/constants";

function handleOpenAccount(accountType: string) {
  posthog.capture("open_account_clicked", { account_type: accountType });
}

export function AccountTypes() {
  return (
    <section id="accounts">
      <div className="section-label reveal">Account Types</div>
      <h2 className="section-title reveal">
        Choose Your <span className="gold-text">Trading Account</span>
      </h2>
      <p className="section-desc reveal">
        Select the account that matches your trading style and experience level.
        All accounts include up to 1:500 leverage.
      </p>

      <div className="accounts-grid">
        <div className="acc-card reveal reveal-delay-1">
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
          <a href={PANEL_URL_REGISTER} className="acc-cta" onClick={() => handleOpenAccount("standard")}>
            Open Account
          </a>
        </div>

        <div className="acc-card reveal reveal-delay-2">
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
          <a href={PANEL_URL_REGISTER} className="acc-cta" onClick={() => handleOpenAccount("classic")}>
            Open Account
          </a>
        </div>

        <div className="acc-card featured reveal reveal-delay-3">
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
          <a href={PANEL_URL_REGISTER} className="acc-cta" onClick={() => handleOpenAccount("pro")}>
            Open Account
          </a>
        </div>

        <div className="acc-card reveal reveal-delay-4">
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
          <a href={PANEL_URL_REGISTER} className="acc-cta" onClick={() => handleOpenAccount("vip")}>
            Open Account
          </a>
        </div>
      </div>
    </section>
  );
}

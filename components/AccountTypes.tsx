"use client";

import posthog from "posthog-js";
import { PANEL_URL_REGISTER } from "@/lib/constants";
import accountTypesData from "@/lib/data/account-types.json";
import { AccountTypeData } from "@/lib/accountTypes";

const accountTypes = accountTypesData as AccountTypeData[];

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
        {accountTypes.map((account, index) => (
          <div
            key={account.id}
            className={`acc-card ${account.isFeatured ? "featured" : ""} reveal reveal-delay-${index + 1}`}
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
            <a
              href={PANEL_URL_REGISTER}
              className="acc-cta"
              onClick={() => handleOpenAccount(account.id)}
            >
              Open Account
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}


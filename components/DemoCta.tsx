"use client";

import posthog from "posthog-js";
import { PANEL_URL_REGISTER } from "@/lib/constants";

export function DemoCta() {
  return (
    <a
      href={PANEL_URL_REGISTER}
      className="btn-gold"
      style={{
        fontSize: "0.85rem",
        padding: "1rem 3rem",
        display: "inline-block",
      }}
      onClick={() => posthog.capture("demo_account_cta_clicked")}
    >
      Try Demo Account Free
    </a>
  );
}

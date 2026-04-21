"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WarningGraphic } from "@/components/ui/warning-graphic";

const STORAGE_KEY = "legacyImportantNoticeSeen";

export function ImportantNoticePopup() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const closePopup = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = window.setTimeout(() => setOpen(true), 0);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closePopup]);

  return (
    <div
      className={`popup-overlay${open ? " active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-labelledby="important-notice-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePopup();
      }}
    >
      <div className="popup-modal">

        <button
          ref={closeBtnRef}
          type="button"
          className="popup-close"
          onClick={closePopup}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
          <WarningGraphic
            width={280}
            height={91}
            enableAnimations={true}
            animationSpeed={1.2}
          />
        </div>
        <h3 id="important-notice-title" className="popup-title">
    Important Notice
        </h3>
        <div className="popup-desc" style={{ textAlign: "left" }}>
          <p>
            <span style={{ fontWeight: "bold" }}>Risk Warning : </span> Forex trading involves significant risk. Approximately 70% of retail investors lose money. Never invest funds you cannot afford to lose.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>No Third-Party Endorsements : </span> Legacy GlobalBank does not authorize, endorse, or partner with any third-party fund managers or external investment schemes. We do not guarantee fixed returns or assured income on any products.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Verify Your Communication : </span> Protect your data. All official communications must be verified through our official channels. Report any suspicious or unauthorized investment offers to our security team immediately.
          </p>
        </div>

        <button type="button" className="popup-cta" onClick={closePopup}>
          I Understand
        </button>
      </div>
    </div>
  );
}

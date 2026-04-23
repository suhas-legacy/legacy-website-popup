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
            <span style={{ fontWeight: "bold" }}>Risk Warning : </span> Your captial is at risk. Leveraged products may not be sutiable for everyone.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>No Guaranteed Returns : </span> No fixed returns or authorized third-party managers.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>No External Fund Collection : </span> Funds accepted only via our official platform. Others = fraud.
          </p>

          <p>
            <span style={{ fontWeight: "bold" }}>Verify Communications : </span> Use official channels only. Report anything suspicious.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Account Security : </span> You are responsible for your account and data safety.
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Limitation of Liability:  </span> We are not liable for trading losses or third-party actions.
          </p>
        </div>

        <button type="button" className="popup-cta" onClick={closePopup}>
          I Understand
        </button>
      </div>
    </div>
  );
}

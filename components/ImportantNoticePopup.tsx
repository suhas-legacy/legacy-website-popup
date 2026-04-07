"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle } from 'lucide-react';

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
        <style jsx>{`
          .popup-badge {
            background: #dc2626;
            color: #ffffff;
            border-radius: 9999px;
            width: 44px;
            height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            animation: legacy-alert-blink 1s infinite;
          }

          @keyframes legacy-alert-blink {
            0%,
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 rgba(220, 38, 38, 0);
              filter: brightness(1);
            }
            50% {
              transform: scale(1.06);
              box-shadow: 0 0 0.75rem rgba(220, 38, 38, 0.55);
              filter: brightness(1.1);
            }
          }
        `}</style>
        <button
          ref={closeBtnRef}
          type="button"
          className="popup-close"
          onClick={closePopup}
          aria-label="Close"
        >
          ×
        </button>

        <div className="popup-badge">
          <AlertTriangle size={20} />
          
        </div>
        <h3 id="important-notice-title" className="popup-title">
          Important Notice
        </h3>
        <div className="popup-desc" style={{ textAlign: "left" }}>
          <p>
            Legacy GlobalBank does not offer, authorize, or endorse any third-party
            fund managers, investment schemes, or external financial services.
          </p>
          <p style={{ marginTop: "0.9rem" }}>
            We do not guarantee fixed returns, assured income, or interest on any
            investment products.
          </p>
          <p style={{ marginTop: "0.9rem" }}>
            Clients are strongly advised to remain vigilant against fraud and
            unauthorized communications. Any message claiming to represent Legacy
            GlobalBank must be verified through our official communication
            channels.
          </p>
          <p style={{ marginTop: "0.9rem" }}>
            If you receive suspicious information, please report it immediately to
            protect your account and personal data.
          </p>
        </div>

        <button type="button" className="popup-cta" onClick={closePopup}>
          I Understand
        </button>
      </div>
    </div>
  );
}

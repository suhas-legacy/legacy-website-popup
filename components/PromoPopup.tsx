"use client";

import { useCallback, useEffect, useState } from "react";
import { PANEL_URL } from "@/lib/constants";

const STORAGE_KEY = "legacyPopupSeen";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = window.setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setTimeLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  const closePopup = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
  }, []);

  const copyCoupon = useCallback(() => {
    const code = "LEGACY50";
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div
      id="promo-popup"
      className={`popup-overlay${open ? " active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePopup();
      }}
    >
      <div className="popup-modal">
        <button
          type="button"
          className="popup-close"
          onClick={closePopup}
          aria-label="Close"
        >
          ×
        </button>
        <div className="popup-badge">LIMITED TIME OFFER</div>
        <h3 className="popup-title">🎁 Get 50% Bonus</h3>
        <p className="popup-desc">
          On your first deposit! Use coupon code below:
        </p>
        <div className="popup-coupon">
          <code id="coupon-code">LEGACY50</code>
          <button
            type="button"
            className={`popup-copy${copied ? " copied" : ""}`}
            onClick={copyCoupon}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="popup-timer">
          <span className="timer-hurry">⚡ HURRY! Offer ends in:</span>
          <div className="timer-display" id="popup-timer">
            {formatTime(timeLeft)}
          </div>
        </div>
        <a href={PANEL_URL} className="popup-cta">
          Claim Now
        </a>
        <p className="popup-note">Don&apos;t miss out - limited spots available!</p>
      </div>
    </div>
  );
}

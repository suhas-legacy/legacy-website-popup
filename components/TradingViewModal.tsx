"use client";

import { useEffect, useId } from "react";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

function loadTradingViewScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.TradingView) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const src = "https://s3.tradingview.com/tv.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("TradingView script failed")),
        { once: true }
      );
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("TradingView script failed"));
    document.head.appendChild(s);
  });
}

type TradingViewModalProps = {
  open: boolean;
  onClose: () => void;
  symbol: string;
  title: string;
  subtitle?: string;
};

export function TradingViewModal({
  open,
  onClose,
  symbol,
  title,
  subtitle,
}: TradingViewModalProps) {
  const rawId = useId();
  const containerId = `tv_embed_${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    if (!open || !symbol) return;

    const el = document.getElementById(containerId);
    if (!el) return;

    let cancelled = false;
    el.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-family:var(--font-jetbrains-mono),monospace;font-size:0.65rem;letter-spacing:0.15em;">Loading chart…</div>';

    loadTradingViewScript()
      .then(() => {
        if (cancelled || !window.TradingView) return;
        el.innerHTML = "";
        try {
          new window.TradingView.widget({
            autosize: true,
            symbol,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            hide_side_toolbar: false,
            save_image: false,
            container_id: containerId,
            height: "100%",
            width: "100%",
          });
        } catch {
          el.innerHTML =
            '<p style="color:#888;padding:2rem;text-align:center;">Chart could not be loaded.</p>';
        }
      })
      .catch(() => {
        if (!cancelled && el)
          el.innerHTML =
            '<p style="color:#888;padding:2rem;text-align:center;">Unable to load TradingView.</p>';
      });

    return () => {
      cancelled = true;
      if (el) el.innerHTML = "";
    };
  }, [open, symbol, containerId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="tv-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="tv-modal">
        <div className="tv-modal-header">
          <div>
            <h2 id="tv-modal-heading" className="tv-modal-title">
              {title}
            </h2>
            <p className="tv-modal-sub">{subtitle ?? symbol}</p>
          </div>
          <button
            type="button"
            className="tv-modal-close"
            onClick={onClose}
            aria-label="Close chart"
          >
            ×
          </button>
        </div>
        <div id={containerId} className="tv-modal-chart" />
        <p className="tv-modal-hint">
          Live data via TradingView · Click outside or press Esc to close
        </p>
      </div>
    </div>
  );
}

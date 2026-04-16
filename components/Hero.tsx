"use client";

import React, { useEffect, useRef, useState } from "react";
import { ThreeBackground } from "./ThreeBackground";

function useCountUp(end: number, durationMs: number, startWhen = true) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!startWhen || started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - (1 - p) ** 3;
      setVal(Math.floor(end * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, durationMs, startWhen]);

  return val;
}

export const Hero = React.memo(function Hero() {
  const traders = useCountUp(10000, 2200);

  return (
    <section id="hero">
      <ThreeBackground />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-h1">
        {/* TRADE THE WORLD */}
          <span className="hero-word hero-word-build">TRADE</span>{" "}
          <span className="hero-word hero-word-your">THE</span>{" "}
          <span className="hero-word hero-word-legacy">WORLD.</span>
          <br />
          <span className="gold-line">BUILD YOUR EMPIRE.</span>
        </h1>
        <p className="hero-sub">
          Your gateway to global financial markets — Forex, Stocks, Crypto,
          Commodities, Indices &amp; more. Up to 1:500 leverage.
        </p>
        <div className="hero-btns">
          <a href="/accounts" className="btn-gold">
            Open Live Account
          </a>
          <a href="/demo" className="btn-outline">
            Try Demo — $10,000 Free
          </a>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-num">{traders.toLocaleString()}</div>
          <div className="stat-label">Active Traders</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">1:500</div>
          <div className="stat-label">Max Leverage</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">500+</div>
          <div className="stat-label">Trading Assets</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </div>
    </section>
  );
});

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroStats } from "./HeroStats";

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
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-h1 ">
            <span className="hero-word hero-word-build">TRADE</span>{" "}
            <span className="hero-word hero-word-your">THE</span>{" "}
            <span className="hero-word hero-word-legacy">WORLD.</span>
            <span className="hero-subtitle">BEGIN YOUR TRADING JOURNEY.</span>
          </h1>
          <div className="hero-btns">
            <a href="/accounts" className="btn-gold">
              Create Account
            </a>
            <a href="/demo" className="btn-outline">
              Try Demo — $10,000 Free
            </a>
          </div>
          <HeroStats traders={traders} />
        </div>
        <div className="hero-video-side">
          <Image
            src="/home_svg_1.svg"
            alt="Trading illustration"
            width={500}
            height={500}
            priority
            className="hero-svg-element"
          />
        </div>
      </div>
    </section>
  );
});


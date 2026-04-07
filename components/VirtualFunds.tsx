"use client";

import { useEffect, useRef } from "react";
import { PANEL_URL_REGISTER } from "@/lib/constants";

const TARGETS = [1, 0, 0, 0, 0];

function DigitStrip({
  id,
  stripRef,
}: {
  id: string;
  stripRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="counter-slot">
      <div className="counter-digit-strip" id={id} ref={stripRef}>
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="counter-digit">
            {i % 10}
          </span>
        ))}
      </div>
    </div>
  );
}

export function VirtualFunds() {
  const stripsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const strips = stripsRef.current;

    const getDigitHeight = () => {
      const first = strips[0]?.querySelector(".counter-digit");
      return first ? (first as HTMLElement).offsetHeight || 80 : 80;
    };

    const rollToDigit = (
      el: HTMLDivElement,
      targetDigit: number,
      delay: number
    ) => {
      const h = getDigitHeight();
      const totalSpins = 2;
      const finalOffset = -(targetDigit + totalSpins * 10) * h;
      window.setTimeout(() => {
        el.style.transform = `translateY(${finalOffset}px)`;
      }, delay);
    };

    const runRoll = (stagger: number) => {
      strips.forEach((strip, i) => {
        if (strip) rollToDigit(strip, TARGETS[i], i * stagger);
      });
    };

    const resetAndRoll = () => {
      strips.forEach((strip) => {
        if (strip) {
          strip.style.transition = "none";
          strip.style.transform = "translateY(0)";
        }
      });
      window.setTimeout(() => {
        strips.forEach((strip) => {
          if (strip)
            strip.style.transition =
              "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        });
        runRoll(150);
      }, 50);
    };

    const t = window.setTimeout(() => runRoll(200), 300);
    const interval = window.setInterval(resetAndRoll, 6000);

    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    stripsRef.current[index] = el;
  };

  return (
    <section id="virtual">
      <div className="section-label" style={{ justifyContent: "center" }}>
        Demo Account
      </div>
      <h2 className="vf-title reveal">
        Trade Live Charts With
        <br />
        <span className="gold-text">Virtual Funds</span>
      </h2>

      <div className="counter-machine reveal">
        <div className="counter-row">
          <span className="counter-digit">$</span>
          {["d1", "d2", "d3", "d4", "d5"].map((id, i) => (
            <DigitStrip key={id} id={id} stripRef={setRef(i)} />
          ))}
        </div>
      </div>

      <div className="vf-features reveal">
        <div className="vf-feat">
          <div className="check">✓</div> $10,000 preloaded in your demo account
        </div>
        <div className="vf-feat">
          <div className="check">✓</div> Unlimited balance refills at any time
        </div>
        <div className="vf-feat">
          <div className="check">✓</div> Real market conditions, zero risk
        </div>
        <div className="vf-feat">
          <div className="check">✓</div> Switch to live account anytime
        </div>
      </div>

      <a
        href={PANEL_URL_REGISTER}
        className="btn-gold reveal"
        style={{
          fontSize: "0.85rem",
          padding: "1rem 3rem",
          display: "inline-block",
        }}
      >
        Try Demo Account Free
      </a>
    </section>
  );
}

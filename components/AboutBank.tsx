"use client";

import React from "react";
import Image from "next/image";

export function AboutBank() {
  return (
    <section id="about-bank" className="about-bank-section">
      <div className="about-bank-container">
        <div className="about-bank-content reveal reveal-delay-2">
          <div className="section-label">Legacy Global Bank</div>
          <h2 className="section-title">
            The Future of <span className="gold-text">Global Finance</span>
          </h2>
          <p className="about-bank-desc">
            As a leading tier-1 regulated banking and brokerage institution, Legacy Global Bank integrates next-generation financial technology with institutional stability. We empower traders in 180+ countries with deep liquidity, tight spreads, and direct access to global markets.
          </p>
          
          <div className="about-bank-pillars">
            <div className="pillar-item">
              <div className="pillar-icon">🏛️</div>
              <div className="pillar-text">
                <h3>Tier-1 Regulated Security</h3>
                <p>Client funds are fully segregated and held in top-tier global banking institutions under strict international regulations.</p>
              </div>
            </div>
            
            <div className="pillar-item">
              <div className="pillar-icon">🛡️</div>
              <div className="pillar-text">
                <h3>Institutional Liquidity</h3>
                <p>Direct connectivity to deep institutional liquidity hubs, facilitating ultra-low latency and execution speeds below 12ms.</p>
              </div>
            </div>
          </div>
          
          <div className="about-bank-cta">
            <a href="/accounts" className="btn-gold">Open Corporate Account</a>
            <a href="/why-us" className="btn-outline">Our Credentials</a>
          </div>
        </div>
        
        <div className="about-bank-media reveal">
          <div className="glow-backdrop"></div>
          <Image
            src="/home6.svg"
            alt="Legacy Global Bank Network"
            width={600}
            height={600}
            priority
            className="about-bank-svg"
          />
        </div>
      </div>
    </section>
  );
}

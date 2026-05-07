import React from "react";

interface HeroStatsProps {
  traders: number;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ traders }) => (
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
);

export default HeroStats;
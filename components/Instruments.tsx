export function Instruments() {
  return (
    <section id="instruments">
      <div className="section-label reveal">Markets</div>
      <h2 className="section-title reveal">
        What You Can <span className="gold-text">Trade</span>
      </h2>
      <div className="inst-grid">
        <div className="inst-card reveal reveal-delay-1">
          <span className="inst-icon">💱</span>
          <div className="inst-name">Forex</div>
          <div className="inst-desc">50+ currency pairs with tight spreads</div>
        </div>
        <div className="inst-card reveal reveal-delay-2">
          <span className="inst-icon">🛢️</span>
          <div className="inst-name">Commodities</div>
          <div className="inst-desc">Oil, Gas, Agricultural products</div>
        </div>
        <div className="inst-card reveal reveal-delay-3">
          <span className="inst-icon">📊</span>
          <div className="inst-name">Indices</div>
          <div className="inst-desc">S&amp;P 500, NASDAQ, DAX &amp; more</div>
        </div>
        <div className="inst-card reveal reveal-delay-4">
          <span className="inst-icon">₿</span>
          <div className="inst-name">Crypto</div>
          <div className="inst-desc">BTC, ETH, and top altcoins</div>
        </div>
        <div className="inst-card reveal">
          <span className="inst-icon">🥇</span>
          <div className="inst-name">Metals</div>
          <div className="inst-desc">Gold, Silver, Platinum trading</div>
        </div>
      </div>
    </section>
  );
}

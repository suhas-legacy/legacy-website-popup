export function Steps() {
  return (
    <section id="steps">
      <div className="section-label" style={{ justifyContent: "center" }}>
        Get Started
      </div>
      <h2 className="section-title reveal">
        Start Trading in <span className="gold-text">4 Simple Steps</span>
      </h2>
      <div className="steps-row">
        <div className="step-item reveal reveal-delay-1">
          <div className="step-num">1</div>
          <div className="step-title">Register</div>
          <p className="step-desc">Create your account in under 2 minutes</p>
        </div>
        <div className="step-item reveal reveal-delay-2">
          <div className="step-num">2</div>
          <div className="step-title">Verify</div>
          <p className="step-desc">Complete KYC with your documents</p>
        </div>
        <div className="step-item reveal reveal-delay-3">
          <div className="step-num">3</div>
          <div className="step-title">Fund</div>
          <p className="step-desc">Deposit using your preferred payment method</p>
        </div>
        <div className="step-item reveal reveal-delay-4">
          <div className="step-num">4</div>
          <div className="step-title">Trade</div>
          <p className="step-desc">Start trading 500+ global instruments</p>
        </div>
      </div>
    </section>
  );
}

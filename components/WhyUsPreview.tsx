import Link from "next/link";

export function WhyUsPreview() {
  const features = [
    {
      icon: "⚡",
      title: "Advanced Platform",
      desc: "Lightning execution, 50+ indicators",
    },
    {
      icon: "🔒",
      title: "Secure Trading",
      desc: "256-bit encryption protects every trade",
    },
    {
      icon: "🌐",
      title: "24/7 Support",
      desc: "Expert team in multiple languages",
    },
    {
      icon: "🎓",
      title: "Educational Resources",
      desc: "Webinars, market analysis & guides",
    },
  ];

  return (
    <section className="why-preview-section">
      <div className="section-label reveal">Why Choose Us</div>
      <h2 className="section-title reveal">
        The <span className="gold-text">Legacy Advantage</span>
      </h2>
      
      <div className="why-grid">
        {features.map((feature, index) => (
          <div key={feature.title} className={`why-card reveal reveal-delay-${index + 1}`}>
            <span className="why-icon">{feature.icon}</span>
            <div className="why-title">{feature.title}</div>
            <p className="why-desc">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="preview-cta reveal">
        <Link href="/why-us" className="btn-outline">
          Learn More →
        </Link>
      </div>
    </section>
  );
}

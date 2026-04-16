import Link from "next/link";

const items = [
  {
    text: "Legacy Global Bank changed how I trade. The platform is incredibly fast, and the spreads are some of the best I've seen. Highly recommended!",
    initials: "RK",
    name: "Rajesh Kumar",
    loc: "📍 Delhi, India",
  },
  {
    text: "The withdrawal process is super smooth. Got my funds within 12 hours. The 24/7 support team is always there when I need them.",
    initials: "AM",
    name: "Ahmed Mohammed",
    loc: "📍 Dubai, UAE",
  },
];

export function TestimonialsPreview() {
  return (
    <section className="testimonials-preview-section">
      <div className="section-label reveal">Testimonials</div>
      <h2 className="section-title reveal">
        What Our <span className="gold-text">Traders Say</span>
      </h2>
      
      <div className="testi-grid">
        {items.map((t, index) => (
          <div key={t.name} className={`testi-card reveal reveal-delay-${index + 1}`}>
            <div className="testi-quote">&quot;</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-author">
              <div className="testi-avatar">{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-loc">{t.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="preview-cta reveal">
        <Link href="/testimonials" className="btn-outline">
          Read All Reviews →
        </Link>
      </div>
    </section>
  );
}

const items = [
  {
    text: "Legacy Global Bank changed how I trade. The platform is incredibly fast, and the spreads are some of the best I've seen. Highly recommended!",
    initials: "RK",
    name: "Rajesh Kumar",
    loc: "📍 Delhi, India",
    delay: "reveal-delay-1",
  },
  {
    text: "The withdrawal process is super smooth. Got my funds within 12 hours. The 24/7 support team is always there when I need them.",
    initials: "AM",
    name: "Ahmed Mohammed",
    loc: "📍 Dubai, UAE",
    delay: "reveal-delay-2",
  },
  {
    text: "Started with the demo account and was so impressed I went live within a week. Best trading platform I've used in my 5 years of trading.",
    initials: "PS",
    name: "Priya Sharma",
    loc: "📍 Coimbatore, Tamil Nadu",
    delay: "reveal-delay-3",
  },
  {
    text: "The VIP account is worth every penny. Zero pip spreads on major pairs and dedicated account management make a huge difference.",
    initials: "MR",
    name: "Mohammed Rashid",
    loc: "📍 Charminar, Hyderabad",
    delay: "reveal-delay-1",
  },
  {
    text: "As a beginner the educational resources helped me understand forex trading. The team in Biaora is very supportive and professional.",
    initials: "SK",
    name: "Suresh Kumar",
    loc: "📍 Biaora, Madhya Pradesh",
    delay: "reveal-delay-2",
  },
  {
    text: "Excellent platform for crypto trading. The charts are detailed and the execution is flawless. Legacy Global Bank is my go-to broker.",
    initials: "VN",
    name: "Vijay Nair",
    loc: "📍 Udupi, Karnataka",
    delay: "reveal-delay-3",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials">
      <div className="section-label reveal">Testimonials</div>
      <h2 className="section-title reveal">
        What Our <span className="gold-text">Traders Say</span>
      </h2>
      <div className="testi-grid">
        {items.map((t) => (
          <div key={t.name} className={`testi-card reveal ${t.delay}`}>
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
    </section>
  );
}

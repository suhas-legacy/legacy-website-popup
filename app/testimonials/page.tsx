import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

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
  {
    text: "Started with the demo account and was so impressed I went live within a week. Best trading platform I've used in my 5 years of trading.",
    initials: "PS",
    name: "Priya Sharma",
    loc: "📍 Coimbatore, Tamil Nadu",
  },
  {
    text: "The VIP account is worth every penny. Zero pip spreads on major pairs and dedicated account management make a huge difference.",
    initials: "MR",
    name: "Mohammed Rashid",
    loc: "📍 Charminar, Hyderabad",
  },
  {
    text: "As a beginner the educational resources helped me understand forex trading. The team in Biaora is very supportive and professional.",
    initials: "SK",
    name: "Suresh Kumar",
    loc: "📍 Biaora, Madhya Pradesh",
  },
  {
    text: "Excellent platform for crypto trading. The charts are detailed and the execution is flawless. Legacy Global Bank is my go-to broker.",
    initials: "VN",
    name: "Vijay Nair",
    loc: "📍 Udupi, Karnataka",
  },
];

export const metadata: Metadata = {
  title: "Trader Reviews & Testimonials | Legacy Global Bank",
  description:
    "Read real reviews from Legacy Global Bank traders across India, UAE, and beyond. See why thousands trust us for forex, crypto, and CFD trading.",
  openGraph: {
    title: "Trader Reviews & Testimonials | Legacy Global Bank",
    description:
      "Read real reviews from Legacy Global Bank traders across India, UAE, and beyond. See why thousands trust us for forex, crypto, and CFD trading.",
    url: "https://legacyglobalbank.com/testimonials",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/testimonials",
  },
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Legacy Global Bank Trading Platform",
  image: "https://legacyglobalbank.com/logo.svg",
  description:
    "Legacy Global Bank is a leading forex and CFD trading platform offering secure trading, lightning-fast execution, and 24/7 multilingual support.",
  brand: {
    "@type": "Brand",
    name: "Legacy Global Bank",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "6",
    bestRating: "5",
    worstRating: "1",
  },
  review: items.map((item) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: item.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    reviewBody: item.text,
  })),
};

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={reviewSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Testimonials" />
          <h1 className="page-title">
            What our <span className="gold-text">traders say</span>
          </h1>
          <div className="testi-grid">
            {items.map((t) => (
              <div key={t.name} className="testi-card">
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
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Trading Support | Legacy Global Bank",
  description:
    "Get in touch with Legacy Global Bank's sales, support, or technical team. We're available 24/7 to help you with your trading account.",
  openGraph: {
    title: "Contact Us | Trading Support | Legacy Global Bank",
    description:
      "Get in touch with Legacy Global Bank's sales, support, or technical team. We're available 24/7 to help you with your trading account.",
    url: "https://legacyglobalbank.com/contact",
  },
  alternates: {
    canonical: "https://legacyglobalbank.com/contact",
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Legacy Global Bank",
    image: "https://legacyglobalbank.com/logo.svg",
    email: "support@legacyglobalbank.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "LC",
      addressRegion: "Saint Lucia",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-234-567-890",
        contactType: "sales",
        availableLanguage: ["English", "Hindi", "Arabic"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-234-567-890",
        contactType: "technical support",
        availableLanguage: ["English", "Hindi", "Arabic"],
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Contact" />
          <h1 className="page-title">
            Get in touch with <span className="gold-text">our team</span>
          </h1>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

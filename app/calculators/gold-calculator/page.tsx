import { Metadata } from "next";
import { GoldCalculatorClient } from "./GoldCalculatorClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gold Price Calculator India 2026: Compare Physical Gold vs XAUUSD Live",
    description: "Compare live XAUUSD gold price with Indian physical gold cost including making charges and 3% GST. Calculate exact difference in USD & INR. Best gold investment calculator for India.",
    keywords: "gold price today india, xauusd live, physical gold vs paper gold, 22k gold calculator, gold investment comparison india, gold making charges calculator, usd to inr gold",
    openGraph: {
      title: "Gold Price Calculator India 2026: Compare Physical Gold vs XAUUSD Live",
      description: "Compare live XAUUSD gold price with Indian physical gold cost including making charges and 3% GST. Calculate exact difference in USD & INR.",
      type: "website",
      url: "https://legacyglobalbank.com/calculators/gold-calculator",
      siteName: "Legacy Global Bank",
    },
    twitter: {
      card: "summary_large_image",
      title: "Gold Price Calculator India 2026: Compare Physical Gold vs XAUUSD Live",
      description: "Compare live XAUUSD gold price with Indian physical gold cost including making charges and 3% GST.",
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/calculators/gold-calculator",
    },
  };
}

export default function GoldCalculatorPage() {
  return <GoldCalculatorClient />;
}

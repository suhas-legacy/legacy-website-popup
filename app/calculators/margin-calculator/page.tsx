import { Metadata } from "next";
import { MarginCalculatorClient } from "./MarginCalculatorClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forex Margin Calculator – Free Margin Requirement Calculator | Legacy Global Bank",
    description: "Calculate forex margin requirements instantly with our free margin calculator. Get accurate margin calculations for any currency pair, lot size, and leverage. Essential for risk management.",
    keywords: "forex margin calculator, margin requirement calculator, forex leverage calculator, calculate margin, forex margin formula, trading margin calculator, position margin, free margin calculator",
    openGraph: {
      title: "Forex Margin Calculator – Free Margin Requirement Calculator",
      description: "Calculate forex margin requirements instantly with our free margin calculator. Get accurate margin calculations for any currency pair, lot size, and leverage.",
      type: "website",
      url: "https://legacyglobalbank.com/calculators/margin-calculator",
      siteName: "Legacy Global Bank",
      images: [
        {
          url: "/og-margin-calculator.png",
          width: 1200,
          height: 630,
          alt: "Forex Margin Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Margin Calculator – Free Margin Requirement Calculator",
      description: "Calculate forex margin requirements instantly with our free margin calculator. Get accurate margin calculations for any currency pair, lot size, and leverage.",
      images: ["/og-margin-calculator.png"],
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/calculators/margin-calculator",
    },
  };
}

export default function MarginCalculatorPage() {
  return <MarginCalculatorClient />;
}

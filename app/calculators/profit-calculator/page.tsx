import { Metadata } from "next";
import { ProfitCalculatorClient } from "./ProfitCalculatorClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forex Profit Calculator – Free Trading Profit/Loss Calculator | Legacy Global Bank",
    description: "Calculate forex trading profits and losses instantly with our free profit calculator. Get accurate profit/loss calculations for any currency pair, entry/exit prices, and lot size.",
    keywords: "forex profit calculator, forex profit loss calculator, calculate forex profit, trading profit calculator, forex pips profit, currency pair profit calculator, forex trading calculator, profit loss calculator",
    openGraph: {
      title: "Forex Profit Calculator – Free Trading Profit/Loss Calculator",
      description: "Calculate forex trading profits and losses instantly with our free profit calculator. Get accurate profit/loss calculations for any currency pair.",
      type: "website",
      url: "https://legacyglobalbank.com/calculators/profit-calculator",
      siteName: "Legacy Global Bank",
      images: [
        {
          url: "/og-profit-calculator.png",
          width: 1200,
          height: 630,
          alt: "Forex Profit Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Profit Calculator – Free Trading Profit/Loss Calculator",
      description: "Calculate forex trading profits and losses instantly with our free profit calculator. Get accurate profit/loss calculations for any currency pair.",
      images: ["/og-profit-calculator.png"],
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/calculators/profit-calculator",
    },
  };
}

export default function ProfitCalculatorPage() {
  return <ProfitCalculatorClient />;
}

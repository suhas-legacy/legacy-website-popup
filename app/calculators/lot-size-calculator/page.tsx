import { Metadata } from "next";
import { LotSizeCalculatorClient } from "./LotSizeCalculatorClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forex Lot Size Calculator – Free Position Size Calculator | Legacy Global Bank",
    description: "Calculate optimal forex lot size instantly with our free position size calculator. Get accurate lot size recommendations based on account balance, risk percentage, and stop loss. Essential for risk management.",
    keywords: "forex lot size calculator, position size calculator, forex position sizing, calculate lot size, risk management calculator, forex risk calculator, lot size formula, position size calculator forex",
    openGraph: {
      title: "Forex Lot Size Calculator – Free Position Size Calculator",
      description: "Calculate optimal forex lot size instantly with our free position size calculator. Get accurate lot size recommendations based on account balance, risk percentage, and stop loss.",
      type: "website",
      url: "https://legacyglobalbank.com/calculators/lot-size-calculator",
      siteName: "Legacy Global Bank",
      images: [
        {
          url: "/og-lot-size-calculator.png",
          width: 1200,
          height: 630,
          alt: "Forex Lot Size Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Lot Size Calculator – Free Position Size Calculator",
      description: "Calculate optimal forex lot size instantly with our free position size calculator. Get accurate lot size recommendations based on account balance, risk percentage, and stop loss.",
      images: ["/og-lot-size-calculator.png"],
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/calculators/lot-size-calculator",
    },
  };
}

export default function LotSizeCalculatorPage() {
  return <LotSizeCalculatorClient />;
}

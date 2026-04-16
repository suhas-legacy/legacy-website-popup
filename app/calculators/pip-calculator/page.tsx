import { Metadata } from "next";
import { PipCalculatorClient } from "./PipCalculatorClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forex Pip Calculator – Free Real-Time Pip Value Calculator | Legacy Global Bank",
    description: "Calculate forex pip values instantly with our free pip calculator. Get accurate pip value in USD for any currency pair, lot size, and account currency. Real-time calculations for forex traders.",
    keywords: "forex pip calculator, pip value calculator, forex pip value, calculate pips, standard lot pip value, mini lot pip value, micro lot pip value, pip value in USD, how to calculate pips in forex",
    openGraph: {
      title: "Forex Pip Calculator – Free Real-Time Pip Value Calculator",
      description: "Calculate forex pip values instantly with our free pip calculator. Get accurate pip value in USD for any currency pair.",
      type: "website",
      url: "https://legacyglobalbank.com/calculators/pip-calculator",
      siteName: "Legacy Global Bank",
      images: [
        {
          url: "/og-pip-calculator.png",
          width: 1200,
          height: 630,
          alt: "Forex Pip Calculator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Pip Calculator – Free Real-Time Pip Value Calculator",
      description: "Calculate forex pip values instantly with our free pip calculator. Get accurate pip value in USD for any currency pair.",
      images: ["/og-pip-calculator.png"],
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/calculators/pip-calculator",
    },
  };
}

export default function PipCalculatorPage() {
  return <PipCalculatorClient />;
}

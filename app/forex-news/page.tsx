import { Metadata } from "next";
import { ForexNewsClient } from "./ForexNewsClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Forex Economic Calendar & Market News | Legacy Global Bank",
    description: "Stay ahead with live Forex economic calendar and market-moving news. Track high-impact events, forecasts, and previous data from Forex Factory. Trade with confidence.",
    keywords: "forex calendar, economic calendar, forex news, market news, forex factory, trading calendar, economic events, forex trading news",
    openGraph: {
      title: "Forex Economic Calendar & Market News | Legacy Global Bank",
      description: "Stay ahead with live Forex economic calendar and market-moving news. Track high-impact events, forecasts, and previous data from Forex Factory.",
      type: "website",
      url: "https://legacyglobalbank.com/forex-news",
      siteName: "Legacy Global Bank",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Economic Calendar & Market News | Legacy Global Bank",
      description: "Stay ahead with live Forex economic calendar and market-moving news. Track high-impact events, forecasts, and previous data from Forex Factory.",
    },
    alternates: {
      canonical: "https://legacyglobalbank.com/forex-news",
    },
  };
}

export default function ForexNewsPage() {
  return <ForexNewsClient />;
}

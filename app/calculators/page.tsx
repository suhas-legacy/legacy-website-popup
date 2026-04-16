import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calculator, TrendingUp, Shield, Target, Coins } from "lucide-react";

export const metadata = {
  title: "Free Forex Calculators - Pip, Profit, Margin & Lot Size Calculator",
  description: "Access our suite of free forex trading calculators. Calculate pip values, profit/loss, margin requirements, and optimal lot sizes with live market prices.",
};

export default function CalculatorsPage() {
  const calculators = [
    {
      title: "Pip Calculator",
      description: "Calculate pip values for forex pairs and commodities with live market prices. Determine how much each pip movement is worth in your account currency.",
      icon: <TrendingUp className="w-8 h-8" />,
      href: "/calculators/pip-calculator",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Profit Calculator",
      description: "Calculate potential profits and losses on your trades. Input your entry and exit prices to see pip movement and return on margin.",
      icon: <Calculator className="w-8 h-8" />,
      href: "/calculators/profit-calculator",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Margin Calculator",
      description: "Determine required margin for your trades. Calculate margin requirements based on lot size, leverage, and current market prices.",
      icon: <Shield className="w-8 h-8" />,
      href: "/calculators/margin-calculator",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Lot Size Calculator",
      description: "Calculate optimal position size based on your risk tolerance. Use the 2% rule to determine the right lot size for your account.",
      icon: <Target className="w-8 h-8" />,
      href: "/calculators/lot-size-calculator",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Gold Price Calculator",
      description: "Compare live XAUUSD gold price with Indian physical gold cost including making charges and 3% GST. Calculate the exact difference in USD & INR.",
      icon: <Coins className="w-8 h-8" />,
      href: "/calculators/gold-calculator",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 mt-6">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Free Trading Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Forex Trading Calculators
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Professional-grade trading calculators with live market data. Calculate pip values, 
              profit/loss, margin requirements, and optimal position sizes for forex pairs and commodities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {calculators.map((calc, index) => (
              <a
                key={index}
                href={calc.href}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-400/50 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${calc.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {calc.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
                  {calc.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-6 flex items-center text-amber-400 text-sm font-medium">
                  Open Calculator
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Why Use Our Calculators?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold">Live Market Data</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  All calculators use real-time market prices updated every 30 seconds for accurate calculations.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-semibold">Free to Use</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  All calculators are completely free with no sign-up required. Use them as often as you need.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-semibold">Multi-Instrument</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Support for forex pairs (EUR/USD, GBP/USD, USD/JPY) and commodities (Gold, Silver, Oil).
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="font-semibold">Risk Management</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Built-in risk management features like the 2% rule to help protect your trading capital.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-rose-400" />
                  </div>
                  <h3 className="font-semibold">Instant Results</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Get instant calculations as you type. No waiting, no delays - just immediate results.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold">Share & Export</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Easily share calculator results or copy them to your clipboard for documentation.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">Are these calculators free to use?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Yes, all our forex calculators are completely free to use with no sign-up or registration required.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">How often are market prices updated?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Market prices are updated every 30 seconds from live market data sources. You can also manually refresh prices using the refresh button in each calculator.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">Which instruments are supported?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Our calculators support major forex pairs (EUR/USD, GBP/USD, USD/JPY) as well as commodities including Gold (XAU/USD), Silver (XAG/USD), WTI Oil, and Brent Oil.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

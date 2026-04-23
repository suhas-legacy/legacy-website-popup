"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalculatorLinks } from "@/components/CalculatorLinks";
import { Copy, Share2, Check, Info, Calculator, Shield, RefreshCw } from "lucide-react";
import { useCalculatorMarketData, CALCULATOR_INSTRUMENTS } from "@/lib/useCalculatorMarketData";

interface MarginCalculatorForm {
  instrumentId: string;
  lotSize: number;
  leverage: string;
  customLeverage: number;
  accountCurrency: string;
}

interface MarginResult {
  marginRequired: number;
  freeMarginImpact: number;
  maxLotsAtLeverage: number;
  contractSize: number;
  currentPrice: number;
}

const LEVERAGE_OPTIONS = [
  { value: "1:50", label: "1:50", multiplier: 50 },
  { value: "1:100", label: "1:100", multiplier: 100 },
  { value: "1:200", label: "1:200", multiplier: 200 },
  { value: "1:500", label: "1:500", multiplier: 500 },
  { value: "custom", label: "Custom", multiplier: 0 },
];

const ACCOUNT_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"];

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.26,
  JPY: 0.0067,
  CHF: 1.12,
  AUD: 0.65,
  CAD: 0.74,
  NZD: 0.61,
};

export function MarginCalculatorClient() {
  const { instruments, getInstrument, isLoading, lastUpdated, refetch } = useCalculatorMarketData();
  
  const [formData, setFormData] = useState<MarginCalculatorForm>({
    instrumentId: "eurusd",
    lotSize: 1.0,
    leverage: "1:100",
    customLeverage: 100,
    accountCurrency: "USD",
  });

  const [result, setResult] = useState<MarginResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  useEffect(() => {
    calculateMargin();
  }, [formData, instruments]);

  const calculateMargin = () => {
    const selectedInstrument = getInstrument(formData.instrumentId);
    if (!selectedInstrument) return;

    const price = selectedInstrument.price;
    let leverageMultiplier = 100;
    
    if (formData.leverage === "custom") {
      leverageMultiplier = formData.customLeverage;
    } else {
      leverageMultiplier = LEVERAGE_OPTIONS.find((l) => l.value === formData.leverage)?.multiplier || 100;
    }

    const marginRequiredInQuoteCurrency = (formData.lotSize * selectedInstrument.contractSize * price) / leverageMultiplier;

    const parts = selectedInstrument.symbol.split("/");
    const quoteCurrency = parts[1] || "USD";

    const accountRate = EXCHANGE_RATES[formData.accountCurrency] || 1;
    const quoteRate = EXCHANGE_RATES[quoteCurrency] || 1;
    const marginRequiredInAccountCurrency = marginRequiredInQuoteCurrency * (quoteRate / accountRate);

    const assumedBalance = 10000;
    const freeMarginImpact = assumedBalance - marginRequiredInAccountCurrency;
    const maxLotsAtLeverage = (assumedBalance * leverageMultiplier) / (selectedInstrument.contractSize * price * (quoteRate / accountRate));

    setResult({
      marginRequired: marginRequiredInAccountCurrency,
      freeMarginImpact,
      maxLotsAtLeverage,
      contractSize: selectedInstrument.contractSize,
      currentPrice: price,
    });
  };

  const handleInputChange = (field: keyof MarginCalculatorForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyResults = () => {
    if (!result) return;
    const selectedInstrument = getInstrument(formData.instrumentId);
    const leverageValue = formData.leverage === "custom" ? `1:${formData.customLeverage}` : formData.leverage;
    const text = `Margin Calculator Results:
Instrument: ${selectedInstrument?.label || formData.instrumentId}
Lot Size: ${formData.lotSize}
Leverage: ${leverageValue}
Account Currency: ${formData.accountCurrency}
Margin Required: $${result.marginRequired.toFixed(2)} ${formData.accountCurrency}
Free Margin Impact: $${result.freeMarginImpact.toFixed(2)} ${formData.accountCurrency}
Max Lots at Current Leverage: ${result.maxLotsAtLeverage.toFixed(2)}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCalculator = () => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      instrumentId: "eurusd",
      lotSize: 1.0,
      leverage: "1:100",
      customLeverage: 100,
      accountCurrency: "USD",
    });
  };

  const faqData = [
    {
      question: "What is margin in forex trading?",
      answer: "Margin is the amount of money required to open and maintain a leveraged trading position. It acts as a deposit or collateral that ensures you can cover potential losses. Margin requirements vary by instrument and leverage level.",
    },
    {
      question: "How do I calculate margin requirement?",
      answer: "Margin requirement is calculated using the formula: (Lot Size × Contract Size × Current Price) ÷ Leverage. For example, with 1 standard lot of EUR/USD at 1.0850 and 1:100 leverage, the margin required is approximately $1,085.",
    },
    {
      question: "What is the difference between margin and leverage?",
      answer: "Leverage is the ratio that amplifies your trading power (e.g., 1:100 means you control $100 for every $1 of margin). Margin is the actual amount of money you need to deposit to open that leveraged position.",
    },
    {
      question: "How does leverage affect margin requirements?",
      answer: "Higher leverage reduces margin requirements proportionally. At 1:100 leverage, you need 1% of the position value as margin. At 1:500 leverage, you only need 0.2%. However, higher leverage also increases risk.",
    },
    {
      question: "What is free margin?",
      answer: "Free margin is the amount of money in your account that is available to open new positions. It's calculated as: Equity - Used Margin. Free margin decreases as you open more positions.",
    },
    {
      question: "What happens if my margin level is too low?",
      answer: "If your margin level falls below the broker's maintenance requirement, you may receive a margin call. If it falls further, the broker may automatically close your positions (stop out) to prevent further losses.",
    },
    {
      question: "Do different instruments have different margin requirements?",
      answer: "Yes, different instruments have different prices and contract sizes, which affects margin requirements. Gold, Silver, and Oil have different contract sizes compared to forex pairs, affecting margin calculations.",
    },
    {
      question: "How can I reduce my margin requirements?",
      answer: "You can reduce margin requirements by trading smaller lot sizes, using lower leverage, or choosing instruments with lower prices. However, reducing margin shouldn't be the primary goal—focus on proper risk management.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Forex Margin Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free forex margin requirement calculator for traders. Calculate required margin for any forex pair or commodity with live market prices.",
    author: {
      "@type": "Organization",
      name: "Legacy Global Bank",
    },
  };

  const selectedInstrument = getInstrument(formData.instrumentId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Navbar />
      <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 mb-6">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Free Trading Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Forex Margin Calculator – Free Margin Requirement Calculator
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Calculate forex margin requirements instantly with our free margin calculator. 
              Get accurate margin calculations for forex pairs and commodities with live market prices.
            </p>
          </div>

          <CalculatorLinks currentPath="/calculators/margin-calculator" />

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Calculator Inputs</h2>
                <button
                  onClick={refetch}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Prices
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instrument
                  </label>
                  <select
                    value={formData.instrumentId}
                    onChange={(e) => handleInputChange("instrumentId", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    {CALCULATOR_INSTRUMENTS.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.label}
                      </option>
                    ))}
                  </select>
                  {selectedInstrument && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-gray-400">Current Price: </span>
                      <span className="text-white font-medium">{selectedInstrument.price.toFixed(selectedInstrument.price > 100 ? 2 : 4)}</span>
                    </div>
                  )}
                  <button
                    onMouseEnter={() => setShowTooltip("instrument")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "instrument" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      Select the trading instrument. Different instruments have different contract sizes affecting margin.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lot Size
                  </label>
                  <input
                    type="number"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange("lotSize", parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0.01"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <button
                    onMouseEnter={() => setShowTooltip("lot")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "lot" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      Standard lot = 1.0 (full contract size), Mini lot = 0.1, Micro lot = 0.01
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Leverage
                  </label>
                  <select
                    value={formData.leverage}
                    onChange={(e) => handleInputChange("leverage", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    {LEVERAGE_OPTIONS.map((lev) => (
                      <option key={lev.value} value={lev.value}>
                        {lev.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onMouseEnter={() => setShowTooltip("leverage")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "leverage" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      Higher leverage means lower margin requirements but higher risk. 1:100 is common for retail traders.
                    </div>
                  )}
                </div>

                {formData.leverage === "custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Leverage Ratio
                    </label>
                    <input
                      type="number"
                      value={formData.customLeverage}
                      onChange={(e) => handleInputChange("customLeverage", parseFloat(e.target.value) || 1)}
                      min="1"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Currency
                  </label>
                  <select
                    value={formData.accountCurrency}
                    onChange={(e) => handleInputChange("accountCurrency", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    {ACCOUNT_CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  <button
                    onMouseEnter={() => setShowTooltip("account")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "account" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      The base currency of your trading account. Margin will be displayed in this currency.
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={copyResults}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg px-4 py-3 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Results"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg px-4 py-3 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Margin Requirements</h2>
              
              {result && selectedInstrument && (
                <div className="space-y-6">
                  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <div className="text-sm text-gray-400 mb-2">Margin Required</div>
                    <div className="text-4xl font-bold text-emerald-400">
                      ${result.marginRequired.toFixed(2)} {formData.accountCurrency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Free Margin Impact</div>
                      <div className="text-xl font-bold text-amber-400">
                        ${result.freeMarginImpact.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Based on $10k balance</div>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Max Lots at Leverage</div>
                      <div className="text-xl font-bold text-white">
                        {result.maxLotsAtLeverage.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">With $10k balance</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>
                        A {formData.lotSize} lot position in {selectedInstrument.label} at {formData.leverage === "custom" ? `1:${formData.customLeverage}` : formData.leverage} requires ${result.marginRequired.toFixed(2)} {formData.accountCurrency} margin
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="text-xs text-gray-400 mb-2">Position Details</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Size:</span>
                        <span className="text-white font-medium">{result.contractSize.toLocaleString()} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Price:</span>
                        <span className="text-amber-400 font-medium">{result.currentPrice.toFixed(result.currentPrice > 100 ? 2 : 4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leverage Used:</span>
                        <span className="text-white font-medium">
                          {formData.leverage === "custom" ? `1:${formData.customLeverage}` : formData.leverage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white font-medium">{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Share this calculator</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={shareCalculator}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  {shareCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {shareCopied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out this free Forex Margin Calculator from Legacy Global Bank&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Facebook
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Example Margin Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Standard Lot @ 1:100</div>
                <div className="text-sm text-gray-400 mb-2">EUR/USD, 1.0 lot, 1:100 leverage</div>
                <div className="text-2xl font-bold text-emerald-400">$1,085.00</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Mini Lot @ 1:200</div>
                <div className="text-sm text-gray-400 mb-2">GBP/USD, 0.1 lot, 1:200 leverage</div>
                <div className="text-2xl font-bold text-emerald-400">$63.25</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Gold @ 1:100</div>
                <div className="text-sm text-gray-400 mb-2">XAU/USD, 1.0 lot, 1:100 leverage</div>
                <div className="text-2xl font-bold text-emerald-400">$2,330.50</div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Understanding Forex Margin Requirements</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Margin is a fundamental concept in forex trading that enables traders to control larger positions with smaller amounts of capital. 
                Our forex margin calculator helps you determine exactly how much margin is required for any trade, based on your chosen instrument, 
                lot size, and leverage setting. Understanding the forex margin formula is essential for effective risk management.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                The margin requirement formula is: (Lot Size × Contract Size × Current Price) ÷ Leverage. 
                For example, with 1 standard lot of EUR/USD at a price of 1.0850 and 1:100 leverage, the margin required is approximately $1,085. 
                This forex leverage calculator shows how higher leverage ratios reduce margin requirements proportionally.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Different instruments have different contract sizes. Forex pairs typically use 100,000 units per standard lot, 
                while Gold (XAU/USD) uses 100 troy ounces, Silver uses 5,000 troy ounces, and Oil uses 1,000 barrels per contract. 
                Our calculator automatically applies the correct contract size for each instrument.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Live market prices are updated every 30 seconds to ensure your margin calculations are based on current market conditions. 
                This is particularly important for commodities like Gold and Oil, which can be more volatile than currency pairs. 
                You can manually refresh prices by clicking the refresh button.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <details
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl group"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <span className="font-semibold text-white">{faq.question}</span>
                    <span className="text-amber-400 transform group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Related Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                href="/calculators/pip-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Pip Calculator</div>
                <div className="text-sm text-gray-400">Calculate pip values for any instrument and lot size</div>
              </a>
              <a
                href="/calculators/profit-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Profit Calculator</div>
                <div className="text-sm text-gray-400">Calculate potential profits and losses on trades</div>
              </a>
              <a
                href="/calculators/lot-size-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Lot Size Calculator</div>
                <div className="text-sm text-gray-400">Calculate optimal position size based on risk</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

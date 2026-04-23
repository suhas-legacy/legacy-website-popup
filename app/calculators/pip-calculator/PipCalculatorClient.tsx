"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalculatorLinks } from "@/components/CalculatorLinks";
import { Copy, Share2, Check, Info, Calculator, TrendingUp, RefreshCw } from "lucide-react";
import { useCalculatorMarketData, CALCULATOR_INSTRUMENTS } from "@/lib/useCalculatorMarketData";

interface PipCalculatorForm {
  instrumentId: string;
  lotSize: number;
  accountCurrency: string;
}

interface PipResult {
  pipValuePerPip: number;
  valueForStandardLot: number;
  valueForYourLotSize: number;
  pipSize: number;
  currentPrice: number;
}

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

export function PipCalculatorClient() {
  const { instruments, getInstrument, isLoading, lastUpdated, refetch } = useCalculatorMarketData();
  
  const [formData, setFormData] = useState<PipCalculatorForm>({
    instrumentId: "eurusd",
    lotSize: 1.0,
    accountCurrency: "USD",
  });

  const [result, setResult] = useState<PipResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  useEffect(() => {
    calculatePipValue();
  }, [formData, instruments]);

  const calculatePipValue = () => {
    const selectedInstrument = getInstrument(formData.instrumentId);
    if (!selectedInstrument) return;

    const pipSize = selectedInstrument.pipSize;
    const currentPrice = selectedInstrument.price;

    const pipValueInQuoteCurrency = pipSize * formData.lotSize * selectedInstrument.contractSize;

    const parts = selectedInstrument.symbol.split("/");
    const quoteCurrency = parts[1] || "USD";

    const accountRate = EXCHANGE_RATES[formData.accountCurrency] || 1;
    const quoteRate = EXCHANGE_RATES[quoteCurrency] || 1;
    const pipValueInAccountCurrency = pipValueInQuoteCurrency * (quoteRate / accountRate);

    setResult({
      pipValuePerPip: pipValueInAccountCurrency,
      valueForStandardLot: pipSize * 1 * selectedInstrument.contractSize * (quoteRate / accountRate),
      valueForYourLotSize: pipValueInAccountCurrency,
      pipSize,
      currentPrice,
    });
  };

  const handleInputChange = (field: keyof PipCalculatorForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyResults = () => {
    if (!result) return;
    const selectedInstrument = getInstrument(formData.instrumentId);
    const text = `Pip Value Calculator Results:
Instrument: ${selectedInstrument?.label || formData.instrumentId}
Current Price: ${result.currentPrice}
Lot Size: ${formData.lotSize}
Account Currency: ${formData.accountCurrency}
Pip Value per Pip: $${result.pipValuePerPip.toFixed(2)} ${formData.accountCurrency}
Value for Standard Lot: $${result.valueForStandardLot.toFixed(2)} ${formData.accountCurrency}
Value for Your Lot Size: $${result.valueForYourLotSize.toFixed(2)} ${formData.accountCurrency}`;
    
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
      accountCurrency: "USD",
    });
  };

  const faqData = [
    {
      question: "What is a pip in forex trading?",
      answer: "A pip (percentage in point) is the smallest price movement in forex trading. For most currency pairs, a pip is 0.0001, while for JPY pairs and commodities, it varies. Pips measure the change in value between two currencies or instruments.",
    },
    {
      question: "How do I calculate pip value?",
      answer: "Pip value is calculated using the formula: Pip Size × Lot Size × Contract Size. For forex pairs, the contract size is typically 100,000 units. For commodities like Gold, it's usually 100 troy ounces.",
    },
    {
      question: "What is the pip size for different instruments?",
      answer: "EUR/USD and GBP/USD have a pip size of 0.0001. USD/JPY has a pip size of 0.01. Gold (XAU/USD) typically uses 0.01, Silver (XAG/USD) uses 0.001, and Oil instruments use 0.01.",
    },
    {
      question: "How does lot size affect pip value?",
      answer: "Lot size directly multiplies your pip value. Standard lots have the full contract size, while mini and micro lots have fractions of it. Larger lot sizes mean each pip movement is worth more in your account currency.",
    },
    {
      question: "Why do different instruments have different contract sizes?",
      answer: "Different instruments have different contract sizes based on their trading conventions. Forex pairs typically use 100,000 units per standard lot, while Gold uses 100 troy ounces, Silver uses 5,000 troy ounces, and Oil uses 1,000 barrels per contract.",
    },
    {
      question: "Do live market prices affect pip value?",
      answer: "The pip value itself is determined by the pip size and lot size, not the current price. However, the current price is important for understanding the market context and for other calculations like profit and loss.",
    },
    {
      question: "How often are market prices updated?",
      answer: "Market prices are updated every 30 seconds from live market data sources. You can manually refresh the prices by clicking the refresh button in the calculator.",
    },
    {
      question: "Can I use this calculator for commodities?",
      answer: "Yes, this calculator supports forex pairs (EUR/USD, GBP/USD, USD/JPY) as well as commodities like Gold (XAU/USD), Silver (XAG/USD), and Oil (WTI and Brent). Each instrument has its own pip size and contract size.",
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
    name: "Forex Pip Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free forex pip value calculator for traders. Calculate pip values for forex pairs and commodities with live market prices.",
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
              Forex Pip Calculator – Free Real-Time Pip Value Calculator
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Calculate forex pip values instantly with our free pip calculator. 
              Get accurate pip value for forex pairs and commodities with live market prices.
            </p>
          </div>

          <CalculatorLinks currentPath="/calculators/pip-calculator" />

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Trade Parameters</h2>
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
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
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
                      Select the trading instrument. Prices are updated live from market data.
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
                      The base currency of your trading account. Pip values will be converted to this currency.
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
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Pip Value Results</h2>
              
              {result && selectedInstrument && (
                <div className="space-y-6">
                  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <div className="text-sm text-gray-400 mb-2">Pip Value per Pip</div>
                    <div className="text-4xl font-bold text-emerald-400">
                      ${result.pipValuePerPip.toFixed(2)} {formData.accountCurrency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Value for Standard Lot</div>
                      <div className="text-xl font-bold text-white">
                        ${result.valueForStandardLot.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Current Price</div>
                      <div className="text-xl font-bold text-amber-400">
                        {result.currentPrice.toFixed(result.currentPrice > 100 ? 2 : 4)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        Each pip movement in {selectedInstrument.label} is worth ${result.pipValuePerPip.toFixed(2)} {formData.accountCurrency} at {formData.lotSize} lot size
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="text-xs text-gray-400 mb-2">Instrument Details</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instrument:</span>
                        <span className="text-white font-medium">{selectedInstrument.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pip Size:</span>
                        <span className="text-white font-medium">{result.pipSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Size:</span>
                        <span className="text-white font-medium">{selectedInstrument.contractSize.toLocaleString()} units</span>
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
                  href={`https://twitter.com/intent/tweet?text=Check out this free Forex Pip Calculator from Legacy Global Bank&url=${encodeURIComponent(currentUrl)}`}
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
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Example Pip Value Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">EUR/USD Standard Lot</div>
                <div className="text-sm text-gray-400 mb-2">1.0 lot, 0.0001 pip size</div>
                <div className="text-2xl font-bold text-emerald-400">$10.00</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Gold (XAU/USD)</div>
                <div className="text-sm text-gray-400 mb-2">1.0 lot, 0.01 pip size</div>
                <div className="text-2xl font-bold text-emerald-400">$1.00</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">USD/JPY Mini Lot</div>
                <div className="text-sm text-gray-400 mb-2">0.1 lot, 0.01 pip size</div>
                <div className="text-2xl font-bold text-emerald-400">$0.67</div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Understanding Forex Pip Values</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Calculating forex pip values accurately is essential for proper risk management. Our forex pip calculator 
                provides instant calculations for forex pairs and commodities with live market prices. 
                Understanding how to calculate forex pip value involves considering the pip size, lot size, and contract size of each instrument.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                The pip value formula is: Pip Size × Lot Size × Contract Size. For forex pairs like EUR/USD and GBP/USD, 
                the pip size is 0.0001 with a contract size of 100,000 units. For USD/JPY, the pip size is 0.01. 
                Commodities like Gold (XAU/USD) use different pip sizes and contract sizes - Gold typically uses 0.01 pip size 
                with 100 troy ounces per contract.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our calculator supports major forex pairs (EUR/USD, GBP/USD, USD/JPY) as well as commodities including 
                Gold (XAU/USD), Silver (XAG/USD), and Oil instruments (WTI and Brent). Each instrument has its specific 
                pip size and contract size, which the calculator automatically applies to give you accurate pip values.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Live market prices are updated every 30 seconds to ensure your calculations are based on current market conditions. 
                You can manually refresh prices by clicking the refresh button. This is particularly useful for commodities 
                like Oil and Gold, which can be more volatile than currency pairs.
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
                href="/calculators/profit-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Profit Calculator</div>
                <div className="text-sm text-gray-400">Calculate potential profits and losses on trades</div>
              </a>
              <a
                href="/calculators/margin-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Margin Calculator</div>
                <div className="text-sm text-gray-400">Determine required margin for your trades</div>
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

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Copy, Share2, Check, Info, Calculator, Shield, RefreshCw } from "lucide-react";
import { useCalculatorMarketData, CALCULATOR_INSTRUMENTS } from "@/lib/useCalculatorMarketData";

interface LotSizeCalculatorForm {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
  instrumentId: string;
  accountCurrency: string;
}

interface LotSizeResult {
  recommendedLotSize: number;
  riskAmount: number;
  maxLossIfSLHit: number;
  lotsInStandard: number;
  lotsInMini: number;
  lotsInMicro: number;
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

export function LotSizeCalculatorClient() {
  const { instruments, getInstrument, isLoading, lastUpdated, refetch } = useCalculatorMarketData();
  
  const [formData, setFormData] = useState<LotSizeCalculatorForm>({
    accountBalance: 10000,
    riskPercentage: 2,
    stopLossPips: 50,
    instrumentId: "eurusd",
    accountCurrency: "USD",
  });

  const [result, setResult] = useState<LotSizeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  useEffect(() => {
    calculateLotSize();
  }, [formData, instruments]);

  const calculateLotSize = () => {
    const selectedInstrument = getInstrument(formData.instrumentId);
    if (!selectedInstrument) return;

    const pipSize = selectedInstrument.pipSize;
    const riskAmount = (formData.accountBalance * formData.riskPercentage) / 100;

    const pipValueInQuoteCurrency = pipSize * 1 * selectedInstrument.contractSize;

    const parts = selectedInstrument.symbol.split("/");
    const quoteCurrency = parts[1] || "USD";

    const accountRate = EXCHANGE_RATES[formData.accountCurrency] || 1;
    const quoteRate = EXCHANGE_RATES[quoteCurrency] || 1;
    const pipValueInAccountCurrency = pipValueInQuoteCurrency * (quoteRate / accountRate);

    const recommendedLotSize = riskAmount / (formData.stopLossPips * pipValueInAccountCurrency);
    const maxLossIfSLHit = recommendedLotSize * formData.stopLossPips * pipValueInAccountCurrency;

    setResult({
      recommendedLotSize,
      riskAmount,
      maxLossIfSLHit,
      lotsInStandard: Math.floor(recommendedLotSize),
      lotsInMini: Math.floor(recommendedLotSize * 10),
      lotsInMicro: Math.floor(recommendedLotSize * 100),
      currentPrice: selectedInstrument.price,
    });
  };

  const handleInputChange = (field: keyof LotSizeCalculatorForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyResults = () => {
    if (!result) return;
    const selectedInstrument = getInstrument(formData.instrumentId);
    const text = `Lot Size Calculator Results:
Account Balance: $${formData.accountBalance.toLocaleString()} ${formData.accountCurrency}
Risk Percentage: ${formData.riskPercentage}%
Stop Loss: ${formData.stopLossPips} pips
Instrument: ${selectedInstrument?.label || formData.instrumentId}
Account Currency: ${formData.accountCurrency}
Recommended Lot Size: ${result.recommendedLotSize.toFixed(2)} lots
Risk Amount: $${result.riskAmount.toFixed(2)} ${formData.accountCurrency}
Max Loss if SL Hit: $${result.maxLossIfSLHit.toFixed(2)} ${formData.accountCurrency}`;
    
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
      accountBalance: 10000,
      riskPercentage: 2,
      stopLossPips: 50,
      instrumentId: "eurusd",
      accountCurrency: "USD",
    });
  };

  const faqData = [
    {
      question: "How do I calculate lot size in forex?",
      answer: "Lot size is calculated using the formula: Risk Amount ÷ (Stop Loss Pips × Pip Value). First, determine your risk amount (Account Balance × Risk %), then calculate the pip value for your instrument, and finally divide your risk amount by the total pip risk to get the optimal lot size.",
    },
    {
      question: "What is the 2% rule in forex trading?",
      answer: "The 2% rule is a risk management principle that states you should never risk more than 2% of your account balance on a single trade. This helps preserve capital and ensures you can survive a series of losing trades.",
    },
    {
      question: "How much should I risk per trade?",
      answer: "Most professional traders recommend risking 1-2% of your account balance per trade. Conservative traders may use 0.5-1%, while aggressive traders might go up to 3%.",
    },
    {
      question: "What is the difference between standard, mini, and micro lots?",
      answer: "A standard lot is the full contract size of an instrument, a mini lot is 0.1 of the contract size, and a micro lot is 0.01. The contract size varies by instrument (e.g., 100,000 for EUR/USD, 100 for Gold).",
    },
    {
      question: "How does stop loss affect lot size calculation?",
      answer: "Stop loss distance is inversely proportional to lot size. A wider stop loss requires a smaller lot size to maintain the same risk amount, while a tighter stop loss allows for a larger lot size.",
    },
    {
      question: "Why is position sizing important in forex?",
      answer: "Position sizing is crucial because it determines your risk per trade. Proper position sizing ensures that no single trade can significantly damage your account.",
    },
    {
      question: "Do different instruments require different lot sizes?",
      answer: "Yes, different instruments have different pip values and contract sizes, which affects lot size calculations. Gold, Silver, and Oil have different parameters compared to forex pairs.",
    },
    {
      question: "Can I use this calculator for any account size?",
      answer: "Yes, this lot size calculator works for any account size, from micro accounts with a few hundred dollars to large accounts. The percentage-based risk calculation automatically scales your position size.",
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
    name: "Forex Lot Size Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free forex position size calculator for traders. Calculate optimal lot size based on account balance, risk percentage, and stop loss for forex pairs and commodities with live market prices.",
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
              Forex Lot Size Calculator – Free Position Size Calculator
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Calculate optimal forex lot size instantly with our professional position size calculator. 
              Get accurate lot size recommendations for forex pairs and commodities with live market prices.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Risk Parameters</h2>
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
                    Account Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">$</span>
                    <input
                      type="number"
                      value={formData.accountBalance}
                      onChange={(e) => handleInputChange("accountBalance", parseFloat(e.target.value) || 0)}
                      step="100"
                      min="100"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip("balance")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "balance" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      Your total account balance including all available funds.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Percentage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.riskPercentage}
                      onChange={(e) => handleInputChange("riskPercentage", parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="0.1"
                      max="10"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                    <span className="absolute right-4 top-3 text-gray-400">%</span>
                  </div>
                  <button
                    onMouseEnter={() => setShowTooltip("risk")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "risk" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      The percentage of your account you are willing to risk. Professional traders typically use 1-2%.
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {[0.5, 1, 2, 3].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleInputChange("riskPercentage", preset)}
                        className={`text-xs px-3 py-1 rounded transition-all ${
                          formData.riskPercentage === preset
                            ? "bg-amber-400 text-black"
                            : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stop Loss (Pips)
                  </label>
                  <input
                    type="number"
                    value={formData.stopLossPips}
                    onChange={(e) => handleInputChange("stopLossPips", parseFloat(e.target.value) || 0)}
                    step="1"
                    min="1"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <button
                    onMouseEnter={() => setShowTooltip("sl")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "sl" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      The distance from your entry to your stop loss in pips. A wider stop loss requires a smaller position size.
                    </div>
                  )}
                </div>

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
                      The trading instrument. Different instruments have different pip sizes and contract sizes affecting lot size calculation.
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
                      The base currency of your trading account. Risk amount will be calculated in this currency.
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
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Position Size Results</h2>
              
              {result && selectedInstrument && (
                <div className="space-y-6">
                  <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                    <div className="text-sm text-gray-400 mb-2">Recommended Lot Size</div>
                    <div className="text-4xl font-bold text-emerald-400">
                      {result.recommendedLotSize.toFixed(2)} lots
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Risk Amount</div>
                      <div className="text-xl font-bold text-amber-400">
                        ${result.riskAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formData.riskPercentage}% of balance</div>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Max Loss if SL Hit</div>
                      <div className="text-xl font-bold text-rose-400">
                        ${result.maxLossIfSLHit.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formData.stopLossPips} pips</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>
                        Risking ${result.riskAmount.toFixed(2)} ({formData.riskPercentage}%) on ${formData.accountBalance.toLocaleString()} balance
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="text-xs text-gray-400 mb-3">Lot Breakdown</div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{result.lotsInStandard}</div>
                        <div className="text-xs text-gray-400">Standard</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{result.lotsInMini}</div>
                        <div className="text-xs text-gray-400">Mini</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{result.lotsInMicro}</div>
                        <div className="text-xs text-gray-400">Micro</div>
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
                  href={`https://twitter.com/intent/tweet?text=Check out this free Forex Lot Size Calculator from Legacy Global Bank&url=${encodeURIComponent(currentUrl)}`}
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
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Example Position Size Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Conservative Trader</div>
                <div className="text-sm text-gray-400 mb-2">$10k balance, 1% risk, 50 pip SL</div>
                <div className="text-2xl font-bold text-emerald-400">0.20 lots</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Moderate Risk</div>
                <div className="text-sm text-gray-400 mb-2">$10k balance, 2% risk, 30 pip SL</div>
                <div className="text-2xl font-bold text-emerald-400">0.67 lots</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-amber-400 font-semibold mb-3">Gold Position</div>
                <div className="text-sm text-gray-400 mb-2">$10k balance, 2% risk, 30 pip SL</div>
                <div className="text-2xl font-bold text-emerald-400">0.67 lots</div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Understanding Forex Position Sizing</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Position sizing is the most critical aspect of forex risk management. Our forex lot size calculator helps you 
                determine the optimal position size based on your account balance, risk tolerance, and trade setup. 
                By using a percentage-based approach to position sizing, you ensure that your risk remains consistent across all trades.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                The lot size formula is: Risk Amount divided by (Stop Loss Pips times Pip Value). 
                First, calculate your risk amount by multiplying your account balance by your chosen risk percentage. 
                Then, determine the pip value for your instrument based on its contract size and pip size.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Different instruments have different contract sizes and pip sizes. Forex pairs typically use 100,000 units per standard lot, 
                while Gold (XAU/USD) uses 100 troy ounces, Silver uses 5,000 troy ounces, and Oil uses 1,000 barrels per contract. 
                Our calculator automatically applies the correct parameters for each instrument.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Live market prices are updated every 30 seconds to ensure your position size calculations are based on current market conditions. 
                The 2% rule is a widely followed risk management principle - never risk more than 2% of your account on a single trade.
                Always calculate your position size before entering a trade to maintain consistent risk management.
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
                href="/calculators/margin-calculator"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-400/50 transition-all group"
              >
                <div className="text-amber-400 font-semibold mb-2 group-hover:text-amber-300">Margin Calculator</div>
                <div className="text-sm text-gray-400">Determine required margin for your trades</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

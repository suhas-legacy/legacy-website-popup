"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalculatorLinks } from "@/components/CalculatorLinks";
import { Copy, Share2, Check, Info, Calculator, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useCalculatorMarketData, CALCULATOR_INSTRUMENTS } from "@/lib/useCalculatorMarketData";

interface ProfitCalculatorForm {
  direction: "buy" | "sell";
  instrumentId: string;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  accountCurrency: string;
}

interface ProfitResult {
  grossProfitLoss: number;
  pipMovement: number;
  returnOnMargin: number;
  isProfit: boolean;
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

export function ProfitCalculatorClient() {
  const { instruments, getInstrument, isLoading, lastUpdated, refetch } = useCalculatorMarketData();
  
  const [formData, setFormData] = useState<ProfitCalculatorForm>({
    direction: "buy",
    instrumentId: "eurusd",
    entryPrice: 1.0850,
    exitPrice: 1.0900,
    lotSize: 1.0,
    accountCurrency: "USD",
  });

  const [result, setResult] = useState<ProfitResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : '');
  }, []);

  useEffect(() => {
    calculateProfit();
  }, [formData, instruments]);

  const calculateProfit = () => {
    const selectedInstrument = getInstrument(formData.instrumentId);
    if (!selectedInstrument) return;

    const pipSize = selectedInstrument.pipSize;
    const currentPrice = selectedInstrument.price;

    const priceDifference = formData.exitPrice - formData.entryPrice;
    const directionMultiplier = formData.direction === "buy" ? 1 : -1;
    
    const profitLossInQuoteCurrency = priceDifference * formData.lotSize * selectedInstrument.contractSize * directionMultiplier;

    const parts = selectedInstrument.symbol.split("/");
    const quoteCurrency = parts[1] || "USD";

    const accountRate = EXCHANGE_RATES[formData.accountCurrency] || 1;
    const quoteRate = EXCHANGE_RATES[quoteCurrency] || 1;
    const profitLossInAccountCurrency = profitLossInQuoteCurrency * (quoteRate / accountRate);

    const pipMovement = priceDifference / pipSize;
    const marginRequired = (formData.lotSize * selectedInstrument.contractSize * formData.entryPrice) / 100;
    const returnOnMargin = marginRequired > 0 ? (profitLossInAccountCurrency / marginRequired) * 100 : 0;

    setResult({
      grossProfitLoss: profitLossInAccountCurrency,
      pipMovement,
      returnOnMargin,
      isProfit: profitLossInAccountCurrency >= 0,
      currentPrice,
    });
  };

  const handleInputChange = (field: keyof ProfitCalculatorForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyResults = () => {
    if (!result) return;
    const selectedInstrument = getInstrument(formData.instrumentId);
    const text = `Profit Calculator Results:
Direction: ${formData.direction.toUpperCase()}
Instrument: ${selectedInstrument?.label || formData.instrumentId}
Entry Price: ${formData.entryPrice}
Exit Price: ${formData.exitPrice}
Lot Size: ${formData.lotSize}
Account Currency: ${formData.accountCurrency}
Gross Profit/Loss: $${result.grossProfitLoss.toFixed(2)} ${formData.accountCurrency}
Pip Movement: ${result.pipMovement.toFixed(1)} pips
Return on Margin: ${result.returnOnMargin.toFixed(2)}%`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCalculator = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      direction: "buy",
      instrumentId: "eurusd",
      entryPrice: 1.0850,
      exitPrice: 1.0900,
      lotSize: 1.0,
      accountCurrency: "USD",
    });
  };

  const faqData = [
    {
      question: "How do I calculate forex profit and loss?",
      answer: "Forex profit/loss is calculated using the formula: (Exit Price - Entry Price) × Lot Size × Contract Size × Direction Multiplier. For buy positions, use +1; for sell positions, use -1. The result is then converted to your account currency.",
    },
    {
      question: "What is the difference between buy and sell in forex?",
      answer: "In forex, buying (going long) means you profit when the price rises. Selling (going short) means you profit when the price falls. The profit calculation applies a direction multiplier: +1 for buy, -1 for sell.",
    },
    {
      question: "How many pips did my trade move?",
      answer: "To calculate pip movement, divide the price difference by the pip size. For most pairs (pip size 0.0001), a movement from 1.0850 to 1.0900 is 50 pips. For JPY pairs (pip size 0.01), the calculation uses 0.01 as the divisor.",
    },
    {
      question: "What is return on margin in forex trading?",
      answer: "Return on margin shows the percentage return on the margin required to open the trade. It's calculated as (Profit/Loss ÷ Required Margin) × 100. This helps traders assess the efficiency of their capital usage.",
    },
    {
      question: "How does lot size affect profit calculation?",
      answer: "Lot size directly multiplies your profit or loss. Larger contract sizes amplify both profits and losses proportionally. Our calculator uses the specific contract size for each instrument.",
    },
    {
      question: "Do commodities calculate profit differently?",
      answer: "Yes, commodities like Gold, Silver, and Oil have different contract sizes and pip sizes compared to forex pairs. The calculator automatically applies the correct contract size and pip size for each instrument.",
    },
    {
      question: "Why is my profit different in different account currencies?",
      answer: "Profit is calculated in the quote currency of the instrument, then converted to your account currency using exchange rates. A $100 profit in USD will be different when converted to EUR or GBP due to exchange rate fluctuations.",
    },
    {
      question: "Can I calculate profit before opening a trade?",
      answer: "Yes, our profit calculator allows you to enter hypothetical entry and exit prices to calculate potential profit or loss before trading. This is essential for proper risk management and trade planning.",
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
    name: "Forex Profit Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Free forex profit and loss calculator for traders. Calculate trading profits, losses, pip movements, and return on margin for any forex pair or commodity.",
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
              Forex Profit Calculator – Free Trading Profit/Loss Calculator
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Calculate forex trading profits and losses instantly with our free profit calculator. 
              Get accurate profit/loss calculations for forex pairs and commodities with live market prices.
            </p>
          </div>

          <CalculatorLinks currentPath="/calculators/profit-calculator" />

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
                    Trade Direction
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange("direction", "buy")}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        formData.direction === "buy"
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                      }`}
                    >
                      Buy (Long)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("direction", "sell")}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        formData.direction === "sell"
                          ? "bg-rose-500 text-white"
                          : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                      }`}
                    >
                      Sell (Short)
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instrument
                  </label>
                  <select
                    value={formData.instrumentId}
                    onChange={(e) => {
                      handleInputChange("instrumentId", e.target.value);
                      const inst = getInstrument(e.target.value);
                      if (inst) {
                        handleInputChange("entryPrice", inst.price);
                        handleInputChange("exitPrice", inst.price);
                      }
                    }}
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
                      Select the trading instrument. Prices are updated live from market data. Selecting an instrument will set current price as entry/exit.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    value={inputValues["entryPrice"] !== undefined ? inputValues["entryPrice"] : formData.entryPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => ({ ...prev, entryPrice: value }));
                      if (value !== "") {
                        handleInputChange("entryPrice", parseFloat(value));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => {
                        const next = { ...prev };
                        delete next.entryPrice;
                        return next;
                      });
                      handleInputChange("entryPrice", value === "" ? 0 : parseFloat(value));
                    }}
                    step="0.0001"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <button
                    onMouseEnter={() => setShowTooltip("entry")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "entry" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      The price at which you entered or plan to enter the trade.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exit Price
                  </label>
                  <input
                    type="number"
                    value={inputValues["exitPrice"] !== undefined ? inputValues["exitPrice"] : formData.exitPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => ({ ...prev, exitPrice: value }));
                      if (value !== "") {
                        handleInputChange("exitPrice", parseFloat(value));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => {
                        const next = { ...prev };
                        delete next.exitPrice;
                        return next;
                      });
                      handleInputChange("exitPrice", value === "" ? 0 : parseFloat(value));
                    }}
                    step="0.0001"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  <button
                    onMouseEnter={() => setShowTooltip("exit")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === "exit" && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-gray-300 z-10">
                      The price at which you exited or plan to exit the trade.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lot Size
                  </label>
                  <input
                    type="number"
                    value={inputValues["lotSize"] !== undefined ? inputValues["lotSize"] : formData.lotSize}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => ({ ...prev, lotSize: value }));
                      if (value !== "") {
                        handleInputChange("lotSize", parseFloat(value));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      setInputValues((prev) => {
                        const next = { ...prev };
                        delete next.lotSize;
                        return next;
                      });
                      handleInputChange("lotSize", value === "" ? 0 : parseFloat(value));
                    }}
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
                      The base currency of your trading account. Profits will be converted to this currency.
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
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Trade Results</h2>
              
              {result && selectedInstrument && (
                <div className="space-y-6">
                  <div className={`bg-zinc-800 rounded-xl p-6 border ${result.isProfit ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
                    <div className="text-sm text-gray-400 mb-2">Gross Profit/Loss</div>
                    <div className={`text-4xl font-bold flex items-center gap-3 ${result.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.isProfit ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                      ${result.grossProfitLoss.toFixed(2)} {formData.accountCurrency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Pip Movement</div>
                      <div className={`text-xl font-bold ${result.pipMovement >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.pipMovement.toFixed(1)} pips
                      </div>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                      <div className="text-xs text-gray-400 mb-1">Return on Margin</div>
                      <div className={`text-xl font-bold ${result.returnOnMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.returnOnMargin.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-r ${result.isProfit ? 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20' : 'from-rose-500/10 to-rose-500/5 border-rose-500/20'} rounded-xl p-4 border`}>
                    <div className="flex items-center gap-2 text-sm">
                      <Info className={`w-4 h-4 ${result.isProfit ? 'text-emerald-400' : 'text-rose-400'}`} />
                      <span className={result.isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                        {result.isProfit ? 'Profit' : 'Loss'} of ${Math.abs(result.grossProfitLoss).toFixed(2)} on {formData.lotSize} lot {selectedInstrument.label} {formData.direction} position
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="text-xs text-gray-400 mb-2">Trade Summary</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Direction:</span>
                        <span className="text-white font-medium">{formData.direction.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry:</span>
                        <span className="text-white font-medium">{formData.entryPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Exit:</span>
                        <span className="text-white font-medium">{formData.exitPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price Change:</span>
                        <span className="text-white font-medium">{(formData.exitPrice - formData.entryPrice).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Price:</span>
                        <span className="text-amber-400 font-medium">{result.currentPrice.toFixed(result.currentPrice > 100 ? 2 : 4)}</span>
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
                  href={`https://twitter.com/intent/tweet?text=Check out this free Forex Profit Calculator from Legacy Global Bank&url=${encodeURIComponent(currentUrl)}`}
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
            <h2 className="text-3xl font-bold mb-8 text-amber-400">Example Trade Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-emerald-400 font-semibold mb-3">Profitable EUR/USD Trade</div>
                <div className="text-sm text-gray-400 mb-2">Buy 1.0 lot @ 1.0850, Exit @ 1.0900</div>
                <div className="text-2xl font-bold text-emerald-400">+$500.00</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-rose-400 font-semibold mb-3">Loss on GBP/USD</div>
                <div className="text-sm text-gray-400 mb-2">Sell 0.5 lot @ 1.2650, Exit @ 1.2700</div>
                <div className="text-2xl font-bold text-rose-400">-$250.00</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-emerald-400 font-semibold mb-3">Gold Profit Trade</div>
                <div className="text-sm text-gray-400 mb-2">Buy 1.0 lot @ 2320, Exit @ 2330</div>
                <div className="text-2xl font-bold text-emerald-400">+$1,000.00</div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Understanding Forex Profit and Loss Calculation</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Calculating forex profit and loss accurately is fundamental to successful trading. Our forex profit calculator 
                provides instant calculations for forex pairs and commodities with live market prices. 
                Understanding how to calculate forex profit involves considering the direction of your trade, entry and exit prices, 
                lot size, and instrument characteristics.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                The profit loss calculator uses a straightforward formula: (Exit Price - Entry Price) × Lot Size × Contract Size × Direction Multiplier. 
                For buy positions (going long), the direction multiplier is +1, meaning you profit when prices rise. 
                For sell positions (going short), it's -1, meaning you profit when prices fall.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Different instruments have different contract sizes and pip sizes. Forex pairs like EUR/USD use 100,000 units per standard lot, 
                while Gold (XAU/USD) uses 100 troy ounces, and Oil uses 1,000 barrels per contract. 
                Our calculator automatically applies the correct parameters for each instrument.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Live market prices are updated every 30 seconds to ensure your calculations are based on current market conditions. 
                When you select an instrument, the current live price is automatically set as the entry and exit price, 
                which you can then adjust to simulate different trade scenarios.
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

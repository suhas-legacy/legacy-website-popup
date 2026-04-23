"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalculatorLinks } from "@/components/CalculatorLinks";
import { RefreshCw, Calculator, TrendingUp, Info, AlertCircle } from "lucide-react";
import { useCalculatorMarketData } from "@/lib/useCalculatorMarketData";

// Constants for gold calculations
const TROY_OUNCE_TO_GRAMS = 31.1034768;
const GST_RATE = 0.03;

interface GoldPrices {
  xauusd: number;
  usdinr: number;
  lastUpdated: Date;
}

interface CalculatorForm {
  weight: number;
  purity: "24K" | "22K" | "18K";
  makingCharges: number;
  useActualMarketRate: boolean;
}

interface CalculationResult {
  xauusdPureInr: number;
  xauusdPureUsd: number;
  physicalGoldInr: number;
  physicalGoldUsd: number;
  differenceInr: number;
  differenceUsd: number;
  percentageDiff: number;
}

const PURITY_FACTORS: Record<string, number> = {
  "24K": 1.0,
  "22K": 0.916667,
  "18K": 0.75,
};

export function GoldCalculatorClient() {
  const { instruments, getInstrument, isLoading, lastUpdated, refetch } = useCalculatorMarketData();
  const goldInstrument = getInstrument("gold");
  
  const [usdinr, setUsdinr] = useState(83.5);
  const [formData, setFormData] = useState<CalculatorForm>({
    weight: 100,
    purity: "22K",
    makingCharges: 8,
    useActualMarketRate: false,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch USDINR rate
  const fetchUsdInr = async () => {
    try {
      const forexResponse = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (forexResponse.ok) {
        const forexData = await forexResponse.json();
        setUsdinr(forexData.rates?.INR || 83.5);
      }
    } catch (err) {
      console.error("Failed to fetch USDINR:", err);
    }
  };

  useEffect(() => {
    fetchUsdInr();
    const interval = setInterval(fetchUsdInr, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate results whenever form data or prices change
  useEffect(() => {
    calculateResult();
  }, [formData, goldInstrument, usdinr]);

  const calculateResult = () => {
    const { weight, purity, makingCharges } = formData;
    const purityFactor = PURITY_FACTORS[purity];
    const xauusdPrice = goldInstrument?.price || 2350;
    
    // XAUUSD Pure Spot (Paper Gold) Calculation
    // Pure 24K price per gram (INR) = (XAUUSD × USDINR) / 31.1034768
    const pure24KPerGramInr = (xauusdPrice * usdinr) / TROY_OUNCE_TO_GRAMS;
    
    // Base Cost INR = pure_per_gram × weight × purity_factor
    const baseCostInr = pure24KPerGramInr * weight * purityFactor;
    
    // Total in USD = Base Cost INR / USDINR
    const xauusdPureUsd = baseCostInr / usdinr;
    
    // Indian Physical Gold Calculation
    // Base Gold Value INR = same as above
    const baseGoldValueInr = baseCostInr;
    
    // Making Charges = Base × (making % / 100)
    const makingChargesAmount = baseGoldValueInr * (makingCharges / 100);
    
    // Subtotal = Base + Making
    const subtotal = baseGoldValueInr + makingChargesAmount;
    
    // GST = Subtotal × 0.03
    const gstAmount = subtotal * GST_RATE;
    
    // Total Physical Cost INR = Subtotal + GST
    const physicalGoldInr = subtotal + gstAmount;
    
    // Total Physical Cost USD = Total INR / USDINR
    const physicalGoldUsd = physicalGoldInr / usdinr;
    
    // Difference Calculation
    const differenceUsd = physicalGoldUsd - xauusdPureUsd;
    const differenceInr = physicalGoldInr - baseCostInr;
    const percentageDiff = baseCostInr > 0 ? (differenceInr / baseCostInr) * 100 : 0;
    
    setResult({
      xauusdPureInr: baseCostInr,
      xauusdPureUsd,
      physicalGoldInr,
      physicalGoldUsd,
      differenceInr,
      differenceUsd,
      percentageDiff,
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 mt-6 mb-6">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Gold Investment Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Gold Price Calculator India: Physical Gold vs XAUUSD Live Comparison
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Compare live XAUUSD gold spot price with Indian physical gold costs including making charges and 3% GST. 
              Calculate exactly how much more you pay for physical gold jewellery and bars compared to paper gold trading. 
              Make informed investment decisions with real-time market data.
            </p>
          </div>

          <CalculatorLinks currentPath="/calculators/gold-calculator" />

          {/* Live Price Ticker */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">XAUUSD Spot Price</div>
                  <div className="text-2xl font-bold text-amber-400">
                    ${formatNumber(goldInstrument?.price || 2350)}
                  </div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-zinc-700"></div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">USD to INR</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ₹{formatNumber(usdinr)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Last Updated</div>
                  <div className="text-sm font-medium">
                    {lastUpdated?.toLocaleTimeString() || "Loading..."}
                  </div>
                </div>
                <button
                  onClick={() => { refetch(); fetchUsdInr(); }}
                  disabled={isLoading}
                  className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Calculator Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  Calculator Inputs
                </h2>
                
                <div className="space-y-6">
                  {/* Weight Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (grams)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full mt-2 accent-amber-400"
                    />
                  </div>

                  {/* Purity Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Gold Purity</label>
                    <select
                      value={formData.purity}
                      onChange={(e) => setFormData({ ...formData, purity: e.target.value as any })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="24K">24K (99.9% Pure)</option>
                      <option value="22K">22K (91.67% Pure)</option>
                      <option value="18K">18K (75% Pure)</option>
                    </select>
                  </div>

                  {/* Making Charges */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Making Charges (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="0.5"
                      value={formData.makingCharges}
                      onChange={(e) => setFormData({ ...formData, makingCharges: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.5"
                      value={formData.makingCharges}
                      onChange={(e) => setFormData({ ...formData, makingCharges: Number(e.target.value) })}
                      className="w-full mt-2 accent-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* XAUUSD Pure Spot Gold */}
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-emerald-400">XAUUSD Pure Spot (Paper Gold)</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost in INR</span>
                      <span className="font-bold">{result && formatCurrency(result.xauusdPureInr, "INR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost in USD</span>
                      <span className="font-bold">{result && formatCurrency(result.xauusdPureUsd, "USD")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Per Gram (INR)</span>
                      <span className="font-bold">
                        {result && formatCurrency(result.xauusdPureInr / formData.weight, "INR")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-700/30">
                    <p className="text-xs text-gray-400">
                      Pure gold spot price without any additional charges or taxes
                    </p>
                  </div>
                </div>

                {/* Physical Gold in India */}
                <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/10 border border-amber-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="font-bold text-amber-400">Physical Gold (India)</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Cost in INR</span>
                      <span className="font-bold">{result && formatCurrency(result.physicalGoldInr, "INR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Cost in USD</span>
                      <span className="font-bold">{result && formatCurrency(result.physicalGoldUsd, "USD")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Per Gram (INR)</span>
                      <span className="font-bold">
                        {result && formatCurrency(result.physicalGoldInr / formData.weight, "INR")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-700/30">
                    <p className="text-xs text-gray-400">
                      Includes making charges ({formData.makingCharges}%) + 3% GST
                    </p>
                  </div>
                </div>
              </div>

              {/* Difference Card */}
              {result && (
                <div className={`rounded-2xl p-6 border-2 ${
                  result.differenceInr > 0 
                    ? "bg-red-900/20 border-red-500/50" 
                    : "bg-emerald-900/20 border-emerald-500/50"
                }`}>
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">
                      {result.differenceInr > 0 ? "You Pay More for Physical Gold" : "You Save with Physical Gold"}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {result.differenceInr > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(result.differenceInr), "INR")}
                    </div>
                    <div className="text-lg">
                      ({result.differenceUsd > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(result.differenceUsd), "USD")})
                    </div>
                    <div className={`mt-3 text-sm font-medium ${
                      result.percentageDiff > 0 ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {result.percentageDiff > 0 ? "+" : ""}
                      {formatNumber(result.percentageDiff)}% difference
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              How the Calculator Works
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3 text-emerald-400">XAUUSD Pure Spot Calculation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Pure 24K price per gram (INR) = (XAUUSD × USDINR) ÷ 31.1034768</li>
                  <li>• Base Cost INR = pure_per_gram × weight × purity_factor</li>
                  <li>• Total in USD = Base Cost INR ÷ USDINR</li>
                  <li>• Purity factors: 24K = 1.0, 22K = 0.916667, 18K = 0.75</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3 text-amber-400">Physical Gold Calculation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Base Gold Value = same as XAUUSD calculation</li>
                  <li>• Making Charges = Base × (making % ÷ 100)</li>
                  <li>• Subtotal = Base + Making Charges</li>
                  <li>• GST (3%) = Subtotal × 0.03</li>
                  <li>• Total Physical Cost = Subtotal + GST</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Why Compare Physical Gold vs XAUUSD?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold">Cost Transparency</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Understand exactly how much extra you pay for physical gold in the form of making charges and GST.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="font-semibold">Investment Decision</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Make informed decisions between buying physical gold for jewellery or investing in paper gold like ETFs.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="font-semibold">Real-Time Data</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Live market prices updated every 60 seconds ensure accurate calculations for current market conditions.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">What is the difference between XAUUSD and physical gold in India?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  XAUUSD represents the international spot price of gold in USD per troy ounce, traded on global markets. Physical gold in India includes additional costs like making charges (typically 8-15% for jewellery) and 3% GST, making it significantly more expensive than the spot price.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">How are making charges and GST calculated on physical gold?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Making charges are calculated as a percentage of the base gold value (typically 8-25% depending on the jewellery design). GST of 3% is then applied to the sum of base gold value plus making charges. Our calculator shows you the exact breakdown of these costs.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">Is XAUUSD cheaper than buying gold in India?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Yes, XAUUSD (paper gold) is typically 10-20% cheaper than physical gold in India due to the absence of making charges and lower taxes. However, physical gold offers the advantage of possession and can be used for jewellery or as a store of value that you physically hold.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">What is the purity difference between 22K and 24K gold?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  24K gold is 99.9% pure and is typically used for coins and bars. 22K gold is 91.67% pure, with the remaining 8.33% being other metals to increase durability for jewellery. 22K is the most common purity for Indian jewellery.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">How often are the gold prices updated in this calculator?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Our calculator fetches live market prices every 60 seconds automatically. You can also manually refresh the prices using the refresh button in the price ticker section. This ensures you always have the most current gold rates.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">Should I invest in physical gold or paper gold?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Paper gold (XAUUSD, ETFs, Sovereign Gold Bonds) is more cost-effective with lower premiums and better liquidity. Physical gold is ideal for jewellery or if you prefer holding the asset. Consider your investment goals, time horizon, and need for liquidity before deciding.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">What is the formula for converting XAUUSD to Indian gold price?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  The formula is: (XAUUSD price × USDINR rate) ÷ 31.1034768 = 24K gold price per gram in INR. Then multiply by purity factor (0.916667 for 22K, 0.75 for 18K) to get the price for your chosen purity.
                </div>
              </details>
              <details className="bg-zinc-900 border border-zinc-800 rounded-xl group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800 transition-colors">
                  <span className="font-semibold">Are the prices in this calculator accurate for actual purchases?</span>
                  <span className="text-amber-400 transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  Our calculator provides a close estimate based on international spot prices. Actual retail prices may vary by jeweller, location, and current market conditions. Always check with your local jeweller for final pricing before making a purchase.
                </div>
              </details>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-400 mb-2">Disclaimer</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This calculator is for informational purposes only and should not be considered as financial advice. 
                  Gold prices are subject to market fluctuations and may vary from actual retail prices. 
                  Making charges and GST rates may differ by jeweller and location. 
                  Please consult with a qualified financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

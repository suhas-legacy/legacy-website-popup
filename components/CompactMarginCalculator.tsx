"use client";

import { useState, useEffect } from "react";
import { useCalculatorMarketData, CALCULATOR_INSTRUMENTS, CalculatorInstrument } from "@/lib/useCalculatorMarketData";

interface CompactMarginCalculatorProps {
  initialInstrument?: any;
  initialLotType?: "micro" | "mini" | "standard";
}

const LEVERAGE_OPTIONS = [
  { value: "1:50", label: "1:50", multiplier: 50 },
  { value: "1:100", label: "1:100", multiplier: 100 },
  { value: "1:200", label: "1:200", multiplier: 200 },
  { value: "1:500", label: "1:500", multiplier: 500 },
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

const LOT_TYPE_MAP: Record<"micro" | "mini" | "standard", number> = {
  micro: 0.01,
  mini: 0.1,
  standard: 1.0,
};

export function CompactMarginCalculator({ initialInstrument, initialLotType = "standard" }: CompactMarginCalculatorProps) {
  const { instruments, getInstrument } = useCalculatorMarketData();
  
  // Map the initial instrument from Education.tsx format to calculator format
  const getInitialInstrumentId = () => {
    if (!initialInstrument) return "eurusd";
    
    const instName = initialInstrument.name || initialInstrument.symbol;
    const mapping: Record<string, string> = {
      "EUR/USD": "eurusd",
      "GBP/USD": "gbpusd",
      "USD/JPY": "usdjpy",
      "XAUUSD": "gold",
      "XAGUSD": "silver",
      "USOIL": "usoil",
      "UKOIL": "brent",
    };
    
    return mapping[instName] || "eurusd";
  };
  
  const [formData, setFormData] = useState({
    instrumentId: getInitialInstrumentId(),
    lotSize: LOT_TYPE_MAP[initialLotType],
    leverage: "1:100",
    accountCurrency: "USD",
  });

  const [result, setResult] = useState<any>(null);

  // Update instrument when initialInstrument changes
  useEffect(() => {
    if (initialInstrument) {
      setFormData(prev => ({
        ...prev,
        instrumentId: getInitialInstrumentId(),
      }));
    }
  }, [initialInstrument]);

  useEffect(() => {
    calculateMargin();
  }, [formData, instruments]);

  const calculateMargin = () => {
    const selectedInstrument = getInstrument(formData.instrumentId);
    if (!selectedInstrument) return;

    const price = selectedInstrument.price;
    const leverageMultiplier = LEVERAGE_OPTIONS.find((l) => l.value === formData.leverage)?.multiplier || 100;

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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const selectedInstrument = getInstrument(formData.instrumentId);

  return (
    <div className="compact-margin-calculator">
      <div className="space-y-4">
        <div>
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
              <span className="text-gray-400">Current Price: </span>
              <span className="text-white font-medium">{selectedInstrument.price.toFixed(selectedInstrument.price > 100 ? 2 : 4)}</span>
            </div>
          )}
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        {result && selectedInstrument && (
          <div className="mt-6 space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <div className="text-sm text-gray-400 mb-2">Margin Required</div>
              <div className="text-3xl font-bold text-emerald-400">
                ${result.marginRequired.toFixed(2)} {formData.accountCurrency}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700">
                <div className="text-xs text-gray-400 mb-1">Free Margin Impact</div>
                <div className="text-lg font-bold text-amber-400">
                  ${result.freeMarginImpact.toFixed(2)}
                </div>
              </div>
              <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700">
                <div className="text-xs text-gray-400 mb-1">Max Lots at Leverage</div>
                <div className="text-lg font-bold text-white">
                  {result.maxLotsAtLeverage.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-xl p-3 border border-amber-500/20">
              <div className="text-amber-400 text-sm">
                A {formData.lotSize} lot position in {selectedInstrument.label} at {formData.leverage} requires ${result.marginRequired.toFixed(2)} {formData.accountCurrency} margin
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

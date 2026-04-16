"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveMarketQuote } from "./marketQuotesTypes";

export interface CalculatorInstrument {
  id: string;
  label: string;
  symbol: string;
  pipSize: number;
  contractSize: number;
  price: number;
}

export const CALCULATOR_INSTRUMENTS: CalculatorInstrument[] = [
  { id: "eurusd", label: "EUR/USD", symbol: "EUR/USD", pipSize: 0.0001, contractSize: 100000, price: 1.0850 },
  { id: "gbpusd", label: "GBP/USD", symbol: "GBP/USD", pipSize: 0.0001, contractSize: 100000, price: 1.2650 },
  { id: "usdjpy", label: "USD/JPY", symbol: "USD/JPY", pipSize: 0.01, contractSize: 100000, price: 149.50 },
  { id: "gold", label: "GOLD (XAU/USD)", symbol: "XAU/USD", pipSize: 0.01, contractSize: 100, price: 2330.50 },
  { id: "silver", label: "SILVER (XAG/USD)", symbol: "XAG/USD", pipSize: 0.001, contractSize: 5000, price: 27.50 },
  { id: "oil", label: "OIL (WTI - USOIL)", symbol: "USOIL", pipSize: 0.01, contractSize: 1000, price: 78.50 },
  { id: "brent", label: "UK-OIL (Brent - UKOIL)", symbol: "UKOIL", pipSize: 0.01, contractSize: 1000, price: 82.30 },
  { id: "usoil", label: "US-OIL (WTI)", symbol: "USOIL", pipSize: 0.01, contractSize: 1000, price: 78.50 },
];

export function useCalculatorMarketData() {
  const [instruments, setInstruments] = useState<CalculatorInstrument[]>(CALCULATOR_INSTRUMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch("/api/market-quotes", { cache: "no-store" });
      const data = await response.json();
      
      if (data.ok && data.quotes) {
        setInstruments((prev) =>
          prev.map((inst) => {
            const quote = data.quotes[inst.id];
            if (quote && quote.price) {
              return { ...inst, price: quote.price };
            }
            return inst;
          })
        );
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch market prices:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getInstrument = useCallback((id: string) => {
    return instruments.find((inst) => inst.id === id);
  }, [instruments]);

  return {
    instruments,
    getInstrument,
    isLoading,
    lastUpdated,
    refetch: fetchPrices,
  };
}

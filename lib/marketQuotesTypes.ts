import type { MarketId } from "./yahooMarketMap";

export type LiveMarketQuote = {
  symbol: string;
  price: number;
  changePercent: number | null;
  sparkline: number[];
};

export type MarketQuotesResponse = {
  updatedAt: number;
  ok: boolean;
  quotes: Partial<Record<MarketId, LiveMarketQuote>>;
  error?: string;
};

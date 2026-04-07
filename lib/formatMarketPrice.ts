import type { MarketId } from "./yahooMarketMap";

export function formatMarketPrice(id: MarketId, price: number): string {
  switch (id) {
    case "eurusd":
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 5,
      });
    case "silver":
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    case "btc":
    case "ger30":
    case "fra40":
    case "us30":
    case "spx":
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: price >= 1000 ? 2 : 4,
      });
    default:
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }
}

export function formatChangePercent(pct: number | null): {
  text: string;
  up: boolean;
} {
  if (pct == null || Number.isNaN(pct)) {
    return { text: "—", up: true };
  }
  const sign = pct >= 0 ? "+" : "";
  return {
    text: `${sign}${pct.toFixed(2)}%`,
    up: pct >= 0,
  };
}

export const MARKET_IDS = [
  "oil",
  "brent",
  "ger30",
  "fra40",
  "us30",
  "gold",
  "eurusd",
  "silver",
  "spx",
  "btc",
] as const;

export type MarketId = (typeof MARKET_IDS)[number];

/** Yahoo Finance tickers (delayed / community API — not official Yahoo data product). */
export const YAHOO_SYMBOL_BY_ID: Record<MarketId, string> = {
  oil: "CL=F",
  brent: "BZ=F",
  ger30: "^GDAXI",
  fra40: "^FCHI",
  us30: "^DJI",
  gold: "XAUUSD=X",
  eurusd: "EURUSD=X",
  silver: "XAGUSD=X",
  spx: "^GSPC",
  btc: "BTC-USD",
};

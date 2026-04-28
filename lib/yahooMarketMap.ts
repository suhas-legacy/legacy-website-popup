export const MARKET_IDS = [
  "bitcoin",
  "eurusd",
  "gbpusd",
  "usdjpy",
  "gold",
  "silver",
  "oil",
  "brent",
  "usoil",
  "ger30",
  "fra40",
  "us30",
  "spx",
  "btc",
  "btcusd",
] as const;

export type MarketId = (typeof MARKET_IDS)[number];

/** Yahoo Finance tickers (delayed / community API — not official Yahoo data product). */
export const YAHOO_SYMBOL_BY_ID: Record<MarketId, string> = {
  bitcoin: "BTC-USD",
  eurusd: "EURUSD=X",
  gbpusd: "GBPUSD=X",
  usdjpy: "USDJPY=X",
  gold: "GC=F",        // COMEX Gold Futures
  silver: "SI=F",      // COMEX Silver Futures
  oil: "CL=F",
  brent: "BZ=F",
  usoil: "CL=F",       // Same as oil (WTI)
  ger30: "^GDAXI",
  fra40: "^FCHI",
  us30: "^DJI",
  spx: "^GSPC",
  btc: "BTC-USD",
  btcusd: "BTC-USD",
};

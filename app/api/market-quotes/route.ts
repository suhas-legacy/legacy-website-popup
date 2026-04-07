import YahooFinance from "yahoo-finance2";
import type { LiveMarketQuote } from "@/lib/marketQuotesTypes";
import {
  MARKET_IDS,
  YAHOO_SYMBOL_BY_ID,
  type MarketId,
} from "@/lib/yahooMarketMap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const yahooFinance = new YahooFinance();

export async function GET() {
  const symbols = MARKET_IDS.map((id) => YAHOO_SYMBOL_BY_ID[id]);
  const quotes: Partial<Record<MarketId, LiveMarketQuote>> = {};

  try {
    const quoteRes = await yahooFinance.quote(symbols);
    const quoteArr = Array.isArray(quoteRes) ? quoteRes : [quoteRes];

    const quoteBySymbol = new Map<string, (typeof quoteArr)[number]>();
    for (const q of quoteArr) {
      const sym =
        (q as { symbol?: unknown }).symbol != null
          ? String((q as { symbol?: unknown }).symbol)
          : null;
      if (sym) quoteBySymbol.set(sym, q);
    }

    const period1 = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000);

    await Promise.all(
      MARKET_IDS.map(async (id) => {
        const ySym = YAHOO_SYMBOL_BY_ID[id];
        const q = quoteBySymbol.get(ySym);
        if (!q || q.regularMarketPrice == null) return;

        let sparkline: number[] = [];
        try {
          const chart = await yahooFinance.chart(ySym, {
            period1,
            interval: "1d",
          });
          sparkline =
            chart.quotes
              ?.map((c) => c.close)
              .filter(
                (c): c is number =>
                  typeof c === "number" && !Number.isNaN(c)
              ) ?? [];
        } catch {
          sparkline = [];
        }

        quotes[id] = {
          symbol: ySym,
          price: q.regularMarketPrice,
          changePercent:
            typeof q.regularMarketChangePercent === "number"
              ? q.regularMarketChangePercent
              : null,
          sparkline: sparkline.slice(-34),
        };
      })
    );

    return Response.json({
      updatedAt: Date.now(),
      ok: true,
      quotes,
    });
  } catch {
    return Response.json({
      updatedAt: Date.now(),
      ok: false,
      quotes: {},
      error: "yahoo_unavailable",
    });
  }
}

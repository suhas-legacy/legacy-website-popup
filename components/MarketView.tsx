"use client";

import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import {
  formatChangePercent,
  formatMarketPrice,
} from "@/lib/formatMarketPrice";
import type {
  LiveMarketQuote,
  MarketQuotesResponse,
} from "@/lib/marketQuotesTypes";
import type { MarketId } from "@/lib/yahooMarketMap";
import { TradingViewModal } from "./TradingViewModal";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler
);

type MarketInstrument = {
  id: MarketId;
  /** TradingView symbol (exchange:symbol) */
  tvSymbol: string;
  /** Modal title */
  chartTitle: string;
  name: string;
  ticker?: string;
  large?: boolean;
  wide?: boolean;
  /** Fallback % label when feed is offline */
  change: string;
  changeUp: boolean;
  flicker: { initial: number; vol?: number; decimals?: number };
  mini: { base: number; n?: number; vol?: number; up: boolean };
  buyers?: string;
  period?: string;
  icon: string;
  iconStyle?: CSSProperties;
};
// Add prop type
interface MarketViewProps {
  hideHeader?: boolean;
}
const MARKETS: MarketInstrument[] = [
    {
    id: "gold",
    tvSymbol: "FOREXCOM:XAUUSD",
    chartTitle: "Gold Spot / U.S. Dollar",
    name: "GOLD (XAU/USD)",
    ticker: "XAU/USD",
    change: "+0.34%",
    changeUp: true,
    flicker: { initial: 4730.68, vol: 0.001 },
    mini: { base: 4700, n: 30, vol: 0.01, up: true },
    buyers: "77% are buyers now",
    period: "30 days",
    icon: "🥇",
    iconStyle: { background: "rgba(255,215,0,0.2)" },
  },
  {
    id: "bitcoin",
    tvSymbol: "BTCUSDT",
    chartTitle: "Bitcoin / U.S. Dollar",
    name: "Bitcoin",
    ticker: "BTC/USD",
    large: true,
    change: "+5.23%",
    changeUp: true,
    flicker: { initial: 68000.0, vol: 0.005, decimals: 2 },
    mini: { base: 68000, n: 30, vol: 0.01, up: true },
    buyers: "80% are buyers now",
    period: "30 days",
    icon: "₿",
    iconStyle: { background: "rgba(247,147,26,0.2)" },
  },
  {
    id: "eurusd",
    tvSymbol: "EURUSD",
    chartTitle: "Euro / U.S. Dollar",
    name: "EUR/USD",
    ticker: "EUR/USD",
    change: "-0.01%",
    changeUp: false,
    flicker: { initial: 1.15151, vol: 0.00008, decimals: 5 },
    mini: { base: 1.1515, n: 30, vol: 0.0008, up: false },
    buyers: "52% are buyers now",
    icon: "�",
  },
  {
    id: "gbpusd",
    tvSymbol: "GBPUSD",
    chartTitle: "British Pound / U.S. Dollar",
    name: "GBP/USD",
    ticker: "GBP/USD",
    change: "+0.15%",
    changeUp: true,
    flicker: { initial: 1.26543, vol: 0.00008, decimals: 5 },
    mini: { base: 1.265, n: 30, vol: 0.0008, up: true },
    buyers: "48% are buyers now",
    icon: "💷",
  },
  {
    id: "usdjpy",
    tvSymbol: "USDJPY",
    chartTitle: "U.S. Dollar / Japanese Yen",
    name: "USD/JPY",
    ticker: "USD/JPY",
    change: "-0.32%",
    changeUp: false,
    flicker: { initial: 154.23, vol: 0.002, decimals: 2 },
    mini: { base: 154.2, n: 30, vol: 0.008, up: false },
    buyers: "61% are buyers now",
    icon: "💷",
  },

  {
    id: "silver",
    tvSymbol: "XAGUSD",
    chartTitle: "Silver Spot / U.S. Dollar",
    name: "SILVER (XAG/USD)",
    ticker: "XAG/USD",
    change: "+0.5%",
    changeUp: true,
    flicker: { initial: 72.943, vol: 0.002, decimals: 3 },
    mini: { base: 73, n: 20, vol: 0.015, up: true },
    buyers: "65% are buyers now",
    icon: "🥈",
  },
  {
    id: "oil",
    tvSymbol: "USOIL",
    chartTitle: "CFDs on Crude Oil (WTI)",
    name: "OIL (WTI - USOIL)",
    ticker: "USOIL",
    change: "+10.49%",
    changeUp: true,
    flicker: { initial: 104.316, vol: 0.002 },
    mini: { base: 104, n: 30, vol: 0.012, up: true },
    buyers: "55% are buyers now",
    period: "30 days",
    icon: "🛢️",
  },
  {
    id: "brent",
    tvSymbol: "UKOIL",
    chartTitle: "CFDs on Brent Crude Oil",
    name: "UK-OIL (Brent - UKOIL)",
    ticker: "UKOIL",
    change: "+2.23%",
    changeUp: true,
    flicker: { initial: 93.62, vol: 0.002 },
    mini: { base: 93.6, n: 20, vol: 0.012, up: true },
    buyers: "49% are buyers now",
    icon: "⛽",
  },
  {
    id: "usoil",
    tvSymbol: "USOIL",
    chartTitle: "CFDs on Crude Oil (WTI)",
    name: "US-OIL (WTI)",
    ticker: "USOIL",
    change: "+10.49%",
    changeUp: true,
    flicker: { initial: 104.316, vol: 0.002 },
    mini: { base: 104, n: 30, vol: 0.012, up: true },
    buyers: "55% are buyers now",
    period: "30 days",
    icon: "🛢️",
  },
];

const QUOTE_POLL_MS = 20_000;

function makeData(base: number, n = 30, vol = 0.02) {
  let v = base;
  return Array.from({ length: n }, () => {
    v *= 1 + (Math.random() - 0.48) * vol;
    return +v.toFixed(3);
  });
}

function MiniLineChart({
  series,
  base,
  n,
  vol,
  up,
}: {
  series?: number[];
  base: number;
  n?: number;
  vol?: number;
  up: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hasLive =
      series != null && Array.isArray(series) && series.length >= 2;
    const data = hasLive
      ? series
      : makeData(base, n ?? 30, vol ?? 0.02);
    const chartUp = hasLive
      ? (data[data.length - 1] ?? 0) >= (data[0] ?? 0)
      : up;

    const col = chartUp ? "rgba(0,230,118," : "rgba(255,23,68,";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [
          {
            data,
            borderColor: `${col}0.9)`,
            borderWidth: 1.5,
            fill: true,
            backgroundColor: (context) => {
              const g = context.chart.ctx.createLinearGradient(0, 0, 0, 80);
              g.addColorStop(0, `${col}0.3)`);
              g.addColorStop(1, `${col}0)`);
              return g;
            },
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: { duration: hasLive ? 600 : 1000 },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [series, base, n, vol, up]);

  return <canvas ref={canvasRef} />;
}

function FlickerPrice({
  initial,
  vol = 0.002,
  decimals,
}: {
  initial: number;
  vol?: number;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(initial);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDisplay((prev) => {
        const next = prev * (1 + (Math.random() - 0.5) * vol);
        const d = decimals ?? (next > 100 ? 2 : 3);
        return +next.toFixed(d);
      });
      setFlash(Math.random() > 0.5 ? "up" : "down");
      window.setTimeout(() => setFlash(null), 300);
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [vol, decimals]);

  return (
    <span
      style={
        flash === "up"
          ? { color: "#00E676" }
          : flash === "down"
            ? { color: "#FF1744" }
            : undefined
      }
    >
      {display}
    </span>
  );
}

function useMarketQuotes(pollMs: number) {
  const [quotes, setQuotes] = useState<
    Partial<Record<MarketId, LiveMarketQuote>>
  >({});
  const [feedOk, setFeedOk] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/market-quotes", { cache: "no-store" });
      const j = (await r.json()) as MarketQuotesResponse;
      setFeedOk(j.ok);
      setQuotes(j.quotes);
    } catch {
      setFeedOk(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = window.setInterval(load, pollMs);
    return () => clearInterval(t);
  }, [load, pollMs]);

  return { quotes, feedOk };
}

function MarketCard({
  instrument,
  live,
  onOpenChart,
}: {
  instrument: MarketInstrument;
  live?: LiveMarketQuote;
  onOpenChart: (symbol: string, title: string) => void;
}) {
  const { mini, flicker } = instrument;
  const cardClass = [
    "mcard",
    instrument.large ? "large" : "",
    instrument.wide ? "wide" : "",
    "mcard--clickable",
  ]
    .filter(Boolean)
    .join(" ");

  const open = useCallback(() => {
    onOpenChart(instrument.tvSymbol, instrument.chartTitle);
  }, [instrument.chartTitle, instrument.tvSymbol, onOpenChart]);

  const changeLive =
    live != null ? formatChangePercent(live.changePercent) : null;
  const changeShow = changeLive ?? {
    text: instrument.change,
    up: instrument.changeUp,
  };

  const sparkline =
    live?.sparkline && live.sparkline.length >= 2
      ? live.sparkline
      : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      className={cardClass}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="mcard-top">
        <div className="mcard-icon" style={instrument.iconStyle}>
          {instrument.icon}
        </div>
        <div>
          <div className="mcard-name">{instrument.name}</div>
          {instrument.ticker ? (
            <div className="mcard-sym">{instrument.ticker}</div>
          ) : null}
        </div>
        <span
          className={`mcard-change${changeShow.up ? " up" : " dn"}`}
        >
          {changeShow.text}
        </span>
      </div>
      <div className="mcard-price">
        {live != null ? (
          formatMarketPrice(instrument.id, live.price)
        ) : (
          <FlickerPrice
            initial={flicker.initial}
            vol={flicker.vol}
            decimals={flicker.decimals}
          />
        )}
      </div>
      {instrument.buyers ? (
        <div className="mcard-buyers">{instrument.buyers}</div>
      ) : null}
      <div className="mcard-chart">
        <MiniLineChart
          series={sparkline}
          base={mini.base}
          n={mini.n}
          vol={mini.vol}
          up={mini.up}
        />
      </div>
      {instrument.period ? (
        <div className="mcard-period">{instrument.period}</div>
      ) : null}
    </div>
  );
}

export function MarketView({ hideHeader = false }: MarketViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [gridFlash, setGridFlash] = useState(false);
  const [chartModal, setChartModal] = useState<{
    symbol: string;
    title: string;
  } | null>(null);

  const { quotes, feedOk } = useMarketQuotes(QUOTE_POLL_MS);

  const onTab = (index: number) => {
    const tabLabels = ["all", "forex", "commodities", "indexes"] as const;
    posthog.capture("market_tab_switched", { tab: tabLabels[index] });
    setActiveTab(index);
    setGridFlash(true);
    window.setTimeout(() => setGridFlash(false), 200);
  };

  const onOpenChart = useCallback((symbol: string, title: string) => {
    posthog.capture("market_chart_opened", { symbol, chart_title: title });
    setChartModal({ symbol, title });
  }, []);

  const closeChart = useCallback(() => setChartModal(null), []);

  const filteredMarkets = (() => {
    const tabId = (["all", "forex", "commodities", "indexes"] as const)[
      activeTab
    ];
    if (tabId === "forex") {
      return MARKETS.filter((m) => ["eurusd", "gbpusd", "usdjpy"].includes(m.id));
    }
    if (tabId === "commodities") {
      return MARKETS.filter((m) =>
        ["gold", "silver", "oil", "brent", "usoil"].includes(m.id)
      );
    }
    if (tabId === "indexes") {
      return MARKETS.filter((m) => ["ger30", "fra40", "us30"].includes(m.id));
    }
    return MARKETS.slice(0, 9);
  })();

  return (
    <section id="market" style={hideHeader ? { paddingTop: '0' } : undefined}>
      <TradingViewModal
        open={chartModal !== null}
        onClose={closeChart}
        symbol={chartModal?.symbol ?? ""}
        title={chartModal?.title ?? ""}
        subtitle={chartModal?.symbol}
      />

      {!hideHeader && (
        <div className="market-header reveal">
          <div>
            <div className="section-label">Live Markets</div>
            <h2 className="section-title">
              Trade Intuitively on
              <br />
              <span className="gold-text">Thousands of CFDs</span>
            </h2>
            <p
              className="section-desc"
              style={{ marginTop: "0.5rem", marginBottom: 0 }}
            >
              Tap any instrument for a live TradingView chart. Card prices and
              sparklines refresh about every {QUOTE_POLL_MS / 1000}s via Yahoo
              Finance (unofficial feed; may be delayed).
              {!feedOk ? (
                <span style={{ display: "block", marginTop: "0.35rem" }}>
                  Showing demo motion until quotes load.
                </span>
              ) : null}
            </p>
          </div>
          <div className="market-tabs">
          {(
            [
              ["all", "All"],
              ["forex", "Forex"],
              ["commodities", "Commodities"],
              ["indexes", "Indexes"],
            ] as const
          ).map(([id, label], i) => (
            <button
              key={id}
              type="button"
              className={`mtab${activeTab === i ? " active" : ""}`}
              onClick={() => onTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      )}

      <div
        className="market-grid reveal"
        id="market-grid"
        style={{
          opacity: gridFlash ? 0 : 1,
          transform: gridFlash ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        {filteredMarkets.map((m) => (
          <MarketCard
            key={m.id}
            instrument={m}
            live={quotes[m.id]}
            onOpenChart={onOpenChart}
          />
        ))}
      </div>
    </section>
  );
}

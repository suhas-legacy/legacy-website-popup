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
import Link from "next/link";

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
  tvSymbol: string;
  chartTitle: string;
  name: string;
  ticker?: string;
  large?: boolean;
  wide?: boolean;
  change: string;
  changeUp: boolean;
  flicker: { initial: number; vol?: number; decimals?: number };
  mini: { base: number; n?: number; vol?: number; up: boolean };
  buyers?: string;
  period?: string;
  icon: string;
  iconStyle?: CSSProperties;
};

const MARKETS: MarketInstrument[] = [
  {
    id: "gold",
    tvSymbol: "OANDA:XAUUSD",
    chartTitle: "Gold Spot / U.S. Dollar",
    name: "Gold",
    ticker: "XAUUSD",
    large: true,
    change: "+2.1%",
    changeUp: true,
    flicker: { initial: 4730.68, vol: 0.001 },
    mini: { base: 4700, n: 30, vol: 0.01, up: true },
    buyers: "77% are buyers now",
    period: "30 days",
    icon: "🥇",
    iconStyle: { background: "rgba(255,215,0,0.2)" },
  },
  {
    id: "eurusd",
    tvSymbol: "KRAKEN:EURUSD",
    chartTitle: "Euro / U.S. Dollar",
    name: "EUR/USD",
    ticker: "EUR/USD",
    wide: true,
    change: "-0.01%",
    changeUp: false,
    flicker: { initial: 1.15151, vol: 0.00008, decimals: 5 },
    mini: { base: 1.1515, n: 30, vol: 0.0008, up: false },
    buyers: "Kraken · major FX pair",
    icon: "💶",
  },
  {
    id: "oil",
    tvSymbol: "CXM:USOIL",
    chartTitle: "CFDs on Crude Oil (WTI)",
    name: "Oil",
    ticker: "USOIL",
    large: true,
    change: "+10.49%",
    changeUp: true,
    flicker: { initial: 104.316, vol: 0.002 },
    mini: { base: 104, n: 30, vol: 0.012, up: true },
    buyers: "55% are buyers now",
    period: "30 days",
    icon: "🛢️",
  },
  {
    id: "us30",
    tvSymbol: "SKILLING:US30",
    chartTitle: "Dow Jones Industrial Average Index",
    name: "Dow Jones Index",
    ticker: "US30",
    change: "-0.27%",
    changeUp: false,
    flicker: { initial: 46392.9, vol: 0.001 },
    mini: { base: 46400, n: 20, vol: 0.008, up: false },
    icon: "🇺🇸",
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

export function MarketPreview() {
  const [chartModal, setChartModal] = useState<{
    symbol: string;
    title: string;
  } | null>(null);

  const { quotes } = useMarketQuotes(QUOTE_POLL_MS);

  const onOpenChart = useCallback((symbol: string, title: string) => {
    setChartModal({ symbol, title });
  }, []);

  const closeChart = useCallback(() => setChartModal(null), []);

  return (
    <section className="market-preview-section">
      <TradingViewModal
        open={chartModal !== null}
        onClose={closeChart}
        symbol={chartModal?.symbol ?? ""}
        title={chartModal?.title ?? ""}
        subtitle={chartModal?.symbol}
      />

      <div className="section-label reveal">Live Markets</div>
      <h2 className="section-title reveal">
        Trade Intuitively on <span className="gold-text">Global Markets</span>
      </h2>
      
      <div className="market-grid reveal">
        {MARKETS.slice(0, 4).map((m) => (
          <MarketCard
            key={m.id}
            instrument={m}
            live={quotes[m.id]}
            onOpenChart={onOpenChart}
          />
        ))}
      </div>

      <div className="preview-cta reveal">
        <Link href="/market" className="btn-outline">
          View All Markets →
        </Link>
      </div>
    </section>
  );
}

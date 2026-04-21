"use client";

import { useState, useEffect, useId, useCallback } from "react";
import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";
import { PipCalculator } from "./PipCalculator";
import { MarginCalculator } from "./MarginCalculator";
import { LotSizeCalculator } from "./LotSizeCalculator";
import { ProfitCalculator } from "./ProfitCalculator";
import { CompactMarginCalculator } from "./CompactMarginCalculator";

// API symbols mapping
const priceApiSymbols: Record<string, string> = {
  "OANDA:EURUSD": "EURUSD",
  "OANDA:GBPUSD": "GBPUSD",
  "OANDA:USDJPY": "USDJPY",
  "OANDA:AUDUSD": "AUDUSD",
  "OANDA:USDCAD": "USDCAD",
  "OANDA:XAUUSD": "XAUUSD",
  "OANDA:XAGUSD": "XAGUSD",
  "CAPITALCOM:USOIL": "USOIL",
};

const instruments = [
  { symbol: "OANDA:EURUSD", name: "EUR/USD", price: 1.08500, type: "forex" },
  { symbol: "OANDA:GBPUSD", name: "GBP/USD", price: 1.26500, type: "forex" },
  { symbol: "OANDA:USDJPY", name: "USD/JPY", price: 149.500, type: "forex" },
  { symbol: "OANDA:AUDUSD", name: "AUD/USD", price: 0.65800, type: "forex" },
  { symbol: "OANDA:USDCAD", name: "USD/CAD", price: 1.35200, type: "forex" },
  { symbol: "OANDA:USDCHF", name: "USD/CHF", price: 0.92400, type: "forex" },
  { symbol: "OANDA:XAUUSD", name: "XAUUSD", price: 2650.0, type: "metal" },
  { symbol: "OANDA:XAGUSD", name: "XAGUSD", price: 28.50, type: "metal" },
  { symbol: "CAPITALCOM:USOIL", name: "USOIL", price: 74.500, type: "commodity" },
  { symbol: "CAPITALCOM:UKOIL", name: "UKOIL", price: 78.200, type: "commodity" },
];

// Fetch live prices from local API
async function fetchLivePrices() {
  try {
    const response = await fetch("/api/market-quotes", {
      cache: "no-store",
    });
    
    if (!response.ok) throw new Error("Failed to fetch");
    
    const data = await response.json();
    
    if (!data.ok || !data.quotes) return null;
    
    // Map API response to price format
    const quotes = data.quotes;
    
    return {
      EURUSD: quotes.eurusd?.price || 1.085,
      GBPUSD: 1.265, // Not in API, use default
      USDJPY: 149.5, // Not in API, use default
      AUDUSD: 0.658, // Not in API, use default
      USDCAD: 1.352, // Not in API, use default
      XAUUSD: quotes.gold?.price || 4783.0,
      XAGUSD: quotes.silver?.price || 28.2,
      USOIL: quotes.oil?.price || 74.5,
    };
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    return null;
  }
}

const lotSizes = [
  { value: 0.01, label: "Micro (0.01)", units: 1000 },
  { value: 0.1, label: "Mini (0.10)", units: 10000 },
  { value: 1, label: "Standard (1.00)", units: 100000 },
];

// Center-Focus Testimonial Carousel Component
interface GalleryItem {
  pair: string;
  base: string;
  quote: string;
}

interface CenterCarouselProps {
  items: GalleryItem[];
  onItemClick?: (item: GalleryItem) => void;
}

function CenterCarousel({ items, onItemClick }: CenterCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const itemCount = items.length;

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % itemCount);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating, itemCount]);

  const handleSelect = (index: number) => {
    setIsAutoRotating(false);
    setSelectedIndex(index);
    onItemClick?.(items[index]);
  };

  const handlePrev = () => {
    const newIndex = (selectedIndex - 1 + itemCount) % itemCount;
    setIsAutoRotating(false);
    setSelectedIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (selectedIndex + 1) % itemCount;
    setIsAutoRotating(false);
    setSelectedIndex(newIndex);
  };

  const getItemStyle = (index: number) => {
    const diff = index - selectedIndex;
    const normalizedDiff = ((diff + itemCount) % itemCount);
    const adjustedDiff = normalizedDiff > itemCount / 2 ? normalizedDiff - itemCount : normalizedDiff;
    
    const isCenter = index === selectedIndex;
    const isVisible = Math.abs(adjustedDiff) <= 1;
    
    if (!isVisible) {
      return {
        opacity: 0,
        transform: 'scale3d(0.5, 0.5, 1) translateX(' + (adjustedDiff * 400) + 'px)',
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    return {
      opacity: isCenter ? 1 : 0.3,
      transform: isCenter 
        ? 'scale3d(1, 1, 1) translateX(0)' 
        : `scale3d(0.8, 0.8, 1) translateX(${adjustedDiff * 320}px)`,
      zIndex: isCenter ? 10 : 5 - Math.abs(adjustedDiff),
    };
  };

  return (
    <div className="center-carousel-container">
      <div className="center-carousel-track">
        {items.map((item, index) => (
          <div
            key={index}
            className={`center-carousel-item ${index === selectedIndex ? "active" : ""}`}
            style={getItemStyle(index)}
            onClick={() => handleSelect(index)}
          >
            <div className="carousel-card">
              <div className="card-header">
                <div className="pair-symbol">{item.pair}</div>
              </div>
              <div className="card-body">
                <div className="currency-info">
                  <span className="currency-name">{item.base}</span>
                  <span className="currency-divider">/</span>
                  <span className="currency-name">{item.quote}</span>
                </div>
              </div>
              <div className="card-footer">
                <button className="calculate-btn">Calculate Margin</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="center-carousel-controls">
        <button className="nav-btn prev" onClick={handlePrev}>←</button>
        <div className="carousel-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === selectedIndex ? "active" : ""}`}
              onClick={() => handleSelect(idx)}
            />
          ))}
        </div>
        <button className="nav-btn next" onClick={handleNext}>→</button>
      </div>
    </div>
  );
}

// Modal Component for Margin Calculator
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

const educationSections = [
  {
    id: "forex-basics",
    title: "What is Forex?",
    icon: "📊",
    content: {
      heading: "WHAT IS FOREX (FX)?",
      description: "Foreign Exchange (Forex or FX) is the world's largest financial market where currencies are traded 24 hours a day, 5 days a week. With over $7.5 trillion traded daily, Forex offers high liquidity, flexibility and opportunity for traders at all levels.",
      cards: [
        {
          label: "Operates 24 Hours a Day, 5 Days a Week ....",

          popup: {
            title: "FOREX NEVER SLEEPS — 24/5 MARKET ACCESS",
            description: "The Forex market operates continuously from Monday morning (Sydney open) to Friday evening (New York close) — giving traders around the world the freedom to trade at any time of day or night.",
            table: {
              headers: ["Session", "Opens", "Closes", "Key Pairs"],
              rows: [
                ["Sydney", "10:00 PM GMT", "7:00 AM GMT", "AUD/USD, NZD/USD"],
                ["Tokyo", "12:00 AM GMT", "9:00 AM GMT", "USD/JPY, EUR/JPY"],
                ["London", "8:00 AM GMT", "5:00 PM GMT", "GBP/USD, EUR/USD"],
                ["New York", "1:00 PM GMT", "10:00 PM GMT", "USD/CAD, USD/CHF"]
              ]
            },
            bullets: [
              "Trade before or after your regular job",
              "React instantly to breaking economic news",
              "Best volatility occurs when two sessions overlap (London + New York)",
              "No waiting for markets to 'open' like with stocks"
            ]
          }
        },
        {
          label: "Includes All Currencies of the World",
          viewMore: true,
          popup: {
            title: "EVERY CURRENCY. ONE GLOBAL MARKET.",
            description: "The Forex market includes every official currency on the planet — from the US Dollar and Euro to exotic currencies like the Thai Baht or South African Rand. Currencies are always traded in pairs, meaning you simultaneously buy one currency and sell another.",
            table: {
              headers: ["Type", "Examples", "Characteristic"],
              rows: [
                ["Major Pairs", "EUR/USD, GBP/USD, USD/JPY", "Highest liquidity, tightest spreads"],
                ["Minor Pairs", "EUR/GBP, AUD/JPY, GBP/CAD", "Moderate liquidity, slightly wider spreads"],
                ["Exotic Pairs", "USD/TRY, EUR/ZAR, USD/MXN", "Lower liquidity, higher volatility"]
              ]
            },
            bullets: [
              "Over 180 currencies recognized worldwide",
              "USD is involved in nearly 88% of all Forex trades",
              "EUR/USD is the most traded pair globally",
              "Exotic pairs offer bigger moves but carry higher risk"
            ]
          }
        },
        {
          label: "Average Daily Trading Volume in the Trillions",
          popup: {
            title: "$7.5 TRILLION TRADED EVERY SINGLE DAY",
            description: "The Forex market is the largest and most liquid financial market in the entire world — dwarfing the stock market, bond market, and all commodity markets combined. Over $7.5 trillion changes hands every single day.",
            table: {
              headers: ["Market", "Daily Volume"],
              rows: [
                ["Forex (FX)", "$7.5 Trillion"],
                ["Stock Markets", "$200–300 Billion"],
                ["Gold Market", "$180 Billion"],
                ["Crypto Market", "$100 Billion"],
                ["Oil Market", "$60 Billion"]
              ]
            },
            bullets: [
              "Extremely high liquidity — your orders fill instantly",
              "No single bank or institution can manipulate the market",
              "Tight spreads due to massive competition between buyers and sellers",
              "You can enter and exit trades of any size at any time",
              "Price movements are driven by real global economic forces"
            ]
          }
        },
        {
          label: "Also Referred to as FOREX, FX, or Spot FX",
          popup: {
            title: "FOREX vs FX vs SPOT FX — WHAT'S THE DIFFERENCE?",
            description: "You'll often see the currency market referred to by different names. They all refer to the same global marketplace, but each term highlights a slightly different context or trading method.",
            table: {
              headers: ["Term", "What It Means"],
              rows: [
                ["FOREX", "Full word — Foreign Exchange. Used in formal and educational contexts"],
                ["FX", "Shortened version of Foreign Exchange. Used by professionals and brokers"],
                ["Spot FX", "Currency trades settled 'on the spot' — at the current live market price"],
                ["FX CFDs", "Contracts for Difference on currency pairs — trade price movements without owning the actual currency"],
                ["Currency Trading", "General public term for Forex/FX trading"]
              ]
            },
            bullets: [
              "Spot Forex — real-time currency exchange at live market prices",
              "Forex CFDs — profit from both rising and falling currency markets",
              "Leveraged FX — control larger positions with a smaller capital outlay",
              "Whether you call it Forex, FX, or Spot FX — Legacy Global Bank gives you full access to all of it"
            ]
          }
        }
      ]
    },
  },
  {
    id: "trading-mechanics",
    title: "How It Works",
    icon: "⚙️",
    content: {
      heading: "HOW FOREX TRADING WORKS — AND HOW TO GET STARTED",
      description: "As your Forex broker, Legacy Global Bank gives you direct access to the global currency market. You decide what to trade, when to trade, and how much to trade — we provide the platform, execution, and tools to make it happen.",
      cards: [
        {
          label: "Buy & sell currency pairs through our broker platform",
          popup: {
            title: "HOW FOREX PROFITS WORK",
            description: "In Forex trading, you profit from the difference between the price you buy a currency pair and the price you sell it. As your broker, Legacy Global Bank executes both sides of your trade instantly at live market prices.",
            table: {
              headers: ["Action", "Rate", "Position"],
              rows: [
                ["You BUY EUR/USD", "1.0800", "You go Long"],
                ["Price rises to", "1.0900", "Market moves in your favour"],
                ["You SELL EUR/USD", "1.0900", "Trade closed"],
                ["Your Profit", "100 pips", "Credited to your account"]
              ]
            },
            bullets: [
              "Legacy Global Bank executes your trades — we do not give buy or sell advice",
              "You control your own trading decisions at all times",
              "Profits and losses are calculated in pips and credited/debited in real time",
              "We charge a small spread or commission per trade — that is how we earn as your broker",
              "All profits go directly into your trading account"
            ]
          }
        },
        {
          label: "Live Forex rates updated every millisecond on our platform",
          popup: {
            title: "WHY CURRENCY PRICES MOVE — AND HOW YOU TRADE IT",
            description: "Currency values change every second of every trading day. These price movements are what create trading opportunities. As a broker, Legacy Global Bank gives you real-time price feeds so you always see the live market rate.",
            table: {
              headers: ["Cause", "Example"],
              rows: [
                ["Interest Rate Decisions", "US Fed raises rates → USD strengthens"],
                ["Inflation Data", "High UK inflation → GBP may weaken"],
                ["Employment Reports", "Strong US jobs data → USD rises"],
                ["Political Events", "Elections, policy changes → volatility spikes"],
                ["Trade Balance Data", "Country exports more → currency strengthens"],
                ["Market Sentiment", "Risk-on mood → AUD, NZD gain"]
              ]
            },
            bullets: [
              "More price movement = more trading opportunities",
              "Both rising AND falling markets can be profitable with CFDs",
              "Legacy Global Bank provides real-time charts and price alerts — you make the call",
              "We do not predict where prices go — we give you the tools to decide for yourself"
            ]
          }
        },
        {
          label: "Full trading control — we never advise, we only execute",
          popup: {
            title: "YOUR ANALYSIS. YOUR DECISION. OUR EXECUTION.",
            description: "At Legacy Global Bank, we are a pure execution broker. You analyze the market, make your trading decision, and we execute it at the best available price — instantly.",
            table: {
              headers: ["Method", "What It Involves"],
              rows: [
                ["Technical Analysis", "Reading price charts, patterns, indicators like RSI, MACD"],
                ["Fundamental Analysis", "Tracking economic data, news events, central bank decisions"],
                ["Sentiment Analysis", "Gauging whether the majority of traders are buying or selling"],
                ["Price Action Trading", "Making decisions based purely on candlestick and chart patterns"]
              ]
            },
            bullets: [
              "Legacy Global Bank does not provide trading signals or investment advice",
              "We do not manage your funds or make trades on your behalf",
              "All trading decisions are made solely by you, the client",
              "We provide the platform, execution, liquidity and support — you provide the strategy",
              "Our Education Hub is for learning purposes only — not financial advice"
            ]
          }
        },
        {
          label: "See how a live Forex trade works through Legacy Global Bank",
          popup: {
            title: "A REAL FOREX TRADE EXAMPLE — HOW IT WORKS ON OUR PLATFORM",
            description: "Here is a straightforward example of how a Forex trade works when placed through Legacy Global Bank's trading platform. This is an educational example only — not a recommendation to trade.",
            table: {
              headers: ["Step", "Detail"],
              rows: [
                ["Instrument", "EUR/USD"],
                ["Your Action", "BUY EUR/USD (go Long)"],
                ["Entry Price", "1.0750"],
                ["Position Size", "1 Standard Lot (100,000 units)"],
                ["Leverage Used", "1:100"],
                ["Margin Required", "$1,075"],
                ["Stop Loss Set", "1.0700 (50 pip risk)"],
                ["Take Profit Set", "1.0850 (100 pip target)"]
              ]
            },
            additionalTables: [
              {
                title: "Outcome if Take Profit Hit:",
                headers: ["Result", "Value"],
                rows: [
                  ["Pips Gained", "100 pips"],
                  ["Profit Earned", "~$1,000"],
                  ["Margin Released", "$1,075 returned"],
                  ["Total Account Credit", "$2,075"]
                ]
              },
              {
                title: "Outcome if Stop Loss Hit:",
                headers: ["Result", "Value"],
                rows: [
                  ["Pips Lost", "50 pips"],
                  ["Loss", "~$500"]
                ]
              }
            ],
            brokerNote: "Legacy Global Bank executes this trade on your behalf at live market prices. We do not advise whether to buy or sell. Risk management — including stop losses and position sizing — is entirely your responsibility as the trader."
          }
        }
      ]
    },
  },
  {
    id: "pips-spreads",
    title: "PIPs & Spreads",
    icon: "📈",
    content: {
      heading: "PIPS AND SPREADS EXPLAINED",
      description: "A pip is the smallest unit of price movement in the Forex market. The spread is the difference between the Buy (Ask) and Sell (Bid) price — and it is how Legacy Global Bank earns as your execution broker. No hidden fees. No surprises. Just transparent trading costs on every single trade.",
      cards: [
        {
          label: "What is a pip in Forex trading?",
          popup: {
            title: "WHAT IS A PIP — AND WHY IT MATTERS",
            description: "A pip (Point in Percentage) is the smallest standardized price movement in a Forex currency pair. Understanding pips helps you measure profit, loss and market movement accurately.",
            table: {
              headers: ["Pair Type", "Pip Location", "Example"],
              rows: [
                ["Most Pairs (4 decimal)", "4th decimal place", "EUR/USD: 1.0801 → 1.0802 = 1 pip"],
                ["JPY Pairs (2 decimal)", "2nd decimal place", "USD/JPY: 110.01 → 110.02 = 1 pip"],
                ["Pipette (5th decimal)", "5th decimal place", "EUR/USD: 1.08011 → 1.08012 = 0.1 pip"]
              ]
            },
            additionalTables: [
              {
                title: "Pip Value Per Lot:",
                headers: ["Lot Size", "Units", "Pip Value (EUR/USD)"],
                rows: [
                  ["Standard Lot", "100,000", "~$10 per pip"],
                  ["Mini Lot", "10,000", "~$1 per pip"],
                  ["Micro Lot", "1,000", "~$0.10 per pip"]
                ]
              }
            ],
            example: "- You buy EUR/USD at 1.0800 and sell at 1.0850\n- That is a 50 pip move\n- On 1 standard lot = $500 profit\n- Legacy Global Bank displays all prices in real-time pip movements on your trading platform"
          }
        },
        {
          label: "What is a spread and how is it charged?",
          popup: {
            title: "WHAT IS THE SPREAD — YOUR BROKER'S TRANSPARENT COST",
            description: "The spread is the difference between the Buy (Ask) price and the Sell (Bid) price of a currency pair. It is Legacy Global Bank's primary charge for executing your trade — fully transparent with no hidden fees.",
            table: {
              headers: ["Price Type", "Rate", "Explanation"],
              rows: [
                ["Ask (Buy) Price", "1.08010", "Price you pay to BUY"],
                ["Bid (Sell) Price", "1.08000", "Price you receive to SELL"],
                ["Spread", "1.0 pip", "Broker's execution cost"]
              ]
            },
            additionalTables: [
              {
                title: "Legacy Global Bank Spreads by Account:",
                headers: ["Account Type", "EUR/USD Spread", "GBP/USD Spread", "Gold Spread"],
                rows: [
                  ["Standard", "From 1.2 pips", "From 1.5 pips", "From 0.3 pips"],
                  ["Pro", "From 0.4 pips", "From 0.6 pips", "From 0.2 pips"],
                  ["VIP", "From 0.0 pips", "From 0.1 pips", "From 0.1 pips"]
                ]
              }
            ],
            bullets: [
              "Spread is charged the moment you open a trade",
              "Lower spread = lower cost per trade",
              "VIP accounts get raw spreads + small commission",
              "No hidden charges — what you see is what you pay"
            ]
          }
        },
        {
          label: "Fixed spreads vs variable spreads — which is better?",
          popup: {
            title: "FIXED vs VARIABLE SPREADS — WHAT'S RIGHT FOR YOU?",
            description: "Legacy Global Bank offers both fixed and variable spread options depending on your account type and trading style.",
            table: {
              headers: ["Feature", "Fixed Spread", "Variable Spread"],
              rows: [
                ["Cost during quiet market", "Higher than variable", "Lower — tighter"],
                ["Cost during news events", "Stays the same", "Can widen significantly"],
                ["Best for", "Beginners, news traders", "Scalpers, experienced traders"],
                ["Predictability", "High — you always know cost", "Lower — spreads fluctuate"],
                ["Requotes", "Possible", "Rare with ECN execution"]
              ]
            },
            bullets: [
              "Beginners → Standard Account (fixed-style spreads, predictable costs)",
              "Active Traders → Pro Account (variable, tighter spreads)",
              "Professional Traders → VIP Account (raw spreads from 0.0 pips + commission)",
              "Note: Legacy Global Bank does not advise which account suits your trading — this is for educational purposes only"
            ]
          }
        },
        {
          label: "How do pips and spreads affect my trading profit?",
          popup: {
            title: "PIPS, SPREADS & YOUR REAL TRADING PROFIT",
            description: "Every trade you place starts slightly in the negative because of the spread. Understanding this helps you plan your trades more effectively.",
            table: {
              headers: ["Detail", "Value"],
              rows: [
                ["Buy Price (Ask)", "1.08012"],
                ["Sell Price (Bid)", "1.08000"],
                ["Spread Cost", "1.2 pips"],
                ["Lot Size", "1 Standard Lot"],
                ["Spread Cost in $", "$12"]
              ]
            },
            additionalTables: [
              {
                title: "Why Tight Spreads Matter:",
                headers: ["Spread", "50 Pip Trade Profit", "20 Pip Trade Profit"],
                rows: [
                  ["0.0 pips (VIP)", "$500", "$200"],
                  ["0.4 pips (Pro)", "$496", "$196"],
                  ["1.2 pips (Standard)", "$488", "$188"],
                  ["3.0 pips (High)", "$470", "$170"]
                ]
              }
            ],
            note: "The tighter your spread, the more of the market's movement becomes your profit. That is why choosing the right account type and broker matters."
          }
        }
      ]
    },
  },
  {
    id: "currency-pairs",
    title: "Currency Pairs",
    icon: "💱",
    content: {
      heading: "Understanding Currency Pairs",
      description: "Currencies are always quoted in pairs. The first currency is the Base Currency, the second is the Quote Currency.",
      pairs: [
        { pair: "EUR/USD", base: "Euro", quote: "US Dollar" },
        { pair: "USD/JPY", base: "US Dollar", quote: "Japanese Yen" },
        { pair: "GBP/USD", base: "British Pound", quote: "US Dollar" },
        { pair: "USD/CHF", base: "US Dollar", quote: "Swiss Franc" },
        { pair: "XAUUSD", base: "Gold", quote: "USD" },
        { pair: "XAGUSD", base: "Silver", quote: "USD" },
        { pair: "UKOIL", base: "UK Oil", quote: "USD" },
        { pair: "USOIL", base: "US Oil", quote: "USD" },
      ],
    },
  },
  {
    id: "lot-sizes",
    title: "Lot Sizes",
    icon: "📦",
    content: {
      heading: "Trade Size (Lot Size)",
      description: "Lot is the unit used to measure the volume or size of a trade. Different instruments have different lot specifications.",
      tables: [
        {
          title: "Currency Pairs",
          rows: [
            { lot: "MICRO", size: "0.01", units: "1,000", pip: "$0.10" },
            { lot: "MINI", size: "0.10", units: "10,000", pip: "$1" },
            { lot: "STD", size: "1.00", units: "100,000", pip: "$10" },
          ],
        },
        {
          title: "Gold (XAUUSD) & Oil (USOUSD)",
          rows: [
            { lot: "MICRO", size: "0.01", units: "1", pip: "$0.01" },
            { lot: "MINI", size: "0.10", units: "10", pip: "$0.10" },
            { lot: "STD", size: "1.00", units: "100", pip: "$1" },
          ],
        },
        {
          title: "Silver (XAGUSD)",
          rows: [
            { lot: "MICRO", size: "0.01", units: "50", pip: "$0.01" },
            { lot: "MINI", size: "0.10", units: "500", pip: "$0.10" },
            { lot: "STD", size: "1.00", units: "500", pip: "$1" },
          ],
        },
      ],
    },
  },
];

// Popup Component for Education Cards
interface EducationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  popup: {
    title: string;
    description: string;
    table?: {
      headers: string[];
      rows: string[][];
    };
    additionalTables?: {
      title: string;
      headers: string[];
      rows: string[][];
    }[];
    bullets?: string[];
    example?: string;
    note?: string;
    brokerNote?: string;
  };
}

function EducationPopup({ isOpen, onClose, popup }: EducationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="education-popup-overlay" onClick={onClose}>
      <div className="education-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="education-popup-close" onClick={onClose}>×</button>
        <h3 className="popup-title">{popup.title}</h3>
        <p className="popup-description">{popup.description}</p>
        
        {popup.table && (
          <div className="popup-table">
            <table>
              <thead>
                <tr>
                  {popup.table.headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {popup.table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {popup.additionalTables?.map((table, tableIdx) => (
          <div key={tableIdx} className="popup-table additional-table">
            <h4 className="table-title">{table.title}</h4>
            <table>
              <thead>
                <tr>
                  {table.headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        
        {popup.bullets && (
          <div className="popup-bullets">
            <ul>
              {popup.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        )}
        
        {popup.example && (
          <div className="popup-example">
            <h4>Example:</h4>
            <p>{popup.example}</p>
          </div>
        )}
        
        {popup.note && (
          <div className="popup-note">
            <p><strong>Note:</strong> {popup.note}</p>
          </div>
        )}
        
        {popup.brokerNote && (
          <div className="popup-broker-note">
            <p><strong>Broker Note:</strong> {popup.brokerNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Education() {
  const [activeTab, setActiveTab] = useState("forex-basics");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLotType, setModalLotType] = useState<"micro" | "mini" | "standard">("micro");
  const [modalInstrument, setModalInstrument] = useState<typeof instruments[0] | undefined>(undefined);
  const [activePopup, setActivePopup] = useState<{ sectionId: string; cardIndex: number } | null>(null);
  const [calculatorModal, setCalculatorModal] = useState<string | null>(null);
  
  // Search and filter state for currency pairs
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "forex" | "metals" | "commodities" | "indices">("all");

  const activeSection = educationSections.find((s) => s.id === activeTab);
  
  const handleCardClick = (sectionId: string, cardIndex: number) => {
    setActivePopup({ sectionId, cardIndex });
  };
  
  const closePopup = () => {
    setActivePopup(null);
  };
  
  const getCurrentPopup = () => {
    if (!activePopup) return null;
    const section = educationSections.find(s => s.id === activePopup.sectionId);
    if (!section || !section.content.cards) return null;
    return section.content.cards[activePopup.cardIndex]?.popup;
  };

  return (
    <div className="education-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="education-hero">
        <div className="hero-content">
          <span className="section-label">Learning Hub</span>
          <h1 className="section-title">
            FROM BEGINNER TO <span className="gold-text">PRO FOREX TRADER.</span>
          </h1>
          <p className="section-desc">
            Access our full Forex trading education library — from understanding currency pairs and pips, to mastering technical analysis, candlestick patterns, risk management and advanced trading strategies.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="education-tabs-container">
        <div className="education-tabs">
          {educationSections.map((section) => (
            <button
              key={section.id}
              className={`edu-tab ${activeTab === section.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(section.id);
                setExpandedCard(null);
              }}
            >
              <span className="tab-icon">{section.icon}</span>
              <span className="tab-text">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <section className="education-content">
        {activeSection && (
          <div className="content-wrapper">
            <div className="content-header">
              <span className="content-icon">{activeSection.icon}</span>
              <h2>{activeSection.content.heading}</h2>
              <p>{activeSection.content.description}</p>
            </div>

            {/* Forex Basics & How It Works - Feature Cards with Popups */}
            {(activeSection.id === "forex-basics" ||
              activeSection.id === "trading-mechanics" ||
              activeSection.id === "pips-spreads") && (
              <div className="feature-cards">
                {activeSection.content.cards?.map((card, idx) => (
                  <div
                    key={idx}
                    className={`feature-card ${
                      expandedCard === `${activeSection.id}-${idx}`
                        ? "expanded"
                        : ""
                    }`}
                    onClick={() => {
                      setExpandedCard(
                        expandedCard === `${activeSection.id}-${idx}`
                          ? null
                          : `${activeSection.id}-${idx}`
                      );
                      handleCardClick(activeSection.id, idx);
                    }}
                  >
                    <div className="card-number">{String(idx + 1).padStart(2, "0")}</div>
                    <p>{card.label}</p>
                    <div className="card-glow" />
                    {card.popup && (
                      <div className="card-popup-indicator">
                        Know More
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Currency Pairs - Center-Focus Carousel with Search & Filters */}
            {activeSection.id === "currency-pairs" && (
              <div className="pairs-section">
                {/* Search & Filters */}
                <div className="pairs-controls">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search pairs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-tabs">
                    {["all", "forex", "metals", "commodities", "indices"].map((filter) => (
                      <button
                        key={filter}
                        className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
                        onClick={() => setActiveFilter(filter as typeof activeFilter)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Filtered Carousel */}
                <CenterCarousel
                  items={(activeSection.content.pairs || []).filter((item) => {
                    // Search filter
                    const matchesSearch = item.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         item.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         item.quote.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    // Category filter - map pair to instrument type
                    const instrument = instruments.find((inst) => inst.name === item.pair);
                    const type = instrument?.type || "forex";
                    
                    const matchesFilter = activeFilter === "all" || 
                                         (activeFilter === "forex" && type === "forex") ||
                                         (activeFilter === "metals" && type === "metal") ||
                                         (activeFilter === "commodities" && type === "commodity") ||
                                         (activeFilter === "indices" && type === "index");
                    
                    return matchesSearch && matchesFilter;
                  })}
                  onItemClick={(item) => {
                    // Find matching instrument from the instruments array
                    const matchingInstrument = instruments.find(
                      (inst) => inst.name === item.pair
                    );
                    // Open margin calculator modal with selected currency pair
                    setModalLotType("standard");
                    setModalInstrument(matchingInstrument);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            )}

            {/* Lot Sizes - Data Tables */}
            {activeSection.id === "lot-sizes" && (
              <div className="lot-tables">
                {activeSection.content.tables?.map((table, idx) => (
                  <div key={idx} className="lot-table-container">
                    <h4 className="table-title">{table.title}</h4>
                    <div className="lot-table">
                      <div className="table-header">
                        <span>Lot Name</span>
                        <span>Size</span>
                        <span>Units</span>
                        <span>1 PIP Profit</span>
                      </div>
                      {table.rows.map((row, ridx) => (
                        <div
                          key={ridx}
                          className={`table-row ${row.lot.toLowerCase()} clickable`}
                          onClick={() => {
                            const lotTypeMap: Record<string, "micro" | "mini" | "standard"> = {
                              micro: "micro",
                              mini: "mini",
                              std: "standard",
                            };
                            const lotType = lotTypeMap[row.lot.toLowerCase()] || "micro";
                            setModalLotType(lotType);
                            setIsModalOpen(true);
                          }}
                          title="Click to calculate margin for this lot size"
                        >
                          <span className="lot-name">{row.lot}</span>
                          <span>{row.size}</span>
                          <span>{row.units}</span>
                          <span className="pip-profit">{row.pip}</span>
                          <span className="click-hint">📊 Calculate</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

                      </div>
        )}
      </section>

      {/* Education Popup */}
      <EducationPopup 
        isOpen={!!activePopup} 
        onClose={closePopup} 
        popup={getCurrentPopup() || { title: '', description: '' }}
      />

      {/* Margin Calculator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-calculator">
          <h3>Margin Calculator</h3>
          <p className="modal-subtitle">
            {modalInstrument ? (
              <><strong>{modalInstrument.name}</strong> — Lot: <strong>{modalLotType.charAt(0).toUpperCase() + modalLotType.slice(1)}</strong></>
            ) : (
              <>Lot: <strong>{modalLotType.charAt(0).toUpperCase() + modalLotType.slice(1)}</strong></>
            )}
          </p>
          <CompactMarginCalculator initialInstrument={modalInstrument} initialLotType={modalLotType} />
        </div>
      </Modal>

      {/* Calculator Modal */}
      <Modal isOpen={!!calculatorModal} onClose={() => setCalculatorModal(null)}>
        <div className="modal-calculator">
          {calculatorModal === "pip" && <PipCalculator />}
          {calculatorModal === "margin" && <MarginCalculator />}
          {calculatorModal === "lot-size" && <LotSizeCalculator />}
          {calculatorModal === "profit" && <ProfitCalculator />}
        </div>
      </Modal>

      {/* Quick Reference Cards */}
      <section className="quick-reference">
        <h3 className="ref-title">Quick Reference</h3>
        <div className="ref-cards">
          <div className="ref-card">
            <span className="ref-icon">🎯</span>
            <h4>PIP</h4>
            <p>Smallest price movement unit</p>
          </div>
          <div className="ref-card">
            <span className="ref-icon">📊</span>
            <h4>Spread</h4>
            <p>Difference between bid and ask</p>
          </div>
          <div className="ref-card">
            <span className="ref-icon">⚡</span>
            <h4>Leverage</h4>
            <p>Control large positions with less capital</p>
          </div>
          <div className="ref-card">
            <span className="ref-icon">💰</span>
            <h4>Margin</h4>
            <p>Required funds to open a position</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

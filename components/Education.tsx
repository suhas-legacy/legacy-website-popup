"use client";

import { useState, useEffect, useId, useCallback } from "react";
import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";

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

const leverageOptions = [50, 100, 200, 300, 400, 500];

interface MarginCalculatorProps {
  initialLotType?: "micro" | "mini" | "standard";
  initialInstrument?: typeof instruments[0];
  compact?: boolean;
}

function MarginCalculator({ initialLotType = "micro", initialInstrument, compact = false }: MarginCalculatorProps) {
  const defaultInstrument = initialInstrument || instruments[0];
  const [selectedInstrument, setSelectedInstrument] = useState(defaultInstrument);
  const [price, setPrice] = useState(defaultInstrument.price);
  const [lotType, setLotType] = useState<"micro" | "mini" | "standard">(initialLotType);
  const [numLots, setNumLots] = useState(1);
  const [leverage, setLeverage] = useState(100);
  const [margin, setMargin] = useState(0);
  const [notionalValue, setNotionalValue] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [isLivePrice, setIsLivePrice] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const lotTypeConfig = {
    micro: { value: 0.01, label: "Micro", multiplier: 1 },
    mini: { value: 0.1, label: "Mini", multiplier: 10 },
    standard: { value: 1, label: "Standard", multiplier: 100 },
  };

  const calculateMargin = useCallback(() => {
    const config = lotTypeConfig[lotType];
    // Total volume in lots
    const volume = numLots * config.value;
    // Contract size in units (Volume × 100)
    const units = volume * 100;
    // Notional value = Price × Contract Size
    const notional = units * price;
    // Margin Required = Notional Value / Leverage
    const requiredMargin = notional / leverage;

    setTotalUnits(units);
    setNotionalValue(notional);
    setMargin(requiredMargin);
  }, [lotType, numLots, leverage, price]);

  // Fetch live prices periodically
  useEffect(() => {
    const updatePrices = async () => {
      const livePrices = await fetchLivePrices();
      if (livePrices) {
        const apiSymbol = priceApiSymbols[selectedInstrument.symbol];
        const newPrice = livePrices[apiSymbol as keyof typeof livePrices];
        if (newPrice) {
          setPrice(newPrice);
          setIsLivePrice(true);
          setLastUpdated(new Date());
        }
      }
    };

    // Initial fetch
    updatePrices();

    // Update every 30 seconds
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, [selectedInstrument]);

  useEffect(() => {
    calculateMargin();
  }, [calculateMargin]);

  return (
    <div className="margin-calculator">
      {/* Explanation Cards - Hidden in compact mode */}
      {!compact && (
        <div className="explanation-cards">
          <div className="explanation-card">
            <div className="exp-icon">⚡</div>
            <h4>What is Leverage?</h4>
            <p>Leverage allows you to control a large position with a small amount of capital. With 1:100 leverage, you control $100,000 with just $1,000 margin.</p>
          </div>
          <div className="explanation-card">
            <div className="exp-icon">💰</div>
            <h4>What is Margin?</h4>
            <p>Margin is the required deposit to open and maintain a leveraged position. It acts as collateral for the borrowed funds.</p>
          </div>
          <div className="explanation-card">
            <div className="exp-icon">📏</div>
            <h4>Lot Size Impact</h4>
            <p>Larger lot sizes increase both your position value and required margin proportionally. Always calculate risk before trading.</p>
          </div>
        </div>
      )}

      {/* Formula Display */}
      <div className="formula-display">
        <div className="formula-card-compact">
          <h5>Formula</h5>
          <code>
            <span className="var">Margin</span>
            <span className="operator">=</span>
            <span className="operator">(</span>
            <span className="var">Price</span>
            <span className="operator">×</span>
            <span className="var">Contract Size</span>
            <span className="operator">)</span>
            <span className="operator">/</span>
            <span className="var">Leverage</span>
          </code>
          <div className="lot-multiplier">
            <span>Contract Size = Lot Size × 100 units</span>
          </div>
        </div>
      </div>


      <div className="calculator-grid">
        <div className="calculator-inputs">
          <h4>Margin Calculator</h4>
          
          <div className="input-group">
            <label>Instrument</label>
            <select
              value={selectedInstrument.symbol}
              onChange={(e) => {
                const inst = instruments.find((i) => i.symbol === e.target.value);
                if (inst) setSelectedInstrument(inst);
              }}
            >
              {instruments.map((inst) => (
                <option key={inst.symbol} value={inst.symbol}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>
              Live Market Price
              {isLivePrice && (
                <span className="live-indicator">
                  <span className="live-dot"></span> LIVE
                </span>
              )}
            </label>
            <div className="price-input-wrapper">
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(Number(e.target.value));
                  setIsLivePrice(false);
                }}
                className={isLivePrice ? "live-price" : ""}
              />
              {lastUpdated && (
                <span className="last-updated">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            <small className="input-hint">
              {isLivePrice 
                ? "Price updates automatically every 30 seconds from live market data"
                : "Price is manually set - click Calculate to use current value"}
            </small>
          </div>

          <div className="input-group">
            <label>Select Lot Type</label>
            <div className="lot-type-buttons">
              {Object.entries(lotTypeConfig).map(([key, config]) => (
                <button
                  key={key}
                  className={`lot-type-btn ${lotType === key ? "active" : ""}`}
                  onClick={() => setLotType(key as "micro" | "mini" | "standard")}
                >
                  <span className="btn-label">{config.label}</span>
                  <span className="btn-value">{config.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Number of Lots</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={numLots}
              onChange={(e) => setNumLots(Number(e.target.value))}
            />
            <small className="input-hint">
              Enter quantity (e.g., 1, 2, 0.5)
            </small>
          </div>

          <div className="input-group">
            <label>Leverage</label>
            <select
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
            >
              {leverageOptions.map((lev) => (
                <option key={lev} value={lev}>
                  1:{lev}
                </option>
              ))}
            </select>
          </div>

          <button className="calculate-btn" onClick={calculateMargin}>
            Calculate Margin
          </button>
        </div>
      </div>


      {/* Live Results Display */}
      <div className="live-results">
        <h4>Calculation Results</h4>
        <div className="results-grid">
          <div className="result-card">
            <span className="result-label">Position Size</span>
            <span className="result-value">{totalUnits.toLocaleString()} units</span>
          </div>
          <div className="result-card highlight">
            <span className="result-label">Total Exposure</span>
            <span className="result-value">${notionalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="result-card gold">
            <span className="result-label">Required Margin</span>
            <span className="result-value">${margin.toFixed(2)}</span>
          </div>
        </div>
        <div className="calculation-breakdown">
          <p>
            <strong>Calculation:</strong> ${price.toFixed(2)} × {totalUnits.toLocaleString()} units / {leverage} = <strong>${margin.toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

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
    title: "Forex Basics",
    icon: "📊",
    content: {
      heading: "What is Forex (FX)?",
      description:
        "Foreign Exchange, commonly called Forex or FX, is the global market where one currency is exchanged for another. It is the largest and most liquid financial market in the world.",
      points: [
        "Operates 24 hours a day, 5 days a week",
        "Includes all currencies of the world",
        "Average daily trading volume in the trillions",
        "Also referred to as FOREX, FX, or Spot FX",
      ],
    },
  },
  {
    id: "trading-mechanics",
    title: "How It Works",
    icon: "⚙️",
    content: {
      heading: "How Forex Trading Works",
      description:
        "Forex traders exchange two different currencies and aim to profit from the price difference between the buy and sell prices.",
      points: [
        "Buy low, sell high to earn profits",
        "Currency values fluctuate constantly",
        "Trade based on market predictions",
        "Example: Sell USD, buy EUR when USD weakens",
      ],
    },
  },
  {
    id: "currency-pairs",
    title: "Currency Pairs",
    icon: "💱",
    content: {
      heading: "Understanding Currency Pairs",
      description:
        "Currencies are always quoted in pairs. The first currency is the Base Currency, the second is the Quote Currency.",
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
    id: "pips-spreads",
    title: "PIPs & Spreads",
    icon: "📈",
    content: {
      heading: "PIPs and Spreads",
      description:
        "PIP stands for Point In Percentage - the smallest unit of price movement. Spread is the difference between Buy (Ask) and Sell (Bid) prices.",
      examples: [
        { label: "EUR/USD +1 PIP", value: "1.16997 → 1.17007" },
        { label: "USD/JPY -5.5 PIPs", value: "110.200 → 110.145" },
        { label: "Typical Spread", value: "2-3 pips" },
      ],
    },
  },
  {
    id: "lot-sizes",
    title: "Lot Sizes",
    icon: "📦",
    content: {
      heading: "Trade Size (Lot Size)",
      description:
        "Lot is the unit used to measure the volume or size of a trade. Different instruments have different lot specifications.",
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
  {
    id: "leverage-margin",
    title: "Leverage & Margin",
    icon: "⚡",
    content: {
      heading: "Leverage and Margin",
      description:
        "Leverage allows traders to control a large position with a small amount of capital. Margin is the money required to open a position.",
      formula: "Margin = (Current Market Price × Lot Size × Volume) / Leverage",
      example: {
        leverage: "1:500",
        capital: "$200",
        control: "$100,000",
      },
    },
  },
];

export function Education() {
  const [activeTab, setActiveTab] = useState("forex-basics");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLotType, setModalLotType] = useState<"micro" | "mini" | "standard">("micro");
  const [modalInstrument, setModalInstrument] = useState<typeof instruments[0] | undefined>(undefined);
  
  // Search and filter state for currency pairs
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "forex" | "metals" | "commodities" | "indices">("all");

  const activeSection = educationSections.find((s) => s.id === activeTab);

  return (
    <div className="education-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="education-hero">
        <div className="hero-content">
          <span className="section-label">Learning Hub</span>
          <h1 className="section-title">
            Master <span className="gold-text">Forex Trading</span>
          </h1>
          <p className="section-desc">
            Comprehensive educational resources to help you understand the
            fundamentals of forex trading, from basic concepts to advanced
            strategies.
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

            {/* Forex Basics & How It Works - Feature Cards */}
            {(activeSection.id === "forex-basics" ||
              activeSection.id === "trading-mechanics") && (
              <div className="feature-cards">
                {activeSection.content.points?.map((point, idx) => (
                  <div
                    key={idx}
                    className={`feature-card ${
                      expandedCard === `${activeSection.id}-${idx}`
                        ? "expanded"
                        : ""
                    }`}
                    onClick={() =>
                      setExpandedCard(
                        expandedCard === `${activeSection.id}-${idx}`
                          ? null
                          : `${activeSection.id}-${idx}`
                      )
                    }
                  >
                    <div className="card-number">{String(idx + 1).padStart(2, "0")}</div>
                    <p>{point}</p>
                    <div className="card-glow" />
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

            {/* PIPs and Spreads - Calculator Style */}
            {activeSection.id === "pips-spreads" && (
              <div className="pip-examples">
                {activeSection.content.examples?.map((example, idx) => (
                  <div key={idx} className="pip-card">
                    <div className="pip-label">{example.label}</div>
                    <div className="pip-value">
                      {example.value.split("→").map((part, i) => (
                        <span key={i}>
                          {i > 0 && <span className="arrow">→</span>}
                          <span className={i === 0 ? "old" : "new"}>
                            {part.trim()}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pip-calculator">
                  <h4>PIP Value Reference</h4>
                  <div className="calc-grid">
                    <div className="calc-item">
                      <span className="calc-label">Most pairs</span>
                      <span className="calc-value">0.0001</span>
                    </div>
                    <div className="calc-item">
                      <span className="calc-label">JPY pairs</span>
                      <span className="calc-value">0.01</span>
                    </div>
                  </div>
                </div>
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

            {/* Leverage & Margin - Interactive Calculator */}
            {activeSection.id === "leverage-margin" && <MarginCalculator />}
          </div>
        )}
      </section>

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
          <MarginCalculator initialLotType={modalLotType} initialInstrument={modalInstrument} compact={true} />
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

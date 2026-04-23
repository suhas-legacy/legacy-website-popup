"use client";

import { useEffect, useState } from "react";
import type { ForexEvent, ImpactLevel } from "@/lib/forexTypes";
import { Globe } from "@/components/ui/cobe-globe";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";

const FINNHUB_API_URL = "https://finnhub.io/api/v1/calendar/economic";

function getImpactColor(impact: ImpactLevel): string {
  const normalizedImpact = impact.toLowerCase();
  switch (normalizedImpact) {
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/30";
    case "medium":
      return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    case "low":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/30";
  }
}

function getImpactDot(impact: ImpactLevel): string {
  const normalizedImpact = impact.toLowerCase();
  switch (normalizedImpact) {
    case "high":
      return "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]";
    case "medium":
      return "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]";
    case "low":
      return "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]";
    default:
      return "bg-gray-400";
  }
}

function formatDate(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    // All countries - ensure no duplicates
    AF: "AF", AX: "AX", AL: "AL", DZ: "DZ", AS: "AS", AD: "AD", AO: "AO", AI: "AI",
    AQ: "AQ", AG: "AG", AR: "AR", AM: "AM", AW: "AW", AU: "AU", AT: "AT", AZ: "AZ",
    BS: "BS", BH: "BH", BD: "BD", BB: "BB", BY: "BY", BE: "BE", BZ: "BZ", BJ: "BJ",
    BM: "BM", BT: "BT", BO: "BO", BQ: "BQ", BA: "BA", BW: "BW", BR: "BR", IO: "IO",
    BN: "BN", BG: "BG", BF: "BF", BI: "BI", CV: "CV", KH: "KH", CM: "CM", CA: "CA",
    KY: "KY", CF: "CF", TD: "TD", CL: "CL", CN: "CN", CX: "CX", CC: "CC", CO: "CO",
    KM: "KM", CG: "CG", CD: "CD", CK: "CK", CR: "CR", CI: "CI", HR: "HR", CU: "CU",
    CW: "CW", CY: "CY", CZ: "CZ", DK: "DK", DJ: "DJ", DM: "DM", DO: "DO", EC: "EC",
    EG: "EG", SV: "SV", GQ: "GQ", ER: "ER", EE: "EE", SZ: "SZ", ET: "ET", FK: "FK",
    FO: "FO", FJ: "FJ", FI: "FI", FR: "FR", GF: "GF", PF: "PF", TF: "TF", GA: "GA",
    GM: "GM", GE: "GE", DE: "DE", GH: "GH", GI: "GI", GR: "GR", GL: "GL", GD: "GD",
    GP: "GP", GU: "GU", GT: "GT", GG: "GG", GN: "GN", GW: "GW", GY: "GY", HT: "HT",
    HM: "HM", VA: "VA", HN: "HN", HK: "HK", HU: "HU", IS: "IS", IN: "IN", ID: "ID",
    IR: "IR", IQ: "IQ", IE: "IE", IM: "IM", IL: "IL", IT: "IT", JM: "JM", JP: "JP",
    JE: "JE", JO: "JO", KZ: "KZ", KE: "KE", KI: "KI", KP: "KP", KR: "KR", KW: "KW",
    KG: "KG", LA: "LA", LV: "LV", LB: "LB", LS: "LS", LR: "LR", LY: "LY", LI: "LI",
    LT: "LT", LU: "LU", MO: "MO", MG: "MG", MW: "MW", MY: "MY", MV: "MV", ML: "ML",
    MT: "MT", MH: "MH", MQ: "MQ", MR: "MR", MU: "MU", YT: "YT", MX: "MX", FM: "FM",
    MD: "MD", MC: "MC", MN: "MN", ME: "ME", MS: "MS", MA: "MA", MZ: "MZ", MM: "MM",
    NA: "NA", NR: "NR", NP: "NP", NL: "NL", NC: "NC", NZ: "NZ", NI: "NI", NE: "NE",
    NG: "NG", NU: "NU", NF: "NF", MK: "MK", MP: "MP", NO: "NO", OM: "OM", PK: "PK",
    PW: "PW", PS: "PS", PA: "PA", PG: "PG", PY: "PY", PE: "PE", PH: "PH", PN: "PN",
    PL: "PL", PT: "PT", PR: "PR", QA: "QA", RE: "RE", RO: "RO", RU: "RU", RW: "RW",
    BL: "BL", SH: "SH", KN: "KN", LC: "LC", MF: "MF", PM: "PM", VC: "VC", WS: "WS",
    SM: "SM", ST: "ST", SA: "SA", SN: "SN", RS: "RS", SC: "SC", SL: "SL", SG: "SG",
    SX: "SX", SK: "SK", SI: "SI", SB: "SB", SO: "SO", ZA: "ZA", GS: "GS", SS: "SS",
    ES: "ES", LK: "LK", SD: "SD", SR: "SR", SJ: "SJ", SE: "SE", CH: "CH", SY: "SY",
    TW: "TW", TJ: "TJ", TZ: "TZ", TH: "TH", TL: "TL", TG: "TG", TK: "TK", TO: "TO",
    TT: "TT", TN: "TN", TR: "TR", TM: "TM", TC: "TC", TV: "TV", UG: "UG", UA: "UA",
    AE: "AE", GB: "GB", US: "US", UM: "UM", UY: "UY", UZ: "UZ", VU: "VU", VE: "VE",
    VN: "VN", VG: "VG", VI: "VI", WF: "WF", EH: "EH", YE: "YE", ZM: "ZM", ZW: "ZW",
    All: "All",
  };
  return flags[countryCode] || countryCode;
}

// Comprehensive list of all countries
const ALL_COUNTRIES = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
];

// Globe data for major financial centers
const globeMarkers = [
  { id: "nyc", location: [40.7128, -74.006] as [number, number], label: "New York" },
  { id: "london", location: [51.5074, -0.1278] as [number, number], label: "London" },
  { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
  { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
  { id: "frankfurt", location: [50.1109, 8.6821] as [number, number], label: "Frankfurt" },
  { id: "singapore", location: [1.3521, 103.8198] as [number, number], label: "Singapore" },
  { id: "hongkong", location: [22.3193, 114.1694] as [number, number], label: "Hong Kong" },
  { id: "zurich", location: [47.3769, 8.5417] as [number, number], label: "Zurich" },
];

const globeArcs = [
  {
    id: "nyc-london",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "NYC → London",
  },
  {
    id: "london-tokyo",
    from: [51.5074, -0.1278] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "London → Tokyo",
  },
  {
    id: "tokyo-sydney",
    from: [35.6762, 139.6503] as [number, number],
    to: [-33.8688, 151.2093] as [number, number],
    label: "Tokyo → Sydney",
  },
];

export function ForexNewsClient() {
  const [events, setEvents] = useState<ForexEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ImpactLevel | "All">("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [countrySearch, setCountrySearch] = useState<string>("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
        if (!apiKey) {
          throw new Error("Finnhub API key not found in environment variables");
        }

        const response = await fetch(
          `${FINNHUB_API_URL}?token=${apiKey}`,
          {
            cache: "no-store",
            next: { revalidate: 300 },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setEvents(data.economicCalendar || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const impactMatch = filter === "All" || event.impact.toLowerCase() === filter.toLowerCase();
    const countryMatch = selectedCountry === "All" || event.country === selectedCountry;
    return impactMatch && countryMatch;
  });

  const availableCountries = Array.from(new Set(events.map((e) => e.country))).sort();
  
  // Filter countries based on search and availability
  const filteredCountries = ALL_COUNTRIES.filter(country => {
    const matchesSearch = countrySearch === "" || 
      country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      getCountryFlag(country).includes(countrySearch);
    const isAvailable = availableCountries.includes(country);
    return matchesSearch; // Show all countries that match search, regardless of availability
  }).sort();

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const highImpactCount = events.filter((e) => e.impact.toLowerCase() === "high").length;
  const mediumImpactCount = events.filter((e) => e.impact.toLowerCase() === "medium").length;
  const lowImpactCount = events.filter((e) => e.impact.toLowerCase() === "low").length;

  return (
    <>
      <Ticker />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
        {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-red-900/20" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-300">Live Economic Calendar</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
              Forex Economic Calendar
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Track market-moving economic events from around the world. Stay ahead with real-time forecasts, actuals, and previous data.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-red-500">{highImpactCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">High Impact</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-orange-400">{mediumImpactCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Medium Impact</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-yellow-400">{lowImpactCount}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Low Impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="relative overflow-hidden border-b border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-4">
              Global Market Connections
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track economic events across major financial centers worldwide. 24/7 market coverage from New York to Tokyo.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <Globe
                markers={globeMarkers}
                arcs={globeArcs}
                markerColor={[0.3, 0.45, 0.85]}
                baseColor={[1, 1, 1]}
                arcColor={[0.3, 0.45, 0.85]}
                glowColor={[0.94, 0.93, 0.91]}
                dark={0}
                mapBrightness={10}
                markerSize={0.025}
                markerElevation={0.01}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-800/50 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Impact</label>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as ImpactLevel | "All")}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">All Impact Levels</option>
                  <option value="High">High Impact</option>
                  <option value="Medium">Medium Impact</option>
                  <option value="Low">Low Impact</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Country</label>
              <div className="space-y-2">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    🔍
                  </div>
                </div>
                
                {/* Country Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none cursor-pointer"
                  >
                    <option value="All">🌍 All Countries</option>
                    {filteredCountries.map((country) => {
                      const isAvailable = availableCountries.includes(country);
                      return (
                        <option key={country} value={country} disabled={!isAvailable}>
                          {getCountryFlag(country)} {country} {!isAvailable && "(No events)"}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
                
                {/* Available Countries Count */}
                <div className="text-xs text-gray-500">
                  {availableCountries.length} countries with events • {ALL_COUNTRIES.length} total countries
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: "reverse" }} />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-2">⚠️ Error loading data</div>
            <div className="text-gray-400">{error}</div>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg">No events found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedEvents.map((event, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="relative p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Date & Time Box */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</div>
                        <div className="text-sm font-semibold text-white mb-2">{formatDate(event.time)}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</div>
                        <div className="text-sm font-semibold text-white">{formatTime(event.time)}</div>
                      </div>
                    </div>

                    {/* Event Details Box */}
                    <div className="lg:col-span-4">
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50 h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getCountryFlag(event.country)}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-700/50 text-gray-300">
                            {event.country}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getImpactColor(event.impact)}`}>
                            {event.impact}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-white">{event.event}</h3>
                      </div>
                    </div>

                    {/* Estimate Box */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estimate</div>
                        <div className="text-lg font-mono font-semibold text-blue-400">
                          {event.estimate !== null ? `${event.estimate}${event.unit}` : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Actual Box */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Actual</div>
                        <div className="text-lg font-mono font-semibold text-green-400">
                          {event.actual !== null ? `${event.actual}${event.unit}` : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Previous Box */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Previous</div>
                        <div className="text-lg font-mono font-semibold text-gray-300">
                          {event.prev !== null ? `${event.prev}${event.unit}` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Info */}
      <section className="border-t border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Data sourced from Finnhub API. Updates every 5 minutes.</p>
          <p className="mt-1">Trade responsibly. Economic events may cause high market volatility.</p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import leftLion from "./left-lion.png";
import rightLion from "./right-lion.png";

export function Ticker() {
  const rawId = useId();
  const containerId = `tv_ticker_${rawId.replace(/:/g, "")}`;
  const mountedRef = useRef(false);

  useEffect(() => {
    const host = document.getElementById(containerId);
    if (!host || mountedRef.current) return;
    mountedRef.current = true;

    host.innerHTML = "";
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "CXM:USOIL", title: "USOIL" },
        { proName: "TVC:UKOIL", title: "UKOIL" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "OANDA:XAGUSD", title: "Silver" },
        { proName: "FXCM:GER30", title: "GER30" },
        { proName: "FOREXCOM:FRA40", title: "FRA40" },
        { proName: "SKILLING:US30", title: "US30" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    host.appendChild(script);
  }, [containerId]);

  return (
    <div className="ticker-wrap">
      <div className="ticker-lion ticker-lion-left" aria-hidden="true">
        <Image src={rightLion} alt="" priority />
      </div>
      <div className="ticker-host" id={containerId} />
      <div className="ticker-lion ticker-lion-right" aria-hidden="true">
        <Image src={leftLion} alt="" priority />
      </div>
    </div>
  );
}

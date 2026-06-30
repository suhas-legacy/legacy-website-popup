"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";

export function TrustpilotWidget({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current);
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && (window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current);
    }
  };

  return (
    <div style={{ width: "100%", ...style }} className="flex flex-col gap-6 items-center w-full">
      {/* Custom Styled Trustpilot Card */}
      <div className="bg-white text-black rounded-[16px] border border-gray-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 md:p-6 w-full max-w-[420px] flex flex-row items-center justify-between gap-5 text-left select-none font-sans">
        {/* Left Column: Summary */}
        <div className="flex flex-col items-start shrink-0">
          <span className="text-[44px] font-extrabold text-[#1c1c1c] tracking-tight leading-none">
            4.3
          </span>
          <span className="text-[16px] font-bold text-[#1c1c1c] mt-1.5 mb-2 leading-none">
            Excellent
          </span>
          <div className="flex items-center">
            <img
              src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-4.5.svg"
              alt="4.5 stars out of 5"
              className="w-[116px] h-[22px] object-contain"
            />
          </div>
          <a
            href="https://www.trustpilot.com/review/legacyglobalbank.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-gray-500 font-medium mt-3 hover:underline"
          >
            7 reviews
          </a>
        </div>

        {/* Right Column: Star distribution */}
        <div className="flex flex-col gap-2.5 flex-1 max-w-[180px] w-full">
          {/* 5-star */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-[#4a4a4a] w-[36px] shrink-0 text-left">
              5-star
            </span>
            <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#00b67a] rounded-full w-[90%]" />
            </div>
          </div>
          {/* 4-star */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-[#4a4a4a] w-[36px] shrink-0 text-left">
              4-star
            </span>
            <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 w-0" />
            </div>
          </div>
          {/* 3-star */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-[#4a4a4a] w-[36px] shrink-0 text-left">
              3-star
            </span>
            <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 w-0" />
            </div>
          </div>
          {/* 2-star */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-[#4a4a4a] w-[36px] shrink-0 text-left">
              2-star
            </span>
            <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 w-0" />
            </div>
          </div>
          {/* 1-star */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] font-medium text-[#4a4a4a] w-[36px] shrink-0 text-left">
              1-star
            </span>
            <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 w-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Official Widget */}
      <div className="w-full flex justify-center max-w-[420px]">
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
        <div
          ref={ref}
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="6a2fb765a27373df6678bd69"
          data-style-height="52px"
          data-style-width="100%"
          data-token="1ff7d84e-7564-47ec-a1b9-58cd92b0ffd2"
        >
          <a
            href="https://www.trustpilot.com/review/legacyglobalbank.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-xs text-gray-500 font-sans"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}

export default TrustpilotWidget;

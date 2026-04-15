"use client";

import { useEffect, useRef } from "react";

export function ProfitCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    // Load the remote widgets script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://fxverify.com/Content/remote/remote-widgets.js";
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
      // Initialize the calculator after script loads
      if (typeof (window as any).RemoteCalc === "function") {
        (window as any).RemoteCalc({
          Url: "https://fxverify.com",
          TopPaneStyle:
            "YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzFGMTUwOCwgIzNBMkExMik7CmNvbG9yOiAjRkZENzAwOwpib3JkZXI6IHNvbGlkIDFweCAjQjg4NjBCOwpib3JkZXItYm90dG9tOiBub25lOwpib3JkZXItcmFkaXVzOiAyMHB4IDIwcHggMCAwOwpib3gtc2hhZG93OiAwIDhweCAyNXB4IHJnYmEoMTg0LCAxMzQsIDExLCAwLjM1KTs=",
          BottomPaneStyle:
            "YmFja2dyb3VuZDogIzBBMEEwQTtib3JkZXI6IHNvbGlkIDFweCAjQjg4NjBCO2JvcmRlci10b3A6IG5vbmU7Ym9yZGVyLXJhZGl1czogMCAwIDIwcHggMjBweDttYXJnaW4tdG9wOiAwO3BhZGRpbmc6IDMwcHggMjBweCAyNXB4O2JveC1zaGFkb3c6IGluc2V0IDAgMTBweCAzMHB4IHJnYmEoMCwwLDAsMC43KTtjb2xvcjogI0ZGRDcwMDs=",
          ButtonStyle:
            "YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI0I4ODYwQiwgI0ZGRDcwMCk7CmNvbG9yOiAjMDAwMDAwOwpib3JkZXItcmFkaXVzOiAyMHB4Owpmb250LXdlaWdodDogNzAwOwp0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOwpsZXR0ZXItc3BhY2luZzogMS41cHg7CmJveC1zaGFkb3c6IDAgNXB4IDIwcHggcmdiYSgyNTUsIDIxNSwgMCwgMC41KTs=",
          TitleStyle:
            "dGV4dC1hbGlnbjogY2VudGVyOwpmb250LXNpemU6IDUycHg7CmZvbnQtd2VpZ2h0OiA3MDA7CmNvbG9yOiAjRkZENzAwOwp0ZXh0LXNoYWRvdzogCiAgICAwIDAgMTVweCAjRkZENzAwLAogICAgMCAwIDMwcHggI0I4ODYwQiwKICAgIDAgMCA0NXB4IHJnYmEoMjU1LCAyMTUsIDAsIDAuNik7CmxldHRlci1zcGFjaW5nOiAzcHg7Cm1hcmdpbjogMTBweCAwIDIwcHg7",
          TextboxStyle:
            "YmFja2dyb3VuZC1jb2xvcjogIzFGMTUwODsKY29sb3I6ICNGRkQ3MDA7CmJvcmRlcjogc29saWQgMXB4ICNCODg2MEI7CmJvcmRlci1yYWRpdXM6IDEycHg7CnBhZGRpbmc6IDE0cHggMTZweDsKZm9udC1zaXplOiAxOHB4Owpib3gtc2hhZG93OiBpbnNldCAwIDRweCAxMHB4IHJnYmEoMCwwLDAsMC42KTs=",
          ContainerWidth: "100%",
          HighlightColor: "#FFD700",
          IsDisplayTitle: false,
          IsShowChartLinks: true,
          IsShowEmbedButton: true,
          CompactType: "large",
          Calculator: "profit-calculator",
          ContainerId: "profit-calculator-285231",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="profit-calculator-widget">
      <div id="profit-calculator-285231" ref={containerRef}></div>
    </div>
  );
}

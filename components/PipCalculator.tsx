"use client";

import { useEffect, useRef } from "react";

export function PipCalculator() {
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
            "YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzFhMTIwOCwgIzJjMWYwZik7CmNvbG9yOiAjRkZENzAwOwpib3JkZXI6IHNvbGlkIDFweCAjQjg4NjBCOwpib3JkZXItYm90dG9tOiBub25lOwpib3JkZXItcmFkaXVzOiAyMHB4IDIwcHggMCAwOwpib3gtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTg0LCAxMzQsIDExLCAwLjMpOwo=",
          BottomPaneStyle:
            "YmFja2dyb3VuZDogIzBBMEEwQTtib3JkZXI6IHNvbGlkIDFweCAjQjg4NjBCO2JvcmRlci10b3A6IG5vbmU7Ym9yZGVyLXJhZGl1czogMCAwIDIwcHggMjBweDttYXJnaW4tdG9wOiAwO3BhZGRpbmc6IDI1cHggMjBweDtib3gtc2hhZG93OiBpbnNldCAwIDVweCAxNXB4IHJnYmEoMCwwLDAsMC42KTtjb2xvcjogI0ZGRDcwMDs=",
          ButtonStyle:
            "YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI0I4ODYwQiwgI0ZGRDcwMCk7CmNvbG9yOiAjMDAwMDAwOwpib3JkZXItcmFkaXVzOiAyMHB4Owpmb250LXdlaWdodDogNzAwOwp0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOwpsZXR0ZXItc3BhY2luZzogMXB4Owpib3gtc2hhZG93OiAwIDRweCAxNXB4IHJnYmEoMTg0LCAxMzQsIDExLCAwLjUpOwp0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlOwo6aG92ZXIgewogIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNGRkQ3MDAsICNCODg2MEIpOwogIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTsKICBib3gtc2hhZG93OiAwIDZweCAyMHB4IHJnYmEoMjU1LCAyMTUsIDAsIDAuNik7Cn0=",
          TitleStyle:
            "dGV4dC1hbGlnbjogY2VudGVyOwpmb250LXNpemU6IDQ4cHg7CmZvbnQtd2VpZ2h0OiA3MDA7CmNvbG9yOiAjRkZENzAwOwp0ZXh0LXNoYWRvdzogMCAwIDIwcHggcmdiYSgyNTUsIDIxNSwgMCwgMC42KTsKbGV0dGVyLXNwYWNpbmc6IDJweDsKbWFyZ2luOiAxNXB4IDA7",
          TextboxStyle:
            "YmFja2dyb3VuZC1jb2xvcjogIzFhMTIwODsKY29sb3I6ICNGRkQ3MDA7CmJvcmRlcjogc29saWQgMXB4ICNCODg2MEI7CmJvcmRlci1yYWRpdXM6IDEycHg7CnBhZGRpbmc6IDEycHggMTZweDsKZm9udC1zaXplOiAxOHB4Owpib3gtc2hhZG93OiBpbnNldCAwIDNweCA4cHggcmdiYSgwLDAsMCwwLjUpOwpiYWNrZ3JvdW5kLWNvbG9yOiAjMWExMjA4Owpjb2xvcjogI0ZGRDcwMDsKYm9yZGVyOiBzb2xpZCAxcHggI0I4ODYwQjsKYm9yZGVyLXJhZGl1czogMTJweDs=",
          ContainerWidth: "100%",
          HighlightColor: "#FFD700",
          IsDisplayTitle: false,
          IsShowChartLinks: true,
          IsShowEmbedButton: true,
          CompactType: "large",
          Calculator: "pip-value-calculator",
          ContainerId: "pip-value-calculator-271345",
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
    <div className="pip-calculator-widget">
      <div id="pip-value-calculator-271345" ref={containerRef}></div>
    </div>
  );
}

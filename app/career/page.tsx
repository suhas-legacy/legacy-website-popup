import type { Metadata } from "next";
import Link from "next/link";
import { Ticker } from "@/components/Ticker";
import { PANEL_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers — Legacy Global Bank",
  description: "Join the Legacy Global Bank team.",
};

export default function CareerPage() {
  return (
    <>
      <Ticker />
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          padding: "6rem 2rem 4rem",
          fontFamily: "var(--font-syne), sans-serif",
        }}
      >
      <Link
        href="/"
        style={{
          color: "#FFD700",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        ← Back to home
      </Link>
      <h1
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          marginTop: "2rem",
          marginBottom: "1rem",
          letterSpacing: "0.04em",
        }}
      >
        Careers
      </h1>
      <p style={{ color: "#888", maxWidth: 560, lineHeight: 1.8 }}>
        We are building a global trading experience. For career inquiries, reach
        out at{" "}
        <a href="mailto:careers@legacyglobalbank.com" style={{ color: "#FFD700" }}>
          careers@legacyglobalbank.com
        </a>
        .
      </p>
      <a
        href={PANEL_URL}
        style={{
          display: "inline-block",
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "linear-gradient(135deg, #B8860B, #FFD700)",
          color: "#000",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderRadius: 4,
        }}
      >
        Client portal
      </a>
    </div>
    </>
  );
}

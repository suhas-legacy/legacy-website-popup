import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import "./legacy-site.css";
import { Ticker } from "@/components/Ticker";
import NithyaChat from "@/components/NithyaChat";
import DataCollectionProvider from "@/components/DataCollectionProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Legacy Global Bank — Trade With Confidence",
  description: "Legacy Global Bank landing page migrated to Next.js",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Ticker />
        {children}
        <NithyaChat />
        <DataCollectionProvider />
      </body>
    </html>
  );
}

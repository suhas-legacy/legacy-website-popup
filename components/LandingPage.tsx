"use client";

import Script from "next/script";
import { AccountTypes } from "./AccountTypes";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Instruments } from "./Instruments";
import { MarketView } from "./MarketView";
import { Navbar } from "./Navbar";
import { ImportantNoticePopup } from "./ImportantNoticePopup";
import { PromoPopup } from "./PromoPopup";
import { ScrollRevealInit } from "./ScrollRevealInit";
import { Steps } from "./Steps";
import { Testimonials } from "./Testimonials";
import { Ticker } from "./Ticker";
import { VirtualFunds } from "./VirtualFunds";
import { WhyUs } from "./WhyUs";

export default function LandingPage() {
  return (
    <>
      <Script
        src="https://www.noupe.com/embed/019d664bc7277841abc3e6c3c97ea212ad77.js"
        strategy="afterInteractive"
      />
      <ScrollRevealInit />
      <Ticker />
      <Navbar />
      <ImportantNoticePopup />
      <Hero />
      <MarketView />
      <VirtualFunds />
      <AccountTypes />
      <WhyUs />
      <Instruments />
      <Steps />
      <Testimonials />
      <Contact />
      <Footer />
      <PromoPopup />
    </>
  );
}

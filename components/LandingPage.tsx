"use client";

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
import NithyaChat from "./NithyaChat";

export default function LandingPage() {
  return (
    <>
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
      <NithyaChat />
    </>
  );
}

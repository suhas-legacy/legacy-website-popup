"use client";

import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { MarketPreview } from "./MarketPreview";
import { Navbar } from "./Navbar";
import { ImportantNoticePopup } from "./ImportantNoticePopup";
import { PromoPopup } from "./PromoPopup";
import { ScrollRevealInit } from "./ScrollRevealInit";
import { Ticker } from "./Ticker";
import { TestimonialsPreview } from "./TestimonialsPreview";
import { WhyUsPreview } from "./WhyUsPreview";
import NithyaChat from "./NithyaChat";

export default function LandingPage() {
  return (
    <>
      <ScrollRevealInit />
      <Ticker />
      <Navbar />
      {/* <ImportantNoticePopup /> */}
      <Hero />
      <MarketPreview />
      <WhyUsPreview />
      <TestimonialsPreview />
      <Footer />
      <PromoPopup />
      <NithyaChat />
    </>
  );
}

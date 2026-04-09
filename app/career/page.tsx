import type { Metadata } from "next";
import { Career } from "@/components/Career";

export const metadata: Metadata = {
  title: "Careers — Legacy Global Bank",
  description: "Join the Legacy Global Bank team. Explore exciting career opportunities in forex trading, sales, compliance, and more. Competitive benefits and growth opportunities.",
};

export default function CareerPage() {
  return <Career />;
}

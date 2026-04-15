import type { Metadata } from "next";
import { RefundPolicy } from "@/components/RefundPolicy";

export const metadata: Metadata = {
  title: "Refund Policy — Legacy Global Bank",
  description: "Learn about the terms and conditions governing refunds for services provided by Legacy Global Bank Capital Limited.",
};

export default function RefundPolicyPage() {
  return <RefundPolicy />;
}

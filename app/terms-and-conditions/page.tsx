import type { Metadata } from "next";
import { TermsAndConditions } from "@/components/TermsAndConditions";

export const metadata: Metadata = {
  title: "Terms & Conditions — Legacy Global Bank",
  description: "Read the terms and conditions governing your use of Legacy Global Bank Capital Limited's services.",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditions />;
}

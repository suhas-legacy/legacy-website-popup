import type { Metadata } from "next";
import { Education } from "@/components/Education";

export const metadata: Metadata = {
  title: "Education — Legacy Global Bank",
  description: "Learn forex trading fundamentals with Legacy Global Bank's comprehensive education center. Master PIPs, spreads, lot sizes, leverage, and more.",
};

export default function EducationPage() {
  return <Education />;
}

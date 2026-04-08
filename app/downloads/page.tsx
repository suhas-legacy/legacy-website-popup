import type { Metadata } from "next";
import { Downloads } from "@/components/Downloads";

export const metadata: Metadata = {
  title: "Download Apps — Legacy Global Bank",
  description: "Download Legacy Global Bank trading apps for Android, iOS, Windows, and Web platforms. Trade on the go with our powerful mobile and desktop applications.",
};

export default function DownloadsPage() {
  return <Downloads />;
}

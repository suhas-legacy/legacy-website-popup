import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key not configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({ finnhubApiKey: apiKey });
}

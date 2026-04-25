import { NextResponse } from "next/server";

const FINNHUB_API_URL = "https://finnhub.io/api/v1/calendar/economic";

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${FINNHUB_API_URL}?token=${apiKey}`,
      {
        cache: "no-store",
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Finnhub" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

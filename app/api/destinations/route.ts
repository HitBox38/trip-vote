import { NextRequest, NextResponse } from "next/server";
import { FLIGHT_ROUTES } from "@/lib/flight-routes";

// Passport Visa API - https://github.com/nickypangers/passport-visa-api
const PASSPORT_VISA_API = "https://rough-sun-2523.fly.dev";

interface VisaDestination {
  name: string;
  code: string;
  duration: number | null;
}

interface CountryVisaData {
  name: string;
  code: string;
  VR: VisaDestination[]; // Visa Required
  VOA: VisaDestination[]; // Visa on Arrival
  VF: VisaDestination[]; // Visa Free
  EV: VisaDestination[]; // eVisa
  NA: VisaDestination[]; // No Admission
  last_updated: string;
}

// Cache for 24 hours
const cache = new Map<string, { data: string[]; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function getFallbackData(originCode: string) {
  const destinations = FLIGHT_ROUTES[originCode] || [];
  return NextResponse.json({
    destinations,
    source: "fallback",
    note: "Using static flight route data",
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const originCode = searchParams.get("origin");

  if (!originCode) {
    return NextResponse.json({ error: "Origin country code is required" }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(originCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ destinations: cached.data, source: "cache" });
  }

  try {
    // Fetch visa information from Passport Visa API
    const response = await fetch(`${PASSPORT_VISA_API}/country/${originCode}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      console.error(`Passport Visa API error: ${response.status}`);
      return getFallbackData(originCode);
    }

    const data: CountryVisaData = await response.json();

    // Collect countries where entry is allowed
    // Include: Visa Free (VF), Visa on Arrival (VOA), and eVisa (EV)
    // Exclude: Visa Required (VR) and No Admission (NA)
    const destinationCountries = new Set<string>();

    // Add Visa Free countries
    data.VF?.forEach((dest) => {
      if (dest.code && dest.code !== originCode) {
        destinationCountries.add(dest.code);
      }
    });

    // Add Visa on Arrival countries
    data.VOA?.forEach((dest) => {
      if (dest.code && dest.code !== originCode) {
        destinationCountries.add(dest.code);
      }
    });

    // Add eVisa countries
    data.EV?.forEach((dest) => {
      if (dest.code && dest.code !== originCode) {
        destinationCountries.add(dest.code);
      }
    });

    const destinations = Array.from(destinationCountries);

    // Cache the result
    cache.set(originCode, {
      data: destinations,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      destinations,
      source: "api",
      stats: {
        visaFree: data.VF?.length || 0,
        visaOnArrival: data.VOA?.length || 0,
        eVisa: data.EV?.length || 0,
        total: destinations.length,
      },
    });
  } catch (error) {
    console.error("Passport Visa API error:", error);
    return getFallbackData(originCode);
  }
}

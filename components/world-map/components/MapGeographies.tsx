/* eslint-disable @typescript-eslint/no-explicit-any */
import { Geographies, Geography } from "react-simple-maps";
import { COUNTRIES } from "@/lib/countries";
import { GEO_URL } from "../constants";
import { getCountryCode } from "../helpers";

interface Prop {
  /** Array of selected country codes */
  selectedCountries: string[];
  /** Array of eligible countries */
  eligibleCountries: readonly { code: string; name: string; lat: number; lon: number }[];
  /** Whether more countries can be selected */
  canSelect: boolean;
  /** Callback when a country is clicked */
  onCountryClick: (countryCode: string) => void;
  /** Callback when mouse enters a country */
  onCountryMouseEnter: (country: { name: string; x: number; y: number }) => void;
  /** Callback when mouse moves over a country */
  onCountryMouseMove: (country: { name: string; x: number; y: number }) => void;
  /** Callback when mouse leaves a country */
  onCountryMouseLeave: () => void;
}

/**
 * Component rendering map geographies with country selection
 */
export function MapGeographies({
  selectedCountries,
  eligibleCountries,
  canSelect,
  onCountryClick,
  onCountryMouseEnter,
  onCountryMouseMove,
  onCountryMouseLeave,
}: Prop) {
  return (
    <Geographies geography={GEO_URL}>
      {({ geographies }: { geographies: any[] }) =>
        geographies.map((geo: any) => {
          const countryCode = getCountryCode(geo);
          if (!countryCode) return null;

          const country = COUNTRIES.find((c) => c.code === countryCode);
          const isEligible = eligibleCountries.some((c) => c.code === countryCode);
          const isSelected = country && selectedCountries.includes(countryCode);
          const isClickable = country && isEligible && (canSelect || isSelected);

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => {
                if (country && isClickable) {
                  onCountryClick(countryCode);
                }
              }}
              onMouseEnter={(event: React.MouseEvent<SVGPathElement>) => {
                if (
                  country &&
                  isEligible &&
                  typeof window !== "undefined" &&
                  window.innerWidth >= 768
                ) {
                  onCountryMouseEnter({
                    name: country.name,
                    x: event.clientX,
                    y: event.clientY,
                  });
                }
              }}
              onMouseMove={(event: React.MouseEvent<SVGPathElement>) => {
                if (
                  country &&
                  isEligible &&
                  typeof window !== "undefined" &&
                  window.innerWidth >= 768
                ) {
                  onCountryMouseMove({
                    name: country.name,
                    x: event.clientX,
                    y: event.clientY,
                  });
                }
              }}
              onMouseLeave={onCountryMouseLeave}
              style={{
                default: {
                  fill: isSelected
                    ? "#3b82f6"
                    : country && isEligible
                      ? "#d1d5db"
                      : country
                        ? "#e5e7eb"
                        : "#f3f4f6",
                  stroke: "#fff",
                  strokeWidth: 0.5,
                  outline: "none",
                  opacity: country && !isEligible ? 0.4 : 1,
                },
                hover: {
                  fill: isClickable
                    ? isSelected
                      ? "#2563eb"
                      : "#9ca3af"
                    : country && isEligible
                      ? "#d1d5db"
                      : country
                        ? "#e5e7eb"
                        : "#f3f4f6",
                  stroke: "#fff",
                  strokeWidth: 0.5,
                  outline: "none",
                  cursor: isClickable ? "pointer" : "default",
                  opacity: country && !isEligible ? 0.4 : 1,
                },
                pressed: {
                  fill: isClickable ? "#1e40af" : "#d1d5db",
                  stroke: "#fff",
                  strokeWidth: 0.5,
                  outline: "none",
                  opacity: country && !isEligible ? 0.4 : 1,
                },
              }}
            />
          );
        })
      }
    </Geographies>
  );
}

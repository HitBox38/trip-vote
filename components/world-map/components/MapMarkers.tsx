import { Marker } from "react-simple-maps";
import { COUNTRIES } from "@/lib/countries";

interface Prop {
  /** Array of selected country codes */
  selectedCountries: string[];
  /** Current zoom level */
  zoom: number;
  /** Callback when a marker is clicked */
  onCountryClick: (countryCode: string) => void;
}

/**
 * Component rendering markers for selected countries
 */
export function MapMarkers({ selectedCountries, zoom, onCountryClick }: Prop) {
  return (
    <>
      {selectedCountries.map((countryCode) => {
        const country = COUNTRIES.find((c) => c.code === countryCode);
        if (!country) return null;

        const rank = selectedCountries.indexOf(countryCode) + 1;
        const markerScale = 1 / zoom;
        const circleRadius = 10 * markerScale;
        const strokeWidth = 2.5 * markerScale;
        const fontSize = 13 * markerScale;
        const textY = 5 * markerScale;

        return (
          <Marker key={countryCode} coordinates={[country.lon, country.lat]}>
            <g
              onClick={(e) => {
                e.stopPropagation();
                onCountryClick(countryCode);
              }}
              style={{ cursor: "pointer" }}>
              <circle
                r={circleRadius}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={strokeWidth}
                className="animate-pulse"
              />
              <text
                textAnchor="middle"
                y={textY}
                style={{
                  fontFamily: "system-ui",
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                  fill: "#fff",
                  pointerEvents: "none",
                }}>
                {rank}
              </text>
            </g>
          </Marker>
        );
      })}
    </>
  );
}

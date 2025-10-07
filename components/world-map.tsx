/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Use Natural Earth data which has proper ISO codes
const geoUrl =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

// Natural Earth has issues with some countries - map their names/codes to our ISO codes
const NATURAL_EARTH_FIXES: Record<string, string> = {
  // Country name to ISO code mappings
  Norway: "NO",
  France: "FR",
  Kosovo: "XK",
  Taiwan: "TW",
  "Chinese Taipei": "TW",
  "China, Republic of": "TW",
  "Republic of China": "TW",
  // ISO_A2/A3 to ISO_A2 mappings for problematic countries
  NOR: "NO",
  FRA: "FR",
  KOS: "XK",
  TWN: "TW",
  "CN-TW": "TW", // Natural Earth uses this for Taiwan
  RC: "TW",
  // Some territories that Natural Earth marks as "-99"
  "-99": "", // Will be handled by name matching
};

const MAX_ZOOM = 10;
const MIN_ZOOM = 1;

interface WorldMapProps {
  selectedCountries: string[];
  onCountryClick: (countryCode: string) => void;
  canSelect: boolean;
  eligibleCountries?: readonly { code: string; name: string; lat: number; lon: number }[];
}

export const WorldMap = memo(function WorldMap({
  selectedCountries,
  onCountryClick,
  canSelect,
  eligibleCountries = COUNTRIES,
}: WorldMapProps) {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const handleZoomIn = () => {
    if (position.zoom >= MAX_ZOOM) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= MIN_ZOOM) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}>
          {/* Background rect for drag functionality */}
          <rect
            x={-2000}
            y={-1000}
            width={4000}
            height={2000}
            fill="transparent"
            style={{ cursor: "grab" }}
          />
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                // Natural Earth data uses ISO_A2 property, with fallbacks for problematic countries
                let countryCode = geo.properties?.ISO_A2;

                // Check if we need to apply a fix to the ISO_A2 code
                if (countryCode && NATURAL_EARTH_FIXES[countryCode]) {
                  countryCode = NATURAL_EARTH_FIXES[countryCode];
                }
                // Handle missing or invalid codes
                else if (!countryCode || countryCode === "-99") {
                  // Try ISO_A3 mapping
                  const isoA3 = geo.properties?.ISO_A3;
                  if (isoA3 && NATURAL_EARTH_FIXES[isoA3]) {
                    countryCode = NATURAL_EARTH_FIXES[isoA3];
                  }
                  // Try ADM0_A3 mapping
                  else if (geo.properties?.ADM0_A3 && NATURAL_EARTH_FIXES[geo.properties.ADM0_A3]) {
                    countryCode = NATURAL_EARTH_FIXES[geo.properties.ADM0_A3];
                  }
                  // Try name matching (check multiple name fields)
                  else if (geo.properties?.NAME && NATURAL_EARTH_FIXES[geo.properties.NAME]) {
                    countryCode = NATURAL_EARTH_FIXES[geo.properties.NAME];
                  } else if (
                    geo.properties?.NAME_LONG &&
                    NATURAL_EARTH_FIXES[geo.properties.NAME_LONG]
                  ) {
                    countryCode = NATURAL_EARTH_FIXES[geo.properties.NAME_LONG];
                  } else if (
                    geo.properties?.FORMAL_EN &&
                    NATURAL_EARTH_FIXES[geo.properties.FORMAL_EN]
                  ) {
                    countryCode = NATURAL_EARTH_FIXES[geo.properties.FORMAL_EN];
                  }
                  // Try BRK_A3 (used for some disputed territories)
                  else if (geo.properties?.BRK_A3 && NATURAL_EARTH_FIXES[geo.properties.BRK_A3]) {
                    countryCode = NATURAL_EARTH_FIXES[geo.properties.BRK_A3];
                  }
                  // Fallback to ADM0_A3
                  else {
                    countryCode = geo.properties?.ADM0_A3;
                  }
                }

                const country = COUNTRIES.find((c) => c.code === countryCode);
                const isEligible = eligibleCountries.some((c) => c.code === countryCode);
                const isSelected = country && selectedCountries.includes(countryCode);
                const isClickable = country && isEligible && (canSelect || isSelected);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      console.log("Clicked:", {
                        countryCode,
                        hasCountry: !!country,
                        isClickable,
                        isoA2: geo.properties?.ISO_A2,
                        isoA3: geo.properties?.ISO_A3,
                        admA3: geo.properties?.ADM0_A3,
                        name: geo.properties?.NAME,
                        allProps: Object.keys(geo.properties || {}),
                      });
                      if (country && isClickable) {
                        console.log("Calling onCountryClick with:", countryCode);
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
                        setHoveredCountry({
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
                        hoveredCountry &&
                        typeof window !== "undefined" &&
                        window.innerWidth >= 768
                      ) {
                        setHoveredCountry({
                          name: country.name,
                          x: event.clientX,
                          y: event.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
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

          {/* Render markers for selected countries */}
          {selectedCountries.map((countryCode) => {
            const country = COUNTRIES.find((c) => c.code === countryCode);
            if (!country) return null;

            const rank = selectedCountries.indexOf(countryCode) + 1;
            // Scale markers inversely with zoom so they remain consistent size
            const markerScale = 1 / position.zoom;
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
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          disabled={position.zoom >= MAX_ZOOM}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
          title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          disabled={position.zoom <= MIN_ZOOM}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
          title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleReset}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
          title="Reset View">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Click on countries to select them
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Red pins show selection order
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Drag to pan • Scroll to zoom
        </p>
      </div>

      {/* Tooltip for Desktop */}
      {hoveredCountry && (
        <div
          className="fixed pointer-events-none z-[9999] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg"
          style={{
            left: `${hoveredCountry.x + 12}px`,
            top: `${hoveredCountry.y + 12}px`,
            transform: "translate(0, -50%)",
          }}>
          {hoveredCountry.name}
        </div>
      )}
    </div>
  );
});

"use client";

import { memo, useState } from "react";
import { ComposableMap, ZoomableGroup } from "react-simple-maps";
import { COUNTRIES } from "@/lib/countries";
import { Prop } from "./types";
import { MAX_ZOOM, MIN_ZOOM } from "./constants";
import { MapGeographies } from "./components/MapGeographies";
import { MapMarkers } from "./components/MapMarkers";
import { ZoomControls } from "./components/ZoomControls";
import { MapInstructions } from "./components/MapInstructions";
import { MapTooltip } from "./components/MapTooltip";

/**
 * Interactive world map component for selecting countries
 * @param selectedCountries - Array of selected country codes (ISO 2-letter codes)
 * @param onCountryClick - Callback function when a country is clicked
 * @param canSelect - Whether more countries can be selected
 * @param eligibleCountries - Optional list of eligible countries that can be selected
 */
export const WorldMap = memo(function WorldMap({
  selectedCountries,
  onCountryClick,
  canSelect,
  eligibleCountries = COUNTRIES,
}: Prop) {
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

  const handleReset = () => setPosition({ coordinates: [0, 0], zoom: 1 });

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}>
          <rect
            x={-2000}
            y={-1000}
            width={4000}
            height={2000}
            fill="transparent"
            style={{ cursor: "grab" }}
          />
          <MapGeographies
            selectedCountries={selectedCountries}
            eligibleCountries={eligibleCountries}
            canSelect={canSelect}
            onCountryClick={onCountryClick}
            onCountryMouseEnter={setHoveredCountry}
            onCountryMouseMove={setHoveredCountry}
            onCountryMouseLeave={() => setHoveredCountry(null)}
          />
          <MapMarkers
            selectedCountries={selectedCountries}
            zoom={position.zoom}
            onCountryClick={onCountryClick}
          />
        </ZoomableGroup>
      </ComposableMap>

      <ZoomControls
        zoom={position.zoom}
        maxZoom={MAX_ZOOM}
        minZoom={MIN_ZOOM}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
      <MapInstructions />
      <MapTooltip hoveredCountry={hoveredCountry} />
    </div>
  );
});

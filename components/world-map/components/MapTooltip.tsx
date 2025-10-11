interface Prop {
  /** Hovered country info */
  hoveredCountry: { name: string; x: number; y: number } | null;
}

/**
 * Component displaying tooltip for hovered country
 * @param hoveredCountry - Hovered country info with name and position
 */
export function MapTooltip({ hoveredCountry }: Prop) {
  if (!hoveredCountry) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg"
      style={{
        left: `${hoveredCountry.x + 12}px`,
        top: `${hoveredCountry.y + 12}px`,
        transform: "translate(0, -50%)",
      }}>
      {hoveredCountry.name}
    </div>
  );
}

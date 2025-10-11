import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { WorldMap } from "@/components/world-map";

interface Prop {
  /** Array of selected country codes */
  selectedCountries: string[];
  /** Number of selected countries */
  selectedCount: number;
  /** Whether more countries can be selected */
  canSelect: boolean;
  /** Array of eligible countries */
  eligibleCountries: readonly { code: string; name: string; lat: number; lon: number }[];
  /** Callback when a country is clicked */
  onCountryClick: (countryCode: string) => void;
}

/**
 * Map section for selecting countries visually
 * @param selectedCountries - Array of selected country codes
 * @param selectedCount - Number of selected countries
 * @param canSelect - Whether more countries can be selected
 * @param eligibleCountries - Array of eligible countries
 * @param onCountryClick - Callback when a country is clicked
 */
export function MapSection({
  selectedCountries,
  selectedCount,
  canSelect,
  eligibleCountries,
  onCountryClick,
}: Prop) {
  return (
    <AccordionItem value="map" className="border-none">
      <Card>
        <CardHeader>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start gap-1">
              <CardTitle>Select Countries on Map</CardTitle>
              <CardDescription>
                Click on up to 5 countries ({selectedCount}/5 selected)
              </CardDescription>
            </div>
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent>
          <CardContent>
            <WorldMap
              selectedCountries={selectedCountries}
              onCountryClick={onCountryClick}
              canSelect={canSelect}
              eligibleCountries={eligibleCountries}
            />
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}

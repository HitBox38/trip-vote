import { COUNTRIES } from "@/lib/countries";
import { Option } from "@/components/ui/multiselect";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

/**
 * Gets the country name from its ISO code
 * @param code - ISO 2-letter country code
 * @returns Country name or the code if not found
 */
export function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name || code;
}

/**
 * Filters eligible countries based on origin and reachable countries
 * @param originCountry - Origin country code
 * @param reachableCountries - Array of reachable country codes
 * @returns Array of eligible countries
 */
export function getEligibleCountries(
  originCountry: string | undefined,
  reachableCountries: string[]
): readonly { code: string; name: string; lat: number; lon: number }[] {
  if (!originCountry) return COUNTRIES;

  return COUNTRIES.filter((c) => c.code !== originCountry && reachableCountries.includes(c.code));
}

/**
 * Converts countries array to MultipleSelector options
 * @param countries - Array of countries
 * @returns Array of options sorted alphabetically
 */
export function countriesToOptions(
  countries: readonly { code: string; name: string; lat: number; lon: number }[]
): Option[] {
  return [...countries]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((country) => ({ value: country.code, label: country.name }));
}

/**
 * Converts selected country codes to options
 * @param countryCodes - Array of country codes
 * @returns Array of options with labels
 */
export function codesToOptions(countryCodes: string[]): Option[] {
  return countryCodes.map((code) => ({ value: code, label: getCountryName(code) }));
}

/**
 * Creates drag end handler for reordering countries
 * @param selectedCountries - Current selected countries array
 * @param setCountries - Function to update countries order
 * @returns Drag end handler function
 */
export function createDragEndHandler(
  selectedCountries: string[],
  setCountries: (countries: string[]) => void
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedCountries.indexOf(active.id as string);
      const newIndex = selectedCountries.indexOf(over.id as string);
      setCountries(arrayMove(selectedCountries, oldIndex, newIndex));
    }
  };
}

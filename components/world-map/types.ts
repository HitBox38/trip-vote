/**
 * Component prop interface for WorldMap
 */
export interface Prop {
  /** Array of selected country codes (ISO 2-letter codes) */
  selectedCountries: string[];
  /** Callback function when a country is clicked */
  onCountryClick: (countryCode: string) => void;
  /** Whether more countries can be selected */
  canSelect: boolean;
  /** Optional list of eligible countries that can be selected */
  eligibleCountries?: readonly { code: string; name: string; lat: number; lon: number }[];
}

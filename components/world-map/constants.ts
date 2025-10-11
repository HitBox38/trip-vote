/**
 * Natural Earth GeoJSON data URL
 */
export const GEO_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

/**
 * Maximum zoom level for the map
 */
export const MAX_ZOOM = 10;

/**
 * Minimum zoom level for the map
 */
export const MIN_ZOOM = 1;

/**
 * Natural Earth has issues with some countries - map their names/codes to our ISO codes
 * This mapping fixes discrepancies between Natural Earth data and standard ISO codes
 */
export const NATURAL_EARTH_FIXES: Record<string, string> = {
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

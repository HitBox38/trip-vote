/* eslint-disable @typescript-eslint/no-explicit-any */
import { NATURAL_EARTH_FIXES } from "./constants";

/**
 * Extracts and normalizes country code from Natural Earth geography data
 * @param geo - Geography object from Natural Earth GeoJSON
 * @returns Normalized ISO 2-letter country code or undefined
 */
export function getCountryCode(geo: any): string | undefined {
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
    } else if (geo.properties?.NAME_LONG && NATURAL_EARTH_FIXES[geo.properties.NAME_LONG]) {
      countryCode = NATURAL_EARTH_FIXES[geo.properties.NAME_LONG];
    } else if (geo.properties?.FORMAL_EN && NATURAL_EARTH_FIXES[geo.properties.FORMAL_EN]) {
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

  return countryCode;
}

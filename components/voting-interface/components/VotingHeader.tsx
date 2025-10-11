import { Loader2 } from "lucide-react";

interface Prop {
  /** Participant username */
  username?: string;
  /** Whether user is editing existing vote */
  isEditing: boolean;
  /** Origin country code */
  originCountry?: string;
  /** Whether destinations are loading */
  loadingDestinations: boolean;
  /** Number of eligible countries */
  eligibleCountriesCount: number;
  /** Destination stats */
  destinationStats?: {
    visaFree: number;
    visaOnArrival: number;
    eVisa: number;
  };
  /** Function to get country name from code */
  getCountryName: (code: string) => string;
}

/**
 * Header component for the voting interface
 */
export function VotingHeader({
  username,
  isEditing,
  originCountry,
  loadingDestinations,
  eligibleCountriesCount,
  destinationStats,
  getCountryName,
}: Prop) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {isEditing ? "Edit Your Vote" : "Vote for Your Destinations"}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Welcome, <span className="font-semibold">{username || "Voter"}</span>! Select up to 5
        countries and rank them.
      </p>
      {isEditing && (
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          You&apos;re editing your previous response
        </p>
      )}
      {originCountry && (
        <div className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex flex-col items-center justify-center gap-1">
          {loadingDestinations ? (
            <p className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading visa-free destinations from {getCountryName(originCountry)}...
            </p>
          ) : (
            <>
              <p>
                Showing destinations accessible from {getCountryName(originCountry)} (
                {eligibleCountriesCount} {eligibleCountriesCount === 1 ? "country" : "countries"}{" "}
                available)
              </p>
              {destinationStats && (
                <p className="text-xs opacity-75">
                  {destinationStats.visaFree} visa-free · {destinationStats.visaOnArrival}{" "}
                  visa-on-arrival · {destinationStats.eVisa} e-visa
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

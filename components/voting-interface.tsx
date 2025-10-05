"use client";

import { useActionState } from "react";
import { submitVotes } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COUNTRIES } from "@/lib/countries";
import { MapPin, ArrowUp, ArrowDown, Trash2, Loader2 } from "lucide-react";
import { useVotingStore } from "@/lib/voting-store";
import { WorldMap } from "@/components/world-map";
import { useQuery as useConvexQuery } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface VotingInterfaceProps {
  sessionId: string;
  participantId: string;
  username: string;
}

export function VotingInterface({ sessionId, participantId, username }: VotingInterfaceProps) {
  const { selectedCountries, toggleCountry, moveUp, moveDown, removeCountry } = useVotingStore();
  const [state, formAction, isPending] = useActionState(submitVotes, null);
  const session = useConvexQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });

  const getCountryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name || code;

  // Fetch reachable countries using TanStack Query
  const { data: destinationsData, isLoading: loadingDestinations } = useQuery({
    queryKey: ["destinations", session?.originCountry],
    queryFn: async () => {
      if (!session?.originCountry) return null;

      const response = await fetch(`/api/destinations?origin=${session.originCountry}`);
      if (!response.ok) throw new Error("Failed to fetch destinations");

      return response.json();
    },
    enabled: !!session?.originCountry,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const reachableCountries = destinationsData?.destinations || [];

  // Filter countries based on origin country restriction and visa requirements
  const eligibleCountries: readonly { code: string; name: string; lat: number; lon: number }[] =
    session?.originCountry
      ? COUNTRIES.filter(
          (c) => c.code !== session.originCountry && reachableCountries.includes(c.code)
        )
      : COUNTRIES;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vote for Your Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-semibold">{username}</span>! Select up to 5 countries and
          rank them.
        </p>
        {session?.originCountry && (
          <div className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex flex-col items-center justify-center gap-1">
            {loadingDestinations ? (
              <p className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading visa-free destinations from {getCountryName(session.originCountry)}...
              </p>
            ) : (
              <>
                <p>
                  Showing destinations accessible from {getCountryName(session.originCountry)} (
                  {eligibleCountries.length}{" "}
                  {eligibleCountries.length === 1 ? "country" : "countries"} available)
                </p>
                {destinationsData?.stats && (
                  <p className="text-xs opacity-75">
                    {destinationsData.stats.visaFree} visa-free ·{" "}
                    {destinationsData.stats.visaOnArrival} visa-on-arrival ·{" "}
                    {destinationsData.stats.eVisa} e-visa
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Interactive World Map */}
        <Card>
          <CardHeader>
            <CardTitle>Select Countries on Map</CardTitle>
            <CardDescription>
              Click on up to 5 countries ({selectedCountries.length}/5 selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorldMap
              selectedCountries={selectedCountries}
              onCountryClick={toggleCountry}
              canSelect={selectedCountries.length < 5}
              eligibleCountries={eligibleCountries}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-1 gap-6">
          {/* Ranking */}
          <Card>
            <CardHeader>
              <CardTitle>Rank Your Choices</CardTitle>
              <CardDescription>Drag to reorder from most to least preferred</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCountries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select countries to start ranking</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedCountries.map((countryCode, index) => (
                    <div
                      key={countryCode}
                      className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="flex-1 font-medium text-sm">
                        {getCountryName(countryCode)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8 p-0">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDown(index)}
                          disabled={index === selectedCountries.length - 1}
                          className="h-8 w-8 p-0">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCountry(countryCode)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {state?.errors?.countries && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {state.errors.countries[0]}
                </p>
              )}

              <form action={formAction} className="mt-6">
                <input type="hidden" name="sessionId" value={sessionId} />
                <input type="hidden" name="participantId" value={participantId} />
                <input type="hidden" name="countries" value={JSON.stringify(selectedCountries)} />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || selectedCountries.length === 0}>
                  {isPending ? "Submitting..." : "Submit Your Vote"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2 } from "lucide-react";
import { getCountryName } from "@/lib/countries";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { Prop } from "./types";
import { TopDestinationsCard } from "./components/TopDestinationsCard";
import { CompleteRankingsCard } from "./components/CompleteRankingsCard";
import { ParticipantsCard } from "./components/ParticipantsCard";

/**
 * Component that displays the final results of a completed voting session
 * @param sessionId - The unique identifier for the voting session
 * @param isCreator - Whether the current user is the session creator
 * @param username - The username of the current user
 */
export function ResultsDisplay({ sessionId, isCreator, username }: Prop) {
  const results = useQuery(api.votes.getResults, { sessionId: sessionId as Id<"sessions"> });

  if (!results) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const topCountries = results.results.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vote Results</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Thanks for participating, <span className="font-semibold">{username}</span>!
        </p>
      </div>

      {topCountries.length > 0 && (
        <TopDestinationsCard
          topCountries={topCountries}
          allResults={results.results}
          sessionId={sessionId}
          participantCount={results.participants.length}
        />
      )}

      <CompleteRankingsCard results={results.results} />

      <ParticipantsCard participants={results.participants} />

      {isCreator && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-green-900 dark:text-green-100 mb-4">
                ✨ As the creator, you can now plan your trip to{" "}
                <span className="font-bold">{getCountryName(results.results[0].country)}</span>!
              </p>
              <Link href="/">
                <Button>Create Another Vote</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

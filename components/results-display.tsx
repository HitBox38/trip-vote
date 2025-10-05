"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, MapPin, Users, Loader2 } from "lucide-react";
import { getCountryName } from "@/lib/countries";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

interface ResultsDisplayProps {
  sessionId: string;
  isCreator: boolean;
  username: string;
}

export function ResultsDisplay({ sessionId, isCreator, username }: ResultsDisplayProps) {
  const results = useQuery(api.votes.getResults, { sessionId: sessionId as Id<"sessions"> });

  if (!results) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const topCountries = results.results.slice(0, 3);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

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

      {/* Top 3 Podium */}
      {topCountries.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-2xl">🏆 Top Destinations</CardTitle>
            <CardDescription>The most popular choices from your group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {topCountries.map((result, index) => (
                <div
                  key={result.country}
                  className={`
                    relative p-6 rounded-lg text-center
                    ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-400"
                        : ""
                    }
                    ${
                      index === 1
                        ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-2 border-gray-400"
                        : ""
                    }
                    ${
                      index === 2
                        ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 border-2 border-amber-400"
                        : ""
                    }
                  `}>
                  <div className="flex justify-center mb-3">{getMedalIcon(index)}</div>
                  <div className="text-3xl font-bold mb-2">#{index + 1}</div>
                  <div className="text-lg font-semibold mb-1">{getCountryName(result.country)}</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.score} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Results */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>All destinations ranked by total points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.results.map((result, index) => (
              <div
                key={result.country}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 shrink-0">
                  {index < 3 ? (
                    getMedalIcon(index)
                  ) : (
                    <span className="text-lg font-bold text-gray-500">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg mb-2">{getCountryName(result.country)}</div>
                  {result.votes && result.votes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {result.votes
                        .sort((a, b) => a.rank - b.rank)
                        .map((vote) => (
                          <Badge key={vote.participantId} variant="secondary" className="text-xs">
                            {vote.username} • #{vote.rank}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.score}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {results.participants.map((participant) => (
              <div
                key={participant._id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
                {participant.username}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

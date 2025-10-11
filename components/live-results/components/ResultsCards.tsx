import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShareResultsButton } from "@/components/share-results-button";
import { getCountryName } from "@/lib/countries";
import { getMedalIcon } from "../helpers";

interface ResultItem {
  country: string;
  score: number;
  votes: Array<{
    participantId: string;
    username: string;
    rank: number;
    points: number;
  }>;
}

interface Prop {
  /** Array of results */
  results: ResultItem[];
  /** Session ID */
  sessionId: string;
  /** Whether session is completed */
  isCompleted: boolean;
  /** Whether current user is creator */
  isCreator: boolean;
  /** Number of votes submitted */
  votedCount: number;
  /** Whether sharing is enabled */
  canShare: boolean;
}

/**
 * Component displaying voting results (both podium and full rankings)
 * @param results - Array of results
 * @param sessionId - Session ID
 * @param isCompleted - Whether session is completed
 * @param isCreator - Whether current user is creator
 * @param votedCount - Number of votes submitted
 * @param canShare - Whether sharing is enabled
 */
export function ResultsCards({
  results,
  sessionId,
  isCompleted,
  isCreator,
  votedCount,
  canShare,
}: Prop) {
  if (results.length === 0) return null;

  return (
    <>
      {/* Top 3 Podium */}
      {(isCompleted || votedCount > 0) && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {isCompleted ? "🏆 Final Results" : "📊 Current Leaders"}
                </CardTitle>
                <CardDescription>
                  {isCompleted
                    ? "The most popular choices from your group"
                    : "Live rankings (will be finalized when all votes are in)"}
                </CardDescription>
              </div>
              <ShareResultsButton
                results={results}
                sessionId={sessionId}
                isEnabled={canShare}
                participantCount={votedCount}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {results.slice(0, 3).map((result, index) => (
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

      {/* Full Rankings */}
      {(isCompleted || isCreator) && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Rankings</CardTitle>
            <CardDescription>
              {isCompleted
                ? "All destinations ranked by total points"
                : "Current rankings (hidden from participants until results are revealed)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
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
                    <div className="font-semibold text-lg mb-2">
                      {getCountryName(result.country)}
                    </div>
                    {isCompleted && result.votes && result.votes.length > 0 && (
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
      )}
    </>
  );
}

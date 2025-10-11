import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCountryName } from "@/lib/countries";
import { getMedalIcon } from "../helpers";

/**
 * Result item type for displaying country results
 */
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
  /** Array of all results to display */
  results: ResultItem[];
}

/**
 * Card component displaying complete rankings of all countries
 * @param results - Array of all results to display
 */
export function CompleteRankingsCard({ results }: Prop) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Rankings</CardTitle>
        <CardDescription>All destinations ranked by total points</CardDescription>
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
  );
}

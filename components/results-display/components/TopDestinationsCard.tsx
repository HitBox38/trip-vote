import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareResultsButton } from "@/components/share-results-button";
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
  /** Top 3 country results to display */
  topCountries: ResultItem[];
  /** All results for sharing */
  allResults: ResultItem[];
  /** Session ID */
  sessionId: string;
  /** Number of participants */
  participantCount: number;
}

/**
 * Card component displaying the top 3 destinations in a podium style
 * @param topCountries - Top 3 country results to display
 * @param allResults - All results for sharing
 * @param sessionId - Session ID
 * @param participantCount - Number of participants
 */
export function TopDestinationsCard({
  topCountries,
  allResults,
  sessionId,
  participantCount,
}: Prop) {
  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl">🏆 Top Destinations</CardTitle>
            <CardDescription>The most popular choices from your group</CardDescription>
          </div>
          <ShareResultsButton
            results={allResults}
            sessionId={sessionId}
            isEnabled={true}
            participantCount={participantCount}
          />
        </div>
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
  );
}

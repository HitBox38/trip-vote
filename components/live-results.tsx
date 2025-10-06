"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Circle,
  Users,
  Loader2,
  Eye,
  Copy,
  Check,
  Link2,
  Trophy,
  Medal,
  Award,
  MapPin,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useActionState } from "react";
import { revealResults } from "@/app/actions";
import { getCountryName } from "@/lib/countries";

interface LiveResultsProps {
  sessionId: string;
  isCreator: boolean;
  username: string;
  creatorId?: string;
}

export function LiveResults({ sessionId, isCreator, username, creatorId }: LiveResultsProps) {
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const results = useQuery(api.votes.getResults, { sessionId: sessionId as Id<"sessions"> });
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(revealResults, null);
  const [copied, setCopied] = useState(false);

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/vote/${sessionId}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    // Auto-redirect when voting is complete and results are revealed
    if (session?.status === "completed") {
      router.refresh();
    }
  }, [session?.status, router]);

  if (!session || !results) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const votedCount = session.participants.filter((p) => p.hasVoted).length;
  const totalCount = session.participants.length;
  const maxParticipants = session.maxParticipants;
  const allVoted = votedCount === totalCount && totalCount > 0;
  const isCompleted = session.status === "completed";
  const hasResults = results.results.length > 0;

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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isCompleted ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-blue-600"
          } text-white`}>
          {isCompleted ? <Trophy className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isCompleted ? "Final Results" : "Live Voting Session"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-semibold">{username}</span>!
        </p>
      </div>

      {/* Invite Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Invite Link
          </CardTitle>
          <CardDescription>Share this link with others to join the voting session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md font-mono"
            />
            <Button
              type="button"
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Link copied to clipboard!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Vote Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Progress</CardTitle>
          <CardDescription>
            {votedCount} of {totalCount} participants have voted (max: {maxParticipants})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${totalCount > 0 ? (votedCount / totalCount) * 100 : 0}%` }}
            />
          </div>

          {/* Participants list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {session.participants.map((participant) => (
              <div
                key={participant._id.toString()}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {participant.hasVoted ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="flex-1 font-medium text-sm">{participant.username}</span>
                <span
                  className={`text-xs font-semibold ${
                    participant.hasVoted ? "text-green-600 dark:text-green-400" : "text-gray-400"
                  }`}>
                  {participant.hasVoted ? "Voted" : "Waiting"}
                </span>
              </div>
            ))}
          </div>

          {isCreator && !allVoted && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                As the creator, you can reveal the results once all participants have submitted
                their votes.
              </p>
            </div>
          )}

          {isCreator && allVoted && !isCompleted && (
            <form action={formAction}>
              <input type="hidden" name="sessionId" value={sessionId} />
              <input type="hidden" name="creatorId" value={creatorId} />
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <p className="text-sm text-green-900 dark:text-green-100 font-semibold">
                    All participants have voted! You can now reveal the results.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Revealing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Reveal Results
                    </>
                  )}
                </Button>
                {state && !state.success && state.errors?.form && (
                  <p className="text-sm text-red-600 dark:text-red-400">{state.errors.form[0]}</p>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Current/Final Results */}
      {hasResults && (
        <>
          {/* Top 3 Podium - Only show when completed or if there are votes */}
          {(isCompleted || votedCount > 0) && results.results.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isCompleted ? "🏆 Final Results" : "📊 Current Leaders"}
                </CardTitle>
                <CardDescription>
                  {isCompleted
                    ? "The most popular choices from your group"
                    : "Live rankings (will be finalized when all votes are in)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {results.results.slice(0, 3).map((result, index) => (
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
                      <div className="text-lg font-semibold mb-1">
                        {getCountryName(result.country)}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.score} pts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Rankings - Only show when completed or if creator */}
          {(isCompleted || isCreator) && results.results.length > 0 && (
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
                        <div className="font-semibold text-lg mb-2">
                          {getCountryName(result.country)}
                        </div>
                        {isCompleted && result.votes && result.votes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {result.votes
                              .sort((a, b) => a.rank - b.rank)
                              .map((vote) => (
                                <Badge
                                  key={vote.participantId}
                                  variant="secondary"
                                  className="text-xs">
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
      )}
    </div>
  );
}

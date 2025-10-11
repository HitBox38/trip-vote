"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Clock, Trophy, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Prop } from "./types";
import { InviteLinkCard } from "./components/InviteLinkCard";
import { VoteProgressCard } from "./components/VoteProgressCard";
import { ResultsCards } from "./components/ResultsCards";

/**
 * Component displaying live voting results and session management
 * @param sessionId - The unique identifier for the voting session
 * @param isCreator - Whether the current user is the session creator
 * @param username - The username of the current user
 * @param creatorId - Optional creator ID
 */
export function LiveResults({ sessionId, isCreator, username, creatorId }: Prop) {
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const results = useQuery(api.votes.getResults, { sessionId: sessionId as Id<"sessions"> });
  const router = useRouter();
  const [managingParticipant, setManagingParticipant] = useState<string | null>(null);

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/vote/${sessionId}` : "";

  useEffect(() => {
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
  const isCompleted = session.status === "completed";
  const hasResults = results.results.length > 0;
  const maxParticipantsReached = totalCount === maxParticipants && votedCount === maxParticipants;
  const canShare = isCompleted || maxParticipantsReached;

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

      <InviteLinkCard inviteUrl={inviteUrl} />

      <VoteProgressCard
        votedCount={votedCount}
        totalCount={totalCount}
        maxParticipants={maxParticipants}
        participants={session.participants}
        sessionId={sessionId}
        creatorId={creatorId}
        isCreator={isCreator}
        isCompleted={isCompleted}
        managingParticipant={managingParticipant}
        setManagingParticipant={setManagingParticipant}
      />

      {hasResults && (
        <ResultsCards
          results={results.results}
          sessionId={sessionId}
          isCompleted={isCompleted}
          isCreator={isCreator}
          votedCount={votedCount}
          canShare={canShare}
        />
      )}
    </div>
  );
}

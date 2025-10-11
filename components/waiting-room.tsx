"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  MoreVertical,
  RotateCcw,
  UserX,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useActionState } from "react";
import { revealResults, resetParticipantVote, removeParticipant } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WaitingRoomProps {
  sessionId: string;
  isCreator: boolean;
  username: string;
  creatorId?: string;
}

interface ParticipantItemProps {
  participant: {
    _id: Id<"participants">;
    username: string;
    hasVoted: boolean;
  };
  sessionId: string;
  creatorId?: string;
  isCreator: boolean;
  managingParticipant: string | null;
  setManagingParticipant: (id: string | null) => void;
}

function ParticipantItem({
  participant,
  sessionId,
  creatorId,
  isCreator,
  managingParticipant,
  setManagingParticipant,
}: ParticipantItemProps) {
  const [, resetAction, isResetting] = useActionState(resetParticipantVote, null);
  const [, removeAction, isRemoving] = useActionState(removeParticipant, null);
  const isManaging = managingParticipant === participant._id.toString();

  const handleResetVote = () => {
    setManagingParticipant(participant._id.toString());
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("participantId", participant._id.toString());
    formData.append("creatorId", creatorId || "");
    resetAction(formData);
  };

  const handleRemoveParticipant = () => {
    if (
      !confirm(
        `Are you sure you want to remove ${participant.username}? This action cannot be undone.`
      )
    ) {
      return;
    }
    setManagingParticipant(participant._id.toString());
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("participantId", participant._id.toString());
    formData.append("creatorId", creatorId || "");
    removeAction(formData);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {participant.hasVoted ? (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-gray-400 shrink-0" />
      )}
      <span className="flex-1 font-medium text-sm">{participant.username}</span>
      <span
        className={`text-xs font-semibold ${
          participant.hasVoted ? "text-green-600 dark:text-green-400" : "text-gray-400"
        }`}>
        {participant.hasVoted ? "Voted" : "Waiting"}
      </span>
      {isCreator && creatorId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={isManaging && (isResetting || isRemoving)}>
              {isManaging && (isResetting || isRemoving) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MoreVertical className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {participant.hasVoted && (
              <DropdownMenuItem onClick={handleResetVote} disabled={isResetting}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Vote
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleRemoveParticipant}
              disabled={isRemoving}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
              <UserX className="w-4 h-4 mr-2" />
              Remove Participant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export function WaitingRoom({ sessionId, isCreator, username, creatorId }: WaitingRoomProps) {
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(revealResults, null);
  const [copied, setCopied] = useState(false);
  const [managingParticipant, setManagingParticipant] = useState<string | null>(null);

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
    // Auto-redirect to results when voting is complete
    if (session?.status === "completed") {
      router.refresh();
    }
  }, [session?.status, router]);

  if (!session) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const votedCount = session.participants.filter((p) => p.hasVoted).length;
  const totalCount = session.participants.length;
  const allVoted = votedCount === totalCount && totalCount > 0;
  const hasVotes = votedCount > 0;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Waiting for Votes</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-semibold">{username}</span>!
        </p>
      </div>

      <Card className="mb-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Vote Progress</CardTitle>
          <CardDescription>
            {votedCount} of {totalCount} participants have voted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${(votedCount / totalCount) * 100}%` }}
            />
          </div>

          {/* Participants list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {session.participants.map((participant) => (
              <ParticipantItem
                key={participant._id.toString()}
                participant={participant}
                sessionId={sessionId}
                creatorId={creatorId}
                isCreator={isCreator}
                managingParticipant={managingParticipant}
                setManagingParticipant={setManagingParticipant}
              />
            ))}
          </div>

          {isCreator && (
            <form action={formAction}>
              <input type="hidden" name="sessionId" value={sessionId} />
              <input type="hidden" name="creatorId" value={creatorId} />
              <div className="space-y-3">
                {allVoted ? (
                  <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <p className="text-sm text-green-900 dark:text-green-100 font-semibold">
                      All participants have voted! You can now close the vote and reveal the
                      results.
                    </p>
                  </div>
                ) : hasVotes ? (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      As the creator, you can close the vote at any time. {votedCount} of{" "}
                      {totalCount} participants have voted so far.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      Waiting for at least one participant to vote before you can close the vote.
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isPending || !hasVotes}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Closing Vote...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Close Vote & Reveal Results
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
    </div>
  );
}

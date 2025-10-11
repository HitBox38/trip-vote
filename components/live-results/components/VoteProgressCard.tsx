import { useActionState } from "react";
import { revealResults } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, Eye, Loader2 } from "lucide-react";
import { Participant } from "../types";
import { ParticipantItem } from "./ParticipantItem";

interface Prop {
  /** Current vote count */
  votedCount: number;
  /** Total participant count */
  totalCount: number;
  /** Maximum participants allowed */
  maxParticipants: number;
  /** Array of participants */
  participants: Participant[];
  /** Session ID */
  sessionId: string;
  /** Optional creator ID */
  creatorId?: string;
  /** Whether current user is creator */
  isCreator: boolean;
  /** Whether session is completed */
  isCompleted: boolean;
  /** ID of participant currently being managed */
  managingParticipant: string | null;
  /** Callback to set managing participant */
  setManagingParticipant: (id: string | null) => void;
}

/**
 * Card component displaying vote progress and participant list
 * @param votedCount - Current vote count
 * @param totalCount - Total participant count
 * @param maxParticipants - Maximum participants allowed
 * @param participants - Array of participants
 * @param sessionId - Session ID
 * @param creatorId - Optional creator ID
 * @param isCreator - Whether current user is creator
 * @param isCompleted - Whether session is completed
 * @param managingParticipant - ID of participant currently being managed
 * @param setManagingParticipant - Callback to set managing participant
 */
export function VoteProgressCard({
  votedCount,
  totalCount,
  maxParticipants,
  participants,
  sessionId,
  creatorId,
  isCreator,
  isCompleted,
  managingParticipant,
  setManagingParticipant,
}: Prop) {
  const [state, formAction, isPending] = useActionState(revealResults, null);

  const allVoted = votedCount === totalCount && totalCount > 0;
  const hasVotes = votedCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Progress</CardTitle>
        <CardDescription>
          {votedCount} of {maxParticipants} participants have voted
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <Progress value={(votedCount / maxParticipants) * 100} />

        {/* Participants list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {participants.map((participant) => (
            <ParticipantItem
              key={participant._id.toString()}
              participant={participant}
              sessionId={sessionId}
              creatorId={creatorId}
              isCreator={isCreator}
              isCompleted={isCompleted}
              managingParticipant={managingParticipant}
              setManagingParticipant={setManagingParticipant}
            />
          ))}
        </div>

        {isCreator && !isCompleted && (
          <form action={formAction}>
            <input type="hidden" name="sessionId" value={sessionId} />
            <input type="hidden" name="creatorId" value={creatorId} />
            <div className="space-y-3">
              {allVoted ? (
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                  <p className="text-sm text-green-900 dark:text-green-100 font-semibold">
                    All participants have voted! You can now close the vote and reveal the results.
                  </p>
                </div>
              ) : hasVotes ? (
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    As the creator, you can close the vote at any time. {votedCount} of {totalCount}{" "}
                    participants have voted so far.
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
              <Button type="submit" disabled={isPending || !hasVotes} className="w-full">
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
  );
}

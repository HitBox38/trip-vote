import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle2 } from "lucide-react";
import { JoinVoteForm } from "@/components/join-vote-form";

interface Prop {
  /** Session ID */
  sessionId: string;
  /** Participant ID */
  participantId?: string;
  /** Whether participant has already voted */
  alreadyVoted: boolean;
  /** Whether participant exists */
  isValidParticipant: boolean;
  /** Whether session is full */
  isFull: boolean;
  /** Optional default name from saved cookie */
  defaultName?: string;
}

/**
 * Component handling participant actions based on their status
 * @param sessionId - Session ID
 * @param participantId - Participant ID
 * @param alreadyVoted - Whether participant has already voted
 * @param isValidParticipant - Whether participant exists
 * @param isFull - Whether session is full
 * @param defaultName - Optional default name from saved cookie
 */
export function ParticipantActions({
  sessionId,
  participantId,
  alreadyVoted,
  isValidParticipant,
  isFull,
  defaultName = "",
}: Prop) {
  if (alreadyVoted && isValidParticipant && participantId) {
    return (
      <div className="border-t pt-4 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-green-600 dark:text-green-400 font-semibold mb-1">Already Voted</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You have already submitted your vote for this session
          </p>
        </div>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/vote/${sessionId}/voting?participant=${participantId}`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Your Response
          </Link>
        </Button>
      </div>
    );
  }

  if (isValidParticipant && participantId) {
    return (
      <div className="border-t pt-4 space-y-4">
        <div className="text-center">
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Ready to Vote</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You&apos;re already joined. Let&apos;s submit your vote!
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href={`/vote/${sessionId}/voting?participant=${participantId}`}>
            Submit Your Vote
          </Link>
        </Button>
      </div>
    );
  }

  if (!isFull) {
    return (
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold mb-3">Join the Vote</h3>
        <JoinVoteForm sessionId={sessionId} defaultName={defaultName} />
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="text-red-600 dark:text-red-400 font-semibold">This vote session is full</p>
    </div>
  );
}

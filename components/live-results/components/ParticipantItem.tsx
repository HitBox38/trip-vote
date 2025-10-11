import { startTransition } from "react";
import { useActionState } from "react";
import { resetParticipantVote, removeParticipant } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Circle, Loader2, MoreVertical, RotateCcw, UserX } from "lucide-react";
import { Participant } from "../types";

interface Prop {
  /** Participant data */
  participant: Participant;
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
 * Component displaying a single participant's status and management options
 * @param participant - Participant data
 * @param sessionId - Session ID
 * @param creatorId - Optional creator ID
 * @param isCreator - Whether current user is creator
 * @param isCompleted - Whether session is completed
 * @param managingParticipant - ID of participant currently being managed
 * @param setManagingParticipant - Callback to set managing participant
 */
export function ParticipantItem({
  participant,
  sessionId,
  creatorId,
  isCreator,
  isCompleted,
  managingParticipant,
  setManagingParticipant,
}: Prop) {
  const [, resetAction, isResetting] = useActionState(resetParticipantVote, null);
  const [, removeAction, isRemoving] = useActionState(removeParticipant, null);
  const isManaging = managingParticipant === participant._id.toString();

  const handleResetVote = () => {
    setManagingParticipant(participant._id.toString());
    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("participantId", participant._id.toString());
    formData.append("creatorId", creatorId || "");
    startTransition(() => {
      resetAction(formData);
    });
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
    startTransition(() => {
      removeAction(formData);
    });
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
      {isCreator && creatorId && !isCompleted && (
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

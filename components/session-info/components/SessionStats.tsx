import { Users, Clock } from "lucide-react";

interface Prop {
  /** Number of current participants */
  participantCount: number;
  /** Maximum number of participants */
  maxParticipants: number;
  /** Session status */
  status: string;
}

/**
 * Component displaying session statistics
 * @param participantCount - Number of current participants
 * @param maxParticipants - Maximum number of participants
 * @param status - Session status
 */
export function SessionStats({ participantCount, maxParticipants, status }: Prop) {
  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Participants</span>
        </div>
        <span className="text-sm font-bold">
          {participantCount} / {maxParticipants}
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Status</span>
        </div>
        <span className="text-sm font-bold capitalize">{status}</span>
      </div>
    </>
  );
}

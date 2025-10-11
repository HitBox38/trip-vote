import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Participant {
  _id: string;
  username: string;
}

interface Prop {
  /** Array of participants who voted */
  participants: Participant[];
}

/**
 * Card component displaying all participants who voted
 * @param participants - Array of participants who voted
 */
export function ParticipantsCard({ participants }: Prop) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
              {participant.username}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

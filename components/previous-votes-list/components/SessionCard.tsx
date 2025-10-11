import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { formatDate } from "../helpers";
import { Session } from "../types";

interface Prop {
  /** Session data to display */
  session: Session;
  /** Whether the user voted in this session */
  voted: boolean;
}

/**
 * Returns the appropriate status badge for a session
 * @param status - The session status
 * @returns Badge component with appropriate styling
 */
function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="default">Completed</Badge>;
    case "voting":
      return <Badge variant="secondary">In Progress</Badge>;
    case "waiting":
      return <Badge variant="outline">Waiting</Badge>;
    default:
      return null;
  }
}

/**
 * Card component displaying a single session's information
 * @param session - Session data to display
 * @param voted - Whether the user voted in this session
 */
export function SessionCard({ session, voted }: Prop) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">Vote Session</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {formatDate(session.createdAt)}
            </CardDescription>
          </div>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Participation:</span>
          <div className="flex items-center gap-1">
            {voted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">Voted</span>
              </>
            ) : (
              <span className="text-gray-600 dark:text-gray-400">Joined Only</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Participants:</span>
          <span className="font-medium">
            {session.participantCount} / {session.maxParticipants}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Votes Submitted:</span>
          <span className="font-medium">{session.votedCount}</span>
        </div>

        {session.originCountry && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Origin:</span>
            <span className="font-medium">{session.originCountry}</span>
          </div>
        )}

        <div className="pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/vote/${session._id}`}>
              View Session
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

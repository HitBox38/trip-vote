"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Prop } from "./types";
import { SessionHeader } from "./components/SessionHeader";
import { SessionStats } from "./components/SessionStats";
import { ParticipantActions } from "./components/ParticipantActions";

/**
 * Component that displays session information and handles joining/voting
 * @param sessionId - The unique identifier for the voting session
 * @param participantId - Optional participant ID if user has already joined
 * @param defaultName - Optional default name from saved cookie
 */
export function SessionInfo({ sessionId, participantId, defaultName = "" }: Prop) {
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const participant = useQuery(
    api.participants.getStatus,
    participantId ? { participantId: participantId as Id<"participants"> } : "skip"
  );

  if (session === undefined || (participantId && participant === undefined)) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This vote session doesn&apos;t exist or has been deleted.
        </p>
      </div>
    );
  }

  const isFull = session.maxParticipants - session.participants.length <= 0;
  const alreadyVoted = participant?.hasVoted ?? false;
  const isValidParticipant = participant !== null && participant !== undefined;

  return (
    <div className="w-full max-w-md">
      <SessionHeader />

      <Card>
        <CardHeader>
          <CardTitle>Vote Session Details</CardTitle>
          <CardDescription>Share this link with others to invite them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SessionStats
            participantCount={session.participants.length}
            maxParticipants={session.maxParticipants}
            status={session.status}
          />
          <ParticipantActions
            sessionId={sessionId}
            participantId={participantId}
            alreadyVoted={alreadyVoted}
            isValidParticipant={isValidParticipant}
            isFull={isFull}
            defaultName={defaultName}
          />
        </CardContent>
      </Card>
    </div>
  );
}

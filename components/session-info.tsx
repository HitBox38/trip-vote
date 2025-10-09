"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Globe, Users, Clock, Loader2, Edit, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinVoteForm } from "./join-vote-form";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SessionInfoProps {
  sessionId: string;
  alreadyVoted?: boolean;
  participantId?: string;
}

export function SessionInfo({ sessionId, alreadyVoted = false, participantId }: SessionInfoProps) {
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });

  if (session === undefined) {
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

  const availableSlots = session.maxParticipants - session.participants.length;
  const isFull = availableSlots <= 0;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Trip Vote</h1>
        <p className="text-gray-600 dark:text-gray-300">Help decide the next travel destination</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vote Session Details</CardTitle>
          <CardDescription>Share this link with others to invite them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Participants</span>
            </div>
            <span className="text-sm font-bold">
              {session.participants.length} / {session.maxParticipants}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <span className="text-sm font-bold capitalize">{session.status}</span>
          </div>

          {alreadyVoted && participantId ? (
            <div className="border-t pt-4 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-1">
                  Already Voted
                </p>
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
          ) : !isFull ? (
            <>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Join the Vote</h3>
                <JoinVoteForm sessionId={sessionId} />
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                This vote session is full
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

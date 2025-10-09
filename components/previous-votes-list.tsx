"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Clock, ExternalLink, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Session {
  _id: string;
  creatorId: string;
  maxParticipants: number;
  status: "waiting" | "voting" | "completed";
  createdAt: number;
  completedAt?: number;
  originCountry?: string;
  participantCount: number;
  votedCount: number;
}

interface PreviousVotesListProps {
  votedSessions: { sessionId: string; participantId: string }[];
  joinedSessions: { sessionId: string; participantId: string }[];
  sessions: Session[];
}

type FilterOption = "all" | "voted" | "joined-only";

export function PreviousVotesList({
  votedSessions,
  joinedSessions,
  sessions,
}: PreviousVotesListProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  // Create a map of session IDs to their participation status
  const sessionStatusMap = new Map<string, { voted: boolean; participantId: string }>();

  votedSessions.forEach(({ sessionId, participantId }) => {
    sessionStatusMap.set(sessionId, { voted: true, participantId });
  });

  joinedSessions.forEach(({ sessionId, participantId }) => {
    if (!sessionStatusMap.has(sessionId)) {
      sessionStatusMap.set(sessionId, { voted: false, participantId });
    }
  });

  // Filter sessions based on selected filter
  const filteredSessions = sessions.filter((session) => {
    const status = sessionStatusMap.get(session._id);
    if (!status) return false;

    if (filter === "voted") return status.voted;
    if (filter === "joined-only") return !status.voted;
    return true; // all
  });

  // Sort by creation date (newest first)
  const sortedSessions = [...filteredSessions].sort((a, b) => b.createdAt - a.createdAt);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
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
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Previous Votes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t participated in any voting sessions yet.
            </p>
            <Button asChild>
              <Link href="/">Create Your First Vote</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions ({sessions.length})</SelectItem>
              <SelectItem value="voted">Voted ({votedSessions.length})</SelectItem>
              <SelectItem value="joined-only">Joined Only ({joinedSessions.length})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedSessions.length} {sortedSessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No sessions match your current filter.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedSessions.map((session) => {
            const status = sessionStatusMap.get(session._id);
            const voted = status?.voted || false;

            return (
              <Card key={session._id} className="hover:shadow-lg transition-shadow">
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
          })}
        </div>
      )}
    </div>
  );
}

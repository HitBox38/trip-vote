"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Prop, FilterOption } from "./types";
import { SessionCard } from "./components/SessionCard";
import { EmptyState } from "./components/EmptyState";
import { FilterBar } from "./components/FilterBar";
import { createSessionStatusMap } from "./helpers";

/**
 * Component that displays a list of previous voting sessions the user participated in
 * @param votedSessions - Array of sessions where the user has voted
 * @param joinedSessions - Array of sessions where the user has joined but not voted
 * @param sessions - Array of all session data
 */
export function PreviousVotesList({ votedSessions, joinedSessions, sessions }: Prop) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const sessionStatusMap = createSessionStatusMap(votedSessions, joinedSessions);

  const filteredSessions = sessions.filter((session) => {
    const status = sessionStatusMap.get(session._id);
    if (!status) return false;
    if (filter === "voted") return status.voted;
    if (filter === "joined-only") return !status.voted;
    return true;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => b.createdAt - a.createdAt);

  if (sessions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        totalSessions={sessions.length}
        votedCount={votedSessions.length}
        joinedCount={joinedSessions.length}
        filteredCount={sortedSessions.length}
      />

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
            return <SessionCard key={session._id} session={session} voted={voted} />;
          })}
        </div>
      )}
    </div>
  );
}

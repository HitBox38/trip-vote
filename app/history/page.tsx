import { Metadata } from "next";
import { getPreviousVotes } from "../actions";
import { PreviousVotesList } from "@/components/previous-votes-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Previous Votes - Trip Vote",
  description: "View your voting history and past sessions",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HistoryPage() {
  const { votedSessions, joinedSessions, sessions } = await getPreviousVotes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Previous Votes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your voting history and past sessions
          </p>
        </div>

        <PreviousVotesList
          votedSessions={votedSessions}
          joinedSessions={joinedSessions}
          sessions={sessions}
        />
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LiveResults } from "@/components/live-results/index";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Vote Results",
    description:
      "View real-time voting results and see which destinations are winning the group vote.",
    openGraph: {
      title: "Vote Results | Trip Vote",
      description:
        "View real-time voting results and see which destinations are winning the group vote.",
      url: `/vote/${id}/waiting`,
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function WaitingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ participant?: string; creator?: string }>;
}) {
  const { id } = await params;
  const { creator, participant } = await searchParams;

  const isCreator = !!creator;
  let username = isCreator ? "Creator" : "Participant";

  // If creator, try to get their name from the session
  if (isCreator) {
    try {
      const session = await convex.query(api.sessions.get, {
        sessionId: id as Id<"sessions">,
      });
      if (session?.creatorName) {
        username = session.creatorName;
      }
    } catch {
      // If error, use default "Creator"
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <LiveResults
        sessionId={id}
        isCreator={isCreator}
        username={username}
        creatorId={creator}
        participantId={participant}
      />
    </div>
  );
}

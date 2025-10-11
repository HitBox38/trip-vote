import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SessionInfo } from "@/components/session-info";
import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getSavedUsername } from "@/app/actions";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Try to fetch session to get creator name
  let creatorName: string | undefined;
  try {
    const session = await convex.query(api.sessions.get, {
      sessionId: id as Id<"sessions">,
    });
    creatorName = session?.creatorName;
  } catch {
    // Session not found or error - use default description
  }

  const description = creatorName
    ? `${creatorName} is inviting you to vote on the next travel destination together.`
    : "Join this collaborative travel voting session and help decide the next group destination together.";

  const ogDescription = creatorName
    ? `${creatorName} is inviting you to vote on the next travel destination.`
    : "Join this collaborative travel voting session and help decide the next group destination.";

  return {
    title: "Join Vote Session",
    description,
    openGraph: {
      title: "Join Vote Session | Trip Vote",
      description: ogDescription,
      url: `/vote/${id}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Join Trip Vote Session",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Join Vote Session | Trip Vote",
      description: ogDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: false, // Don't index individual sessions
      follow: false,
    },
  };
}

export default async function VoteSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creator?: string }>;
}) {
  const { id } = await params;
  const { creator } = await searchParams;

  // If creator, redirect to waiting page
  if (creator) {
    redirect(`/vote/${id}/waiting?creator=${creator}`);
  }

  // Check if user has cookies for this session
  const cookieStore = await cookies();
  const votedParticipantId = cookieStore.get(`voted_${id}`)?.value;
  const joinedParticipantId = cookieStore.get(`joined_${id}`)?.value;
  const participantId = votedParticipantId || joinedParticipantId;

  // Get saved username for default value
  const savedUsername = await getSavedUsername();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SessionInfo sessionId={id} participantId={participantId} defaultName={savedUsername} />
    </div>
  );
}

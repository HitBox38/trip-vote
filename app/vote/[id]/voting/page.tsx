import { redirect } from "next/navigation";
import { VotingInterface } from "@/components/voting-interface";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Vote for Destinations",
    description:
      "Select and rank your preferred travel destinations. Your vote counts towards the group decision!",
    openGraph: {
      title: "Vote for Destinations | Trip Vote",
      description:
        "Select and rank your preferred travel destinations in this collaborative voting session.",
      url: `/vote/${id}/voting`,
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function VotingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ participant?: string; creator?: string }>;
}) {
  const { id } = await params;
  const { participant, creator } = await searchParams;

  if (!participant) {
    redirect(`/vote/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <VotingInterface sessionId={id} participantId={participant} creatorId={creator} />
    </div>
  );
}

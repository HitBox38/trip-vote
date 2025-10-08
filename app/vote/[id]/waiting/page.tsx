import { LiveResults } from "@/components/live-results";
import { Metadata } from "next";

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
  const { creator } = await searchParams;

  const isCreator = !!creator;
  const username = isCreator ? "Creator" : "Participant";

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <LiveResults sessionId={id} isCreator={isCreator} username={username} creatorId={creator} />
    </div>
  );
}

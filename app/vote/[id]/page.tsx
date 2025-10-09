import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SessionInfo } from "@/components/session-info";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Join Vote Session",
    description:
      "Join this collaborative travel voting session and help decide the next group destination together.",
    openGraph: {
      title: "Join Vote Session | Trip Vote",
      description:
        "Join this collaborative travel voting session and help decide the next group destination.",
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
      description:
        "Join this collaborative travel voting session and help decide the next group destination.",
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

  // Check if user has already voted
  const cookieStore = await cookies();
  const alreadyVoted = cookieStore.has(`voted_${id}`);
  const participantId = cookieStore.get(`voted_${id}`)?.value;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SessionInfo sessionId={id} alreadyVoted={alreadyVoted} participantId={participantId} />
    </div>
  );
}

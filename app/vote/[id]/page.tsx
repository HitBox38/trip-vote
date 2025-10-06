import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SessionInfo } from "@/components/session-info";

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SessionInfo sessionId={id} alreadyVoted={alreadyVoted} />
    </div>
  );
}

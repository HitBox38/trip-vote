import { redirect } from "next/navigation";
import { VotingInterface } from "@/components/voting-interface";

export default async function VotingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ participant?: string }>;
}) {
  const { id } = await params;
  const { participant } = await searchParams;

  if (!participant) {
    redirect(`/vote/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <VotingInterface sessionId={id} participantId={participant} username="Voter" />
    </div>
  );
}

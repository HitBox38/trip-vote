import { ResultsDisplay } from "@/components/results-display";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creator?: string; participant?: string }>;
}) {
  const { id } = await params;
  const { creator } = await searchParams;

  const isCreator = !!creator;
  const username = isCreator ? "Creator" : "Participant";

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ResultsDisplay sessionId={id} isCreator={isCreator} username={username} />
    </div>
  );
}

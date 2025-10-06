import { redirect } from "next/navigation";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creator?: string; participant?: string }>;
}) {
  const { id } = await params;
  const { creator, participant } = await searchParams;

  // Redirect to waiting page which now shows live results
  const queryParams = new URLSearchParams();
  if (creator) queryParams.set("creator", creator);
  if (participant) queryParams.set("participant", participant);

  redirect(`/vote/${id}/waiting?${queryParams.toString()}`);
}

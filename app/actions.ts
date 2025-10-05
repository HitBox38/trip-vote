"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Schema for creating a vote session
const createVoteSchema = z.object({
  maxParticipants: z.coerce
    .number()
    .min(2, "At least 2 participants required")
    .max(20, "Maximum 20 participants"),
  originCountry: z.string().optional(),
});

export async function createVote(prevState: unknown, formData: FormData) {
  const originCountry = formData.get("originCountry");
  const result = createVoteSchema.safeParse({
    maxParticipants: formData.get("maxParticipants"),
    originCountry: originCountry === "" ? undefined : originCountry,
  });

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      errors[field] = [...(errors[field] || []), issue.message];
    });
    return { success: false, errors };
  }

  const creatorId = nanoid();

  const sessionId = await convex.mutation(api.sessions.create, {
    creatorId,
    maxParticipants: result.data.maxParticipants,
    originCountry: result.data.originCountry,
  });

  return {
    success: true,
    sessionId: sessionId as string,
    creatorId,
  };
}

// Schema for joining a vote session
const joinVoteSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  sessionId: z.string(),
});

export async function joinVote(prevState: unknown, formData: FormData) {
  const result = joinVoteSchema.safeParse({
    username: formData.get("username"),
    sessionId: formData.get("sessionId"),
  });

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      errors[field] = [...(errors[field] || []), issue.message];
    });
    return { success: false, errors };
  }

  const { username, sessionId } = result.data;

  let participantId: string;

  try {
    participantId = await convex.mutation(api.participants.add, {
      sessionId: sessionId as Id<"sessions">,
      username,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      errors: { username: [err.message || "Failed to join session"] },
    };
  }

  // Redirect must be outside try/catch as it throws a special error
  redirect(`/vote/${sessionId}/voting?participant=${participantId}`);
}

// Schema for submitting votes
const submitVotesSchema = z.object({
  sessionId: z.string(),
  participantId: z.string(),
  countries: z
    .string()
    .transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    })
    .pipe(
      z.array(z.string()).min(1, "Select at least 1 country").max(5, "Select at most 5 countries")
    ),
});

export async function submitVotes(prevState: unknown, formData: FormData) {
  const result = submitVotesSchema.safeParse({
    sessionId: formData.get("sessionId"),
    participantId: formData.get("participantId"),
    countries: formData.get("countries"),
  });

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      errors[field] = [...(errors[field] || []), issue.message];
    });
    return { success: false, errors };
  }

  const { sessionId, participantId, countries } = result.data;

  try {
    await convex.mutation(api.votes.submit, {
      sessionId: sessionId as Id<"sessions">,
      participantId: participantId as Id<"participants">,
      countries,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      errors: { countries: [err.message || "Failed to submit vote"] },
    };
  }

  // Redirect must be outside try/catch as it throws a special error
  redirect(`/vote/${sessionId}/waiting?participant=${participantId}`);
}

// Schema for revealing results
const revealResultsSchema = z.object({
  sessionId: z.string(),
  creatorId: z.string(),
});

export async function revealResults(prevState: unknown, formData: FormData) {
  const result = revealResultsSchema.safeParse({
    sessionId: formData.get("sessionId"),
    creatorId: formData.get("creatorId"),
  });

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      errors[field] = [...(errors[field] || []), issue.message];
    });
    return { success: false, errors };
  }

  const { sessionId, creatorId } = result.data;

  try {
    await convex.mutation(api.sessions.revealResults, {
      sessionId: sessionId as Id<"sessions">,
      creatorId,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      errors: { form: [err.message || "Failed to reveal results"] },
    };
  }

  // Redirect must be outside try/catch as it throws a special error
  redirect(`/vote/${sessionId}/results?creator=${creatorId}`);
}

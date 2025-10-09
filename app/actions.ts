"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

    // Set cookie to track user joined this session (expires in 30 days)
    const cookieStore = await cookies();
    cookieStore.set(`joined_${sessionId}`, participantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
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

  const cookieStore = await cookies();

  try {
    await convex.mutation(api.votes.submit, {
      sessionId: sessionId as Id<"sessions">,
      participantId: participantId as Id<"participants">,
      countries,
    });

    // Set cookie to prevent double voting (expires in 30 days)
    cookieStore.set(`voted_${sessionId}`, participantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
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
  redirect(`/vote/${sessionId}/waiting?creator=${creatorId}`);
}

// Get user's previous votes from cookies
export async function getPreviousVotes() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const votedSessions: { sessionId: string; participantId: string }[] = [];
  const joinedSessions: { sessionId: string; participantId: string }[] = [];

  // Parse all cookies to find voted and joined sessions
  allCookies.forEach((cookie) => {
    if (cookie.name.startsWith("voted_")) {
      const sessionId = cookie.name.replace("voted_", "");
      votedSessions.push({ sessionId, participantId: cookie.value });
    } else if (cookie.name.startsWith("joined_")) {
      const sessionId = cookie.name.replace("joined_", "");
      // Only include if user didn't vote (no voted_ cookie for this session)
      if (!allCookies.some((c) => c.name === `voted_${sessionId}`)) {
        joinedSessions.push({ sessionId, participantId: cookie.value });
      }
    }
  });

  // Get all unique session IDs
  const allSessionIds = [
    ...votedSessions.map((s) => s.sessionId),
    ...joinedSessions.map((s) => s.sessionId),
  ];

  if (allSessionIds.length === 0) {
    return { votedSessions: [], joinedSessions: [], sessions: [] };
  }

  // Fetch session details from Convex
  const sessions = await convex.query(api.sessions.getMultiple, {
    sessionIds: allSessionIds,
  });

  return {
    votedSessions,
    joinedSessions,
    sessions,
  };
}

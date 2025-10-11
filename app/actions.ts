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
  creatorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  maxParticipants: z.coerce
    .number()
    .min(2, "At least 2 participants required")
    .max(20, "Maximum 20 participants"),
  originCountry: z.string().optional(),
});

export async function createVote(prevState: unknown, formData: FormData) {
  const originCountry = formData.get("originCountry");
  const creatorName = formData.get("creatorName");
  const result = createVoteSchema.safeParse({
    creatorName: creatorName === "" ? undefined : creatorName,
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
    creatorName: result.data.creatorName,
    maxParticipants: result.data.maxParticipants,
    originCountry: result.data.originCountry,
  });

  const cookieStore = await cookies();

  // Save creator name to cookie for future use
  if (result.data.creatorName) {
    cookieStore.set("saved_username", result.data.creatorName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    // Auto-join creator as participant
    const participantId = await convex.mutation(api.participants.add, {
      sessionId: sessionId as Id<"sessions">,
      username: result.data.creatorName,
    });

    // Save participant ID in cookies
    cookieStore.set(`joined_${sessionId}`, participantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Store creator relationship
    cookieStore.set(`creator_${sessionId}`, creatorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Redirect to waiting page with both creator and participant IDs
    redirect(`/vote/${sessionId}/waiting?creator=${creatorId}&participant=${participantId}`);
  }

  return {
    success: true,
    sessionId: sessionId as string,
    creatorId,
    creatorName: result.data.creatorName,
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

    // Save username to cookie for future use
    cookieStore.set("saved_username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
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

// Schema for creator joining as participant
const joinAsCreatorSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  sessionId: z.string(),
  creatorId: z.string(),
});

export async function joinVoteAsCreator(prevState: unknown, formData: FormData) {
  const result = joinAsCreatorSchema.safeParse({
    username: formData.get("username"),
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

  const { username, sessionId, creatorId } = result.data;

  let participantId: string;

  try {
    participantId = await convex.mutation(api.participants.add, {
      sessionId: sessionId as Id<"sessions">,
      username,
    });

    // Set cookies to track creator's participant ID
    const cookieStore = await cookies();
    cookieStore.set(`joined_${sessionId}`, participantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Also store creator relationship
    cookieStore.set(`creator_${sessionId}`, creatorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Save username to cookie for future use
    cookieStore.set("saved_username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
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
  redirect(`/vote/${sessionId}/voting?participant=${participantId}&creator=${creatorId}`);
}

// Schema for submitting votes
const submitVotesSchema = z.object({
  sessionId: z.string(),
  participantId: z.string(),
  creatorId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || undefined),
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
    creatorId: formData.get("creatorId"),
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

  const { sessionId, participantId, creatorId, countries } = result.data;

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

  // Return success with redirect URL for client-side navigation
  const redirectUrl = creatorId
    ? `/vote/${sessionId}/waiting?participant=${participantId}&creator=${creatorId}`
    : `/vote/${sessionId}/waiting?participant=${participantId}`;

  return { success: true, redirectUrl };
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

// Schema for resetting a participant's vote
const resetVoteSchema = z.object({
  sessionId: z.string(),
  participantId: z.string(),
  creatorId: z.string(),
});

export async function resetParticipantVote(prevState: unknown, formData: FormData) {
  const result = resetVoteSchema.safeParse({
    sessionId: formData.get("sessionId"),
    participantId: formData.get("participantId"),
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

  const { sessionId, participantId, creatorId } = result.data;

  try {
    await convex.mutation(api.votes.resetVote, {
      sessionId: sessionId as Id<"sessions">,
      participantId: participantId as Id<"participants">,
      creatorId,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      errors: { form: [err.message || "Failed to reset vote"] },
    };
  }

  return { success: true };
}

// Schema for removing a participant
const removeParticipantSchema = z.object({
  sessionId: z.string(),
  participantId: z.string(),
  creatorId: z.string(),
});

export async function removeParticipant(prevState: unknown, formData: FormData) {
  const result = removeParticipantSchema.safeParse({
    sessionId: formData.get("sessionId"),
    participantId: formData.get("participantId"),
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

  const { sessionId, participantId, creatorId } = result.data;

  try {
    await convex.mutation(api.participants.remove, {
      sessionId: sessionId as Id<"sessions">,
      participantId: participantId as Id<"participants">,
      creatorId,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      errors: { form: [err.message || "Failed to remove participant"] },
    };
  }

  return { success: true };
}

// Get saved username from cookies
export async function getSavedUsername() {
  const cookieStore = await cookies();
  const savedUsername = cookieStore.get("saved_username")?.value;
  return savedUsername || "";
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
      joinedSessions.push({ sessionId, participantId: cookie.value });
    }
  });

  // Get all unique session IDs
  const allSessionIds = Array.from(
    new Set([...votedSessions.map((s) => s.sessionId), ...joinedSessions.map((s) => s.sessionId)])
  );

  if (allSessionIds.length === 0) {
    return { votedSessions: [], joinedSessions: [], sessions: [] };
  }

  // Verify participant status for each voted session
  // Check if votes were reset by comparing cookie status with database status
  const verifiedVotedSessions: { sessionId: string; participantId: string }[] = [];
  const actualJoinedSessions: { sessionId: string; participantId: string }[] = [];

  for (const { sessionId, participantId } of votedSessions) {
    try {
      const participant = await convex.query(api.participants.getStatus, {
        participantId: participantId as Id<"participants">,
      });

      if (participant && participant.hasVoted) {
        // Vote is still valid
        verifiedVotedSessions.push({ sessionId, participantId });
      } else if (participant && !participant.hasVoted) {
        // Vote was reset - show as joined only
        actualJoinedSessions.push({ sessionId, participantId });
      }
      // If participant is null (removed), we just skip it
    } catch {
      // Error checking participant - skip it
    }
  }

  // Check joined sessions
  for (const { sessionId, participantId } of joinedSessions) {
    // Skip if already processed as voted
    if (verifiedVotedSessions.some((v) => v.sessionId === sessionId)) {
      continue;
    }
    // Skip if already in actualJoinedSessions from reset votes
    if (actualJoinedSessions.some((v) => v.sessionId === sessionId)) {
      continue;
    }

    try {
      const participant = await convex.query(api.participants.getStatus, {
        participantId: participantId as Id<"participants">,
      });

      if (participant) {
        actualJoinedSessions.push({ sessionId, participantId });
      }
      // If participant is null (removed), we just skip it
    } catch {
      // Error checking participant - skip it
    }
  }

  // Fetch session details from Convex
  const validSessionIds = Array.from(
    new Set([
      ...verifiedVotedSessions.map((s) => s.sessionId),
      ...actualJoinedSessions.map((s) => s.sessionId),
    ])
  );

  const sessions =
    validSessionIds.length > 0
      ? await convex.query(api.sessions.getMultiple, {
          sessionIds: validSessionIds,
        })
      : [];

  return {
    votedSessions: verifiedVotedSessions,
    joinedSessions: actualJoinedSessions,
    sessions,
  };
}

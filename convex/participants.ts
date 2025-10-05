import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a participant to a session
export const add = mutation({
  args: {
    sessionId: v.id("sessions"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if username already exists in session
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const usernameExists = existing.some(
      (p) => p.username.toLowerCase() === args.username.toLowerCase()
    );

    if (usernameExists) {
      throw new Error("Username already taken");
    }

    // Check session capacity
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (existing.length >= session.maxParticipants) {
      throw new Error("Session is full");
    }

    // Add participant
    const participantId = await ctx.db.insert("participants", {
      sessionId: args.sessionId,
      username: args.username,
      hasVoted: false,
    });

    // Update session status to voting if all participants joined
    if (existing.length + 1 >= session.maxParticipants) {
      await ctx.db.patch(args.sessionId, { status: "voting" });
    }

    return participantId;
  },
});

// Get a participant by ID
export const get = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.participantId);
  },
});

// Mark participant as voted
export const markVoted = mutation({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.participantId, { hasVoted: true });
  },
});

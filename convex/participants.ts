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

// Remove a participant from session (creator only)
export const remove = mutation({
  args: {
    sessionId: v.id("sessions"),
    participantId: v.id("participants"),
    creatorId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify session and creator
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.creatorId !== args.creatorId) {
      throw new Error("Only the creator can remove participants");
    }

    // Verify participant exists and belongs to session
    const participant = await ctx.db.get(args.participantId);
    if (!participant || participant.sessionId !== args.sessionId) {
      throw new Error("Participant not found in this session");
    }

    // Delete participant's vote if exists
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .first();

    if (vote) {
      await ctx.db.delete(vote._id);
    }

    // Delete participant
    await ctx.db.delete(args.participantId);

    return true;
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new vote session
export const create = mutation({
  args: {
    creatorId: v.string(),
    creatorName: v.optional(v.string()),
    maxParticipants: v.number(),
    originCountry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      creatorId: args.creatorId,
      creatorName: args.creatorName,
      maxParticipants: args.maxParticipants,
      status: "waiting",
      createdAt: Date.now(),
      originCountry: args.originCountry,
    });
    return sessionId;
  },
});

// Get a session by ID
export const get = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    // Get all participants
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Get all votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return {
      ...session,
      _id: args.sessionId,
      participants,
      votes,
    };
  },
});

// Update session status
export const updateStatus = mutation({
  args: {
    sessionId: v.id("sessions"),
    status: v.union(v.literal("waiting"), v.literal("voting"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      status: args.status,
    });
  },
});

// Reveal results (creator only)
export const revealResults = mutation({
  args: {
    sessionId: v.id("sessions"),
    creatorId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Verify the creator
    if (session.creatorId !== args.creatorId) {
      throw new Error("Only the creator can reveal results");
    }

    // Check if at least one participant has voted
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const hasVotes = participants.some((p) => p.hasVoted);
    if (!hasVotes) {
      throw new Error("At least one participant must vote before revealing results");
    }

    // Update session status to completed with timestamp
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
    });

    return true;
  },
});

// Get multiple sessions by their IDs
export const getMultiple = query({
  args: {
    sessionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const sessions = await Promise.all(
      args.sessionIds.map(async (id) => {
        try {
          const sessionId = id as Id<"sessions">;
          const session = await ctx.db.get(sessionId);
          if (!session) return null;

          // Get participant count
          const participants = await ctx.db
            .query("participants")
            .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
            .collect();

          const votedCount = participants.filter((p) => p.hasVoted).length;

          return {
            ...session,
            _id: id,
            participantCount: participants.length,
            votedCount,
          };
        } catch {
          return null;
        }
      })
    );

    return sessions.filter((s) => s !== null);
  },
});

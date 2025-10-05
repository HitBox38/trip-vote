import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a vote
export const submit = mutation({
  args: {
    sessionId: v.id("sessions"),
    participantId: v.id("participants"),
    countries: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if participant exists
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }

    // Check if already voted
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .first();

    if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        countries: args.countries,
      });
    } else {
      // Create new vote
      await ctx.db.insert("votes", {
        sessionId: args.sessionId,
        participantId: args.participantId,
        countries: args.countries,
      });
    }

    // Mark participant as voted
    await ctx.db.patch(args.participantId, { hasVoted: true });

    return true;
  },
});

// Get results for a session
export const getResults = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    const participants = await ctx.db
      .query("participants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Calculate scores and track who voted for what
    const countryScores = new Map<string, number>();
    const countryVotes = new Map<
      string,
      Array<{ participantId: string; username: string; rank: number; points: number }>
    >();

    // Create participant lookup map
    const participantMap = new Map(participants.map((p) => [p._id, p]));

    votes.forEach((vote) => {
      const participant = participantMap.get(vote.participantId);
      if (!participant) return;

      vote.countries.forEach((country, index) => {
        const rank = index + 1;
        const points = 5 - index;

        // Add to scores
        const currentScore = countryScores.get(country) || 0;
        countryScores.set(country, currentScore + points);

        // Track who voted for this country
        const votes = countryVotes.get(country) || [];
        votes.push({
          participantId: vote.participantId,
          username: participant.username,
          rank,
          points,
        });
        countryVotes.set(country, votes);
      });
    });

    // Sort by score
    const sortedResults = Array.from(countryScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([country, score]) => ({
        country,
        score,
        votes: countryVotes.get(country) || [],
      }));

    return {
      session: { ...session, _id: args.sessionId },
      participants,
      results: sortedResults,
    };
  },
});

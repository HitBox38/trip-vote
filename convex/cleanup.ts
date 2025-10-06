import { internalMutation } from "./_generated/server";

// Delete old sessions:
// - Completed sessions: 1 week after completion
// - Non-completed sessions: 2 weeks after creation (abandoned votes)
export const deleteOldCompletedVotes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    // Find completed sessions older than 1 week
    const oldCompletedSessions = await ctx.db
      .query("sessions")
      .withIndex("by_completed_at", (q) => q.lt("completedAt", oneWeekAgo))
      .filter((q) => q.neq(q.field("completedAt"), undefined))
      .collect();

    // Find non-completed sessions older than 2 weeks
    const oldAbandonedSessions = await ctx.db
      .query("sessions")
      .withIndex("by_created_at", (q) => q.lt("createdAt", twoWeeksAgo))
      .filter((q) =>
        q.and(q.neq(q.field("status"), "completed"), q.eq(q.field("completedAt"), undefined))
      )
      .collect();

    const sessionsToDelete = [...oldCompletedSessions, ...oldAbandonedSessions];
    let deletedCount = 0;

    for (const session of sessionsToDelete) {
      // Delete all participants for this session
      const participants = await ctx.db
        .query("participants")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();

      for (const participant of participants) {
        await ctx.db.delete(participant._id);
      }

      // Delete all votes for this session
      const votes = await ctx.db
        .query("votes")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();

      for (const vote of votes) {
        await ctx.db.delete(vote._id);
      }

      // Finally, delete the session itself
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    console.log(
      `Deleted ${oldCompletedSessions.length} completed sessions (>1 week old) ` +
        `and ${oldAbandonedSessions.length} abandoned sessions (>2 weeks old)`
    );

    return {
      deletedCount,
      completedCount: oldCompletedSessions.length,
      abandonedCount: oldAbandonedSessions.length,
    };
  },
});

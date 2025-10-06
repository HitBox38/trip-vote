import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    creatorId: v.string(),
    maxParticipants: v.number(),
    status: v.union(v.literal("waiting"), v.literal("voting"), v.literal("completed")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()), // Timestamp when vote was completed
    originCountry: v.optional(v.string()), // Optional country code to limit voter choices
  })
    .index("by_created_at", ["createdAt"])
    .index("by_completed_at", ["completedAt"]),

  participants: defineTable({
    sessionId: v.id("sessions"),
    username: v.string(),
    hasVoted: v.boolean(),
  }).index("by_session", ["sessionId"]),

  votes: defineTable({
    sessionId: v.id("sessions"),
    participantId: v.id("participants"),
    countries: v.array(v.string()), // Ordered array of country codes
  })
    .index("by_session", ["sessionId"])
    .index("by_participant", ["participantId"]),
});

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run cleanup daily at 3 AM UTC to delete:
// - Completed votes older than 1 week
// - Abandoned (non-completed) votes older than 2 weeks
crons.daily(
  "Delete old votes",
  { hourUTC: 3, minuteUTC: 0 },
  internal.cleanup.deleteOldCompletedVotes
);

export default crons;

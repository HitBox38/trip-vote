import { Id } from "@/convex/_generated/dataModel";

/**
 * Component prop interface for LiveResults
 */
export interface Prop {
  /** The unique identifier for the voting session */
  sessionId: string;
  /** Whether the current user is the session creator */
  isCreator: boolean;
  /** The username of the current user */
  username: string;
  /** Optional creator ID */
  creatorId?: string;
}

/**
 * Participant data structure
 */
export interface Participant {
  _id: Id<"participants">;
  username: string;
  hasVoted: boolean;
}

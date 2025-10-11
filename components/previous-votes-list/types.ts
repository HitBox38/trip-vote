/**
 * Represents a voting session with its metadata
 */
export interface Session {
  _id: string;
  creatorId: string;
  maxParticipants: number;
  status: "waiting" | "voting" | "completed";
  createdAt: number;
  completedAt?: number;
  originCountry?: string;
  participantCount: number;
  votedCount: number;
}

/**
 * Component prop interface for PreviousVotesList
 */
export interface Prop {
  /** Array of sessions where the user has voted */
  votedSessions: { sessionId: string; participantId: string }[];
  /** Array of sessions where the user has joined but not voted */
  joinedSessions: { sessionId: string; participantId: string }[];
  /** Array of all session data */
  sessions: Session[];
}

/**
 * Filter options for the votes list
 */
export type FilterOption = "all" | "voted" | "joined-only";

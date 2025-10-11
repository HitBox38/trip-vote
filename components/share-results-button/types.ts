/**
 * Represents a single result item in the voting results
 */
export interface ResultItem {
  /** Country code (ISO 2-letter code) */
  country: string;
  /** Total score for this country */
  score: number;
  /** Array of individual votes for this country */
  votes: Array<{
    participantId: string;
    username: string;
    rank: number;
    points: number;
  }>;
}

/**
 * Component prop interface for ShareResultsButton
 */
export interface Prop {
  /** Array of result items to share */
  results: ResultItem[];
  /** Session ID to include in the share link */
  sessionId: string;
  /** Whether the share button should be enabled */
  isEnabled: boolean;
  /** Number of participants who voted */
  participantCount: number;
}

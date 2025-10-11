/**
 * Component prop interface for ResultsDisplay
 */
export interface Prop {
  /** The unique identifier for the voting session */
  sessionId: string;
  /** Whether the current user is the session creator */
  isCreator: boolean;
  /** The username of the current user */
  username: string;
}

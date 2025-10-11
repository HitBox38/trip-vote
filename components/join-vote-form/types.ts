/**
 * Component prop interface for JoinVoteForm
 */
export interface Prop {
  /** The unique identifier for the voting session */
  sessionId: string;
  /** Optional default name from saved cookie */
  defaultName?: string;
}

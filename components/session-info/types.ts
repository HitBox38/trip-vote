/**
 * Component prop interface for SessionInfo
 */
export interface Prop {
  /** The unique identifier for the voting session */
  sessionId: string;
  /** Optional participant ID if user has already joined */
  participantId?: string;
  /** Optional default name from saved cookie */
  defaultName?: string;
}

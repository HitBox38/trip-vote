/**
 * Component prop interface for VotingInterface
 */
export interface Prop {
  /** The unique identifier for the voting session */
  sessionId: string;
  /** The unique identifier for the participant */
  participantId: string;
  /** Optional creator ID if the participant is the creator */
  creatorId?: string;
}

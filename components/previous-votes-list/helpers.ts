/**
 * Formats a timestamp into a human-readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Creates a map of session IDs to participation status
 * @param votedSessions - Array of sessions where user voted
 * @param joinedSessions - Array of sessions where user joined but not voted
 * @returns Map of session IDs to participation status
 */
export function createSessionStatusMap(
  votedSessions: { sessionId: string; participantId: string }[],
  joinedSessions: { sessionId: string; participantId: string }[]
): Map<string, { voted: boolean; participantId: string }> {
  const map = new Map<string, { voted: boolean; participantId: string }>();

  votedSessions.forEach(({ sessionId, participantId }) => {
    map.set(sessionId, { voted: true, participantId });
  });

  joinedSessions.forEach(({ sessionId, participantId }) => {
    if (!map.has(sessionId)) {
      map.set(sessionId, { voted: false, participantId });
    }
  });

  return map;
}

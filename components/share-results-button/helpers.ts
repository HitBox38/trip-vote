import { getCountryName } from "@/lib/countries";
import { ResultItem } from "./types";

/**
 * Formats voting results into a shareable text format
 * @param results - Array of result items to format
 * @param participantCount - Number of participants who voted
 * @param sessionId - Session ID to include in the share link
 * @returns Formatted text string ready for sharing
 */
export function formatResults(
  results: ResultItem[],
  participantCount: number,
  sessionId: string
): string {
  const lines = [
    "🗳️ Trip Vote Results",
    "",
    `${participantCount} participant${participantCount !== 1 ? "s" : ""} voted`,
    "",
    "🏆 Top Destinations:",
  ];

  // Add top 3 with medals
  const medals = ["🥇", "🥈", "🥉"];
  results.slice(0, 3).forEach((result, index) => {
    lines.push(`${medals[index]} ${getCountryName(result.country)} - ${result.score} pts`);
  });

  // Add remaining results
  if (results.length > 3) {
    lines.push("");
    lines.push("Other destinations:");
    results.slice(3).forEach((result, index) => {
      lines.push(`${index + 4}. ${getCountryName(result.country)} - ${result.score} pts`);
    });
  }

  lines.push("");
  lines.push(`Vote your next trip: ${window.location.origin}/vote/${sessionId}`);

  return lines.join("\n");
}

/**
 * Checks if the current device is a mobile device
 * @returns True if the device is mobile, false otherwise
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

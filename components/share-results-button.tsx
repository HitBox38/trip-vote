"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { getCountryName } from "@/lib/countries";
import { toast } from "sonner";

interface ResultItem {
  country: string;
  score: number;
  votes: Array<{
    participantId: string;
    username: string;
    rank: number;
    points: number;
  }>;
}

interface ShareResultsButtonProps {
  results: ResultItem[];
  sessionId: string;
  isEnabled: boolean;
  participantCount: number;
}

export function ShareResultsButton({
  results,
  sessionId,
  isEnabled,
  participantCount,
}: ShareResultsButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const formatResults = () => {
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
  };

  // Check if device is mobile
  const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const handleShare = async () => {
    const text = formatResults();

    // Mobile: use share API
    if (isMobile() && navigator.share) {
      const shareData = {
        title: "Trip Vote Results",
        text,
      };

      try {
        setIsSharing(true);
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          toast.error("Failed to share results");
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Desktop: always copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Results copied to clipboard!", {
          description: "Share them with your group",
        });
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy results");
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={!isEnabled || isSharing}
      variant="outline"
      className="gap-2">
      {isMobile() ? (
        <>
          <Share2 className="w-4 h-4" />
          Share Results
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Results
        </>
      )}
    </Button>
  );
}

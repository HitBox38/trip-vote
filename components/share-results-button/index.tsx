"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Prop } from "./types";
import { formatResults, isMobile } from "./helpers";

/**
 * Button component for sharing or copying voting results
 * @param results - Array of result items to share
 * @param sessionId - Session ID to include in the share link
 * @param isEnabled - Whether the share button should be enabled
 * @param participantCount - Number of participants who voted
 */
export function ShareResultsButton({ results, sessionId, isEnabled, participantCount }: Prop) {
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Handles the share/copy action
   */
  const handleShare = async () => {
    const text = formatResults(results, participantCount, sessionId);

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

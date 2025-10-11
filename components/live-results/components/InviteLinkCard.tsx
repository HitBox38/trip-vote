import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Copy, Check } from "lucide-react";
import { copyToClipboard } from "../helpers";

interface Prop {
  /** Invite URL for the session */
  inviteUrl: string;
}

/**
 * Card component displaying the session invite link
 * @param inviteUrl - Invite URL for the session
 */
export function InviteLinkCard({ inviteUrl }: Prop) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(inviteUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Invite Link
        </CardTitle>
        <CardDescription>Share this link with others to join the voting session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md font-mono"
          />
          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            size="icon"
            className="shrink-0">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

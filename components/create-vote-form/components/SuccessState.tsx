import { useState } from "react";
import { useActionState } from "react";
import { joinVoteAsCreator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, User } from "lucide-react";

interface Prop {
  /** Session ID that was created */
  sessionId: string;
  /** Creator ID */
  creatorId: string;
}

/**
 * Component displaying success state after vote creation
 * @param sessionId - Session ID that was created
 * @param creatorId - Creator ID
 */
export function SuccessState({ sessionId, creatorId }: Prop) {
  const [joinState, joinFormAction, isJoinPending] = useActionState(joinVoteAsCreator, null);
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/vote/${sessionId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          Vote Session Created!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
          Share this link with participants to join:
        </p>
        <div className="flex gap-2">
          <Input readOnly value={inviteLink} className="text-sm bg-white dark:bg-gray-800" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Join & Vote</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
          Enter your name to join the session and cast your vote:
        </p>

        <form action={joinFormAction} className="space-y-4">
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="creatorId" value={creatorId} />

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Your Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your name"
                required
                minLength={2}
                maxLength={20}
                className="pl-10"
                aria-describedby={joinState?.errors?.username ? "username-error" : undefined}
              />
            </div>
            {joinState?.errors?.username && (
              <p id="username-error" className="text-sm text-red-600 dark:text-red-400">
                {joinState.errors.username[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isJoinPending}>
            {isJoinPending ? "Joining..." : "Join & Start Voting"}
          </Button>
        </form>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => window.location.reload()}>
        Create Another Vote
      </Button>
    </div>
  );
}

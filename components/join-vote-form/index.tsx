"use client";

import { useActionState } from "react";
import { joinVote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { Prop } from "./types";

/**
 * Form component for joining an existing vote session
 * @param sessionId - The unique identifier for the voting session to join
 * @param defaultName - Default name from saved cookie
 */
export function JoinVoteForm({ sessionId, defaultName = "" }: Prop) {
  const [state, formAction, isPending] = useActionState(joinVote, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sessionId" value={sessionId} />

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
            defaultValue={defaultName}
            required
            minLength={2}
            maxLength={20}
            className="pl-10"
            aria-describedby={state?.errors?.username ? "username-error" : undefined}
          />
        </div>
        {state?.errors?.username && (
          <p id="username-error" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.username[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Joining..." : "Join & Start Voting"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState, useEffect } from "react";
import { createVote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check, ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  maxParticipants: z
    .number()
    .min(2, "At least 2 participants required")
    .max(20, "Maximum 20 participants"),
  originCountry: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateVoteForm() {
  const [state, formAction, isPending] = useActionState(createVote, null);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxParticipants: 5,
      originCountry: "",
    },
  });

  // Update form errors from server action
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field === "maxParticipants" || field === "originCountry") {
          form.setError(field, { message: messages[0] });
        }
      });
    }
  }, [state?.errors, form]);

  const handleCopy = async () => {
    if (state?.success && state.sessionId) {
      const inviteLink = `${window.location.origin}/vote/${state.sessionId}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (state?.success && state.sessionId) {
    const inviteLink = `${window.location.origin}/vote/${state.sessionId}`;
    const creatorLink = `/vote/${state.sessionId}?creator=${state.creatorId}`;

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

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href={creatorLink}>
              Go to Session
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}>
            Create Another Vote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Participants</FormLabel>
              <FormControl>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <Input
                    type="number"
                    min={2}
                    max={20}
                    className="pl-10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </div>
              </FormControl>
              <FormDescription>Choose between 2-20 participants</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Origin (Optional)</FormLabel>
              <>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "none" ? "" : value);
                  }}
                  defaultValue={field.value || "none"}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <SelectValue placeholder="No restriction - All countries available" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No restriction - All countries available</SelectItem>
                    {[...COUNTRIES]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="originCountry" value={field.value || ""} />
              </>
              <FormDescription>
                If set, voters can only select countries accessible with this passport (visa-free,
                visa-on-arrival, or e-visa)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Vote Session"}
        </Button>
      </form>
    </Form>
  );
}

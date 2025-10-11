"use client";

import { useActionState, useEffect, useState } from "react";
import { createVote, joinVoteAsCreator } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check, MapPin, User, ChevronsUpDown } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  const [joinState, joinFormAction, isJoinPending] = useActionState(joinVoteAsCreator, null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

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
            <input type="hidden" name="sessionId" value={state.sessionId} />
            <input type="hidden" name="creatorId" value={state.creatorId} />

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
          render={({ field }) => {
            const sortedCountries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
            const selectedCountry = sortedCountries.find((c) => c.code === field.value);

            return (
              <FormItem className="flex flex-col">
                <FormLabel>Country of Origin (Optional)</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          "w-full justify-between font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>
                            {selectedCountry?.name || "No restriction - All countries available"}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              field.onChange("");
                              setOpen(false);
                            }}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            No restriction - All countries available
                          </CommandItem>
                          {sortedCountries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.name}
                              onSelect={() => {
                                field.onChange(country.code);
                                setOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === country.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="originCountry" value={field.value || ""} />
                <FormDescription>
                  If set, voters can only select countries accessible with this passport (visa-free,
                  visa-on-arrival, or e-visa)
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Vote Session"}
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { useActionState, useEffect } from "react";
import { createVote } from "@/app/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "./types";
import { SuccessState } from "./components/SuccessState";
import { FormFields } from "./components/FormFields";

interface Prop {
  /** Default name from saved cookie */
  defaultName?: string;
}

/**
 * Form component for creating a new voting session
 */
export function CreateVoteForm({ defaultName = "" }: Prop) {
  const [state, formAction, isPending] = useActionState(createVote, null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorName: defaultName,
      maxParticipants: 5,
      originCountry: "",
    },
  });

  // Update form errors from server action
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field === "creatorName" || field === "maxParticipants" || field === "originCountry") {
          form.setError(field, { message: messages[0] });
        }
      });
    }
  }, [state?.errors, form]);

  if (state?.success && state.sessionId) {
    return <SuccessState sessionId={state.sessionId} creatorId={state.creatorId} />;
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormFields control={form.control} isPending={isPending} />
      </form>
    </Form>
  );
}

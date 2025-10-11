import { z } from "zod";

/**
 * Zod schema for validating vote creation form data
 */
export const formSchema = z.object({
  maxParticipants: z
    .number()
    .min(2, "At least 2 participants required")
    .max(20, "Maximum 20 participants"),
  originCountry: z.string().optional(),
});

/**
 * Type representing the form values
 */
export type FormValues = z.infer<typeof formSchema>;

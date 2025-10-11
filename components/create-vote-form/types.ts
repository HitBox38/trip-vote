import { z } from "zod";

/**
 * Zod schema for validating vote creation form data
 */
export const formSchema = z.object({
  creatorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters")
    .optional()
    .or(z.literal("")),
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

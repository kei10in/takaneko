import { z } from "zod/v4";

export const ShowNotes = z
  .object({
    played: z.array(z.string()).optional().default([]),
  })
  .optional()
  .default({ played: [] });

export type ShowNotesDescription = z.input<typeof ShowNotes>;
export type ShowNotes = z.output<typeof ShowNotes>;

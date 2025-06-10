import { z } from "zod";

export const ShowNotesDescription = z.object({
  played: z.array(z.string()).optional(),
});

export type ShowNotesDescription = z.infer<typeof ShowNotesDescription>;

export interface ShowNotes {
  played: string[];
}

export const validateShowNotes = (data: ShowNotesDescription | undefined): ShowNotes => {
  if (!data) {
    return { played: [] };
  }

  return {
    played: data.played ?? [],
  };
};

import { z } from "zod";

export const LinkDescription = z.object({
  text: z.string(),
  url: z.string(),
});

export type LinkDescription = z.infer<typeof LinkDescription>;

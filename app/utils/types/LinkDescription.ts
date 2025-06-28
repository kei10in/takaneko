import { z } from "zod/v4";

export const LinkDescription = z.object({
  text: z.string(),
  url: z.string(),
});

export type LinkDescription = z.infer<typeof LinkDescription>;

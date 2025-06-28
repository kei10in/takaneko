import { z } from "zod/v4";

export const ImageDescription = z.object({
  path: z.string(),
  ref: z.string(),
});

export type ImageDescription = z.infer<typeof ImageDescription>;

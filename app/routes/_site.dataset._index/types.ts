import { z } from "zod/v4";

export const DatasetMeta = z.record(
  z.string(),
  z.object({
    size: z.number(),
  }),
);

export type DatasetMeta = z.infer<typeof DatasetMeta>;

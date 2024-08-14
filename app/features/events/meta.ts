import { z } from "zod";

const EventMeta = z.object({
  summary: z.string(),
  date: z.string(),
  region: z.string().optional(),
  location: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
});

export type EventMeta = z.infer<typeof EventMeta>;

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMeta.safeParse(obj);

  if (r.success) {
    return r.data;
  } else {
    return undefined;
  }
};

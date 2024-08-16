import { z } from "zod";
import { EventTypeEnum } from "./EventType";

const EventMeta = z.object({
  summary: z.string(),
  category: EventTypeEnum,
  date: z.string(),
  region: z.string().optional(),
  location: z.string().optional(),
  link: z.object({ text: z.string(), url: z.string() }).optional(),
  image: z.object({ path: z.string(), ref: z.string() }).optional(),
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

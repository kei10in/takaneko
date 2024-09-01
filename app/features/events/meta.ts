import { z } from "zod";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventType, EventTypeEnum } from "./EventType";

const EventMetaDescriptor = z.object({
  summary: z.string(),
  title: z.string().optional(),
  status: z.literal("CANCELED").optional(),
  category: EventTypeEnum,
  date: z.string(),
  region: z.string().optional(),
  location: z.string().optional(),
  link: z.object({ text: z.string(), url: z.string() }).optional(),
  image: z.object({ path: z.string(), ref: z.string() }).optional(),
});

export type EventMetaDescriptor = z.infer<typeof EventMetaDescriptor>;

export interface EventMeta {
  summary: string;
  title?: string | undefined;
  status?: "CANCELED" | undefined;
  category: EventType;
  date: NaiveDate;
  region?: string | undefined;
  location?: string | undefined;
  link?: { text: string; url: string } | undefined;
  image?: { path: string; ref: string } | undefined;

  descriptor: EventMetaDescriptor;
}

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMetaDescriptor.safeParse(obj);

  if (r.success) {
    const summary = r.data.status == "CANCELED" ? `【中止】${r.data.summary}` : r.data.summary;
    const title =
      r.data.title == undefined
        ? summary
        : r.data.status == "CANCELED"
          ? `【中止】${r.data.title}`
          : r.data.title;
    return {
      ...r.data,
      summary,
      title,
      date: NaiveDate.parseUnsafe(r.data.date),
      descriptor: r.data,
    };
  } else {
    return undefined;
  }
};

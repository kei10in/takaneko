import { z } from "zod";
import { MemberName } from "~/routes/members/members";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { compareEventType, EventType, EventTypeEnum } from "./EventType";

const EventRecap = z.object({
  title: z.string().optional(),
  costume: z.union([z.string(), z.array(z.string())]).optional(),
  setlist: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export type EventRecap = z.infer<typeof EventRecap>;

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
  present: z.array(MemberName).optional(),
  absent: z.array(MemberName).optional(),
  recaps: z.union([EventRecap, z.array(EventRecap)]).optional(),
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
  present?: MemberName[] | undefined;
  absent?: MemberName[] | undefined;
  recaps?: EventRecap[] | undefined;

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
    const recaps = Array.isArray(r.data.recaps)
      ? r.data.recaps
      : r.data.recaps != undefined
        ? [r.data.recaps]
        : undefined;
    return {
      ...r.data,
      summary,
      title,
      date: NaiveDate.parseUnsafe(r.data.date),
      recaps,
      descriptor: r.data,
    };
  } else {
    return undefined;
  }
};

export const compareEventMeta = (a: EventMeta, b: EventMeta): number => {
  const d = a.date.getTimeAsUTC() - b.date.getTimeAsUTC();
  if (d != 0) {
    return d;
  }

  if (a.status != b.status) {
    return a.status === "CANCELED" ? 1 : -1;
  }

  return compareEventType(a.category, b.category);
};

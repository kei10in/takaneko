import { z } from "zod";
import { MemberName, MemberNameOrGroup } from "~/routes/members/members";
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
  // 長くなる場合は `title` を使うことができます。
  summary: z.string(),

  // イベントの完全なタイトルを指定します。
  title: z.string().optional(),

  // ページの説明文を指定します。指定しない場合は自動生成される文言が使われます。
  description: z.string().optional(),

  status: z.union([z.literal("PENDING"), z.literal("CANCELED")]).optional(),
  category: EventTypeEnum,
  date: z.string(),
  region: z.string().optional(),
  location: z.string().optional(),
  link: z.object({ text: z.string(), url: z.string() }).optional(),
  image: z.object({ path: z.string(), ref: z.string() }).optional(),
  present: z.array(MemberNameOrGroup).optional(),
  absent: z.array(MemberName).optional(),
  recaps: z.union([EventRecap, z.array(EventRecap)]).optional(),
  updatedAt: z.string().optional(),
});

export type EventMetaDescriptor = z.infer<typeof EventMetaDescriptor>;

export interface EventMeta {
  summary: string;
  title?: string | undefined;
  description?: string | undefined;
  status?: "PENDING" | "CANCELED" | undefined;
  category: EventType;
  date: NaiveDate;
  region?: string | undefined;
  location?: string | undefined;
  link?: { text: string; url: string } | undefined;
  image?: { path: string; ref: string } | undefined;
  present?: MemberNameOrGroup[] | undefined;
  absent?: MemberName[] | undefined;
  recaps?: EventRecap[] | undefined;
  updatedAt?: string | undefined;

  descriptor: EventMetaDescriptor;
}

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMetaDescriptor.safeParse(obj);

  if (r.success) {
    const summary =
      r.data.status == "CANCELED"
        ? `【中止】${r.data.summary}`
        : r.data.status == "PENDING"
          ? `【延期】${r.data.summary}`
          : r.data.summary;
    const title =
      r.data.title == undefined
        ? summary
        : r.data.status == "CANCELED"
          ? `【中止】${r.data.title}`
          : r.data.status == "PENDING"
            ? `【延期】${r.data.title}`
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
    if (a.status == "PENDING") {
      return 1;
    } else if (b.status == "PENDING") {
      return -1;
    } else {
      return a.status === "CANCELED" ? 1 : -1;
    }
  }

  return compareEventType(a.category, b.category);
};

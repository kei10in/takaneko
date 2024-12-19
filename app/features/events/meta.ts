import { z } from "zod";
import { MemberName, MemberNameOrGroup } from "~/routes/members/members";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { compareEventType, EventTypeEnum } from "./EventType";

const EventOverview = z.object({
  // チケット販売サイトの URL を指定します。
  ticket: z.string().optional(),

  timeSlot: z.tuple([z.string(), z.string()]).optional(),
  timetable: ImageDescription.optional(),
  goods: z
    .object({
      time: z.tuple([z.string(), z.string()]),
      lineup: z.string(),
      url: z.string(),
    })
    .optional(),
  streaming: LinkDescription.optional(),
});

export type EventOverview = z.infer<typeof EventOverview>;

const EventRecap = z.object({
  title: z.string().optional(),
  costume: z.union([z.string(), z.array(z.string())]).optional(),
  setlist: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export type EventRecap = z.infer<typeof EventRecap>;

const EventStatus = z.union([
  z.literal("RESCHEDULED"),
  z.literal("CANCELED"),
  z.literal("WITHDRAWN"),
]);

export type EventStatus = z.infer<typeof EventStatus>;

const EventMetaDescriptor = z.object({
  // 長くなる場合は `title` を使うことができます。
  summary: z.string(),

  // イベントの完全なタイトルを指定します。
  title: z.string().optional(),

  // ページの説明文を指定します。指定しない場合は自動生成される文言が使われます。
  description: z.string().optional(),

  status: EventStatus.optional(),
  category: EventTypeEnum,
  date: z.string(),
  open: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  region: z.string().optional(),
  location: z.string().optional(),
  link: z.object({ text: z.string(), url: z.string() }).optional(),
  links: z.array(LinkDescription).optional(),
  image: ImageDescription.optional(),
  images: z.array(ImageDescription).optional(),
  present: z.array(MemberNameOrGroup).optional(),
  absent: z.array(MemberName).optional(),

  overview: EventOverview.optional(),
  recaps: z.union([EventRecap, z.array(EventRecap)]).optional(),
  updatedAt: z.string().optional(),
});

export type EventMetaDescriptor = z.infer<typeof EventMetaDescriptor>;

export type EventMeta = Omit<EventMetaDescriptor, "date" | "recaps" | "images" | "links"> & {
  date: NaiveDate;
  images: ImageDescription[];
  links: LinkDescription[];
  recaps: EventRecap[];
  descriptor: EventMetaDescriptor;
};

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMetaDescriptor.safeParse(obj);

  if (r.success) {
    const status = r.data.status != undefined ? prefixOfEventStatus(r.data.status) : undefined;

    const summary = `${prefixOfEventStatus(r.data.status)}${r.data.summary}`;
    const title =
      r.data.title == undefined ? summary : `${prefixOfEventStatus(r.data.status)}${r.data.title}`;

    const recaps = Array.isArray(r.data.recaps)
      ? r.data.recaps
      : r.data.recaps != undefined
        ? [r.data.recaps]
        : [];
    return {
      ...r.data,
      summary,
      title,
      date: NaiveDate.parseUnsafe(r.data.date),
      images: [r.data.image, ...(r.data.images ?? [])].filter(
        (img): img is ImageDescription => img != undefined && img.path != "",
      ),
      links: r.data.links ?? [],
      recaps,
      descriptor: r.data,
    };
  } else {
    return undefined;
  }
};

const prefixOfEventStatus = (status: EventStatus | undefined): string => {
  switch (status) {
    case "RESCHEDULED":
      return "【延期】 ";
    case "CANCELED":
      return "【中止】 ";
    case "WITHDRAWN":
      return "【辞退】 ";
    default:
      return "";
  }
};

export const compareEventMeta = (a: EventMeta, b: EventMeta): number => {
  const d = a.date.getTimeAsUTC() - b.date.getTimeAsUTC();
  if (d != 0) {
    return d;
  }

  // キャンセルされてるのは時間を無視して後ろに。
  const s = compareEventStatus(a.status, b.status);
  if (s != 0) {
    return s;
  }

  const t = (a.start ?? "00:00").localeCompare(b.start ?? "00:00");
  if (t != 0) {
    return t;
  }

  return compareEventType(a.category, b.category);
};

const compareEventStatus = (a: EventStatus | undefined, b: EventStatus | undefined): number => {
  const order = [undefined, "RESCHEDULED", "WITHDRAWN", "CANCELED"];
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);

  return ai - bi;
};

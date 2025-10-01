import { z } from "zod/v4";

import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { MemberIdEnum, MemberIdOrGroupId } from "../profile/types";
import { Act, ActDescription, validateActDescription } from "./act";
import { compareEventType, EventTypeEnum, LiveTypeEnum } from "./EventType";
import { normalizeLink } from "./normalizeLink";
import { ShowNotes, ShowNotesDescription, validateShowNotes } from "./showNotes";

const EventOverview = z.object({
  // チケット販売サイトの URL を指定します。
  ticket: z.string().optional(),
  timetable: ImageDescription.optional(),
  goods: z
    .object({
      time: z.union([z.tuple([z.string()]), z.tuple([z.string(), z.string()])]).optional(),
      lineup: z.array(z.string()).optional(),
      url: z.string().optional(),
    })
    .optional(),
  streaming: z.union([LinkDescription, z.array(LinkDescription)]).optional(),
});

export type EventOverview = z.infer<typeof EventOverview>;

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
  liveType: LiveTypeEnum.optional(),
  date: z.string(),
  open: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  region: z.string().optional(),
  location: z.string().optional(),
  link: z.object({ text: z.string(), url: z.string() }).optional(),
  links: z.array(z.union([LinkDescription, z.string()])).optional(),
  image: ImageDescription.optional(),
  images: z.array(ImageDescription).optional(),
  present: z.array(MemberIdOrGroupId).optional(),
  absent: z.array(MemberIdEnum).optional(),

  overview: EventOverview.optional(),
  acts: z.union([ActDescription, z.array(ActDescription)]).optional(),
  showNotes: ShowNotesDescription.optional(),
  updatedAt: z.string().optional(),
});

export type EventMetaDescriptor = z.infer<typeof EventMetaDescriptor>;

export type EventMeta = Omit<
  EventMetaDescriptor,
  "date" | "acts" | "showNotes" | "images" | "links"
> & {
  date: NaiveDate;
  images: ImageDescription[];
  links: LinkDescription[];
  streamings: LinkDescription[];
  overview?: Omit<EventOverview, "streaming"> | undefined;
  acts: Act[];
  showNotes: ShowNotes;
  descriptor: EventMetaDescriptor;
};

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMetaDescriptor.safeParse(obj);

  if (r.success) {
    const statusPrefix = prefixOfEventStatus(r.data.status);

    const summary = `${statusPrefix}${r.data.summary}`;
    const title = r.data.title == undefined ? summary : `${statusPrefix}${r.data.title}`;

    const streaming =
      r.data.overview?.streaming == undefined
        ? []
        : Array.isArray(r.data.overview.streaming)
          ? r.data.overview.streaming
          : [r.data.overview.streaming];

    const actDescriptions = Array.isArray(r.data.acts)
      ? r.data.acts
      : r.data.acts != undefined
        ? [r.data.acts]
        : [];

    const acts = validateActDescription(actDescriptions);

    const showNotes = validateShowNotes(r.data.showNotes);

    return {
      ...r.data,
      summary,
      title,
      date: NaiveDate.parseUnsafe(r.data.date),
      images: [r.data.image, ...(r.data.images ?? [])].filter(
        (img): img is ImageDescription => img != undefined && img.path != "",
      ),
      // link の URL が空文字列の場合は無視します。
      // この時点で link が妥当であることを検証しておくことで他のところで検証しなくていいようにします。
      link: r.data.link?.url == "" ? undefined : r.data.link,
      links: (r.data.links ?? [])
        .map((link) => normalizeLink(link))
        .filter(
          (link): link is LinkDescription => link != undefined && link.text != "" && link.url != "",
        ),
      streamings: streaming,
      acts,
      showNotes,
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

  const t = (a.start ?? "24:00").localeCompare(b.start ?? "24:00");
  if (t != 0) {
    return t;
  }

  return compareEventType(a.category, b.category);
};

export const compareEventStatus = (
  a: EventStatus | undefined,
  b: EventStatus | undefined,
): number => {
  const order = [undefined, "RESCHEDULED", "WITHDRAWN", "CANCELED"];
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);

  return ai - bi;
};

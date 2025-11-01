import { z } from "zod/v4";

import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { MemberIdEnum, MemberIdOrGroupId } from "../profile/types";
import { Act, isEmptyAct } from "./act";
import { compareEventType, EventTypeEnum, LiveTypeEnum } from "./EventType";
import { normalizeLink } from "./normalizeLink";
import { ShowNotes } from "./showNotes";

const EventOverview = z.object({
  timetable: ImageDescription.optional(),
  goods: z
    .object({
      time: z.union([z.tuple([z.string()]), z.tuple([z.string(), z.string()])]).optional(),
      lineup: z.array(z.string()).optional(),
      url: z.string().optional(),
    })
    .optional(),
});

export type EventOverviewDescriptor = z.input<typeof EventOverview>;
export type EventOverview = z.output<typeof EventOverview>;

const EventStatus = z.union([
  z.literal("RESCHEDULED"),
  z.literal("CANCELED"),
  z.literal("WITHDRAWN"),
]);

export type EventStatus = z.infer<typeof EventStatus>;

const EventMeta = z
  .object({
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
    link: z
      .object({ text: z.string(), url: z.string() })
      .optional()
      .transform((link) =>
        // link の URL が空文字列の場合は無視します。
        // この時点で link が妥当であることを検証しておくことで他のところで検証しなくていいようにします。
        link?.url == "" ? undefined : link,
      ),
    links: z
      .array(z.union([LinkDescription, z.string()]))
      .transform((x) =>
        x.map(normalizeLink).filter((link): link is LinkDescription => {
          return link != undefined && link.text != "" && link.url != "";
        }),
      )
      .optional()
      .default([]),
    images: z
      .array(ImageDescription.extend({ tags: z.array(z.string()).optional().default([]) }))
      .transform((x) => x.filter((img) => img.path != ""))
      .optional()
      .default([]),
    present: z.array(MemberIdOrGroupId).optional(),
    absent: z.array(MemberIdEnum).optional(),

    // チケット販売サイトの URL を指定します。
    ticket: z.string().optional(),
    streamings: z
      .union([LinkDescription, z.array(LinkDescription)])
      .transform((x) => (Array.isArray(x) ? x : [x]).filter((x) => x.url != ""))
      .optional()
      .default([]),

    overview: EventOverview.optional(),
    acts: z
      .union([Act, z.array(Act)])
      .transform((x) => (Array.isArray(x) ? x : [x]).filter((act) => !isEmptyAct(act)))
      .optional()
      .default([]),
    showNotes: ShowNotes,
    updatedAt: z.string().optional(),
  })
  .transform((data) => {
    const timetables = [];
    timetables.push(...data.images.filter((img) => img.tags.includes("timetable")));
    if (timetables.length === 0 && data.overview?.timetable) {
      timetables.push(data.overview.timetable);
    }

    return {
      ...data,
      summary: prependStatus(data.status, data.summary),
      title: prependStatus(data.status, data.title ?? data.summary),
      timetables,
    };
  });

export type EventMetaDescriptor = z.input<typeof EventMeta>;
export type EventMeta = z.output<typeof EventMeta>;

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMeta.safeParse(obj);
  return r.data;
};

const prependStatus = (status: EventStatus | undefined, text: string): string => {
  const statusText = prefixOfEventStatus(status);
  return `${statusText}${text}`;
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
  const d = a.date.localeCompare(b.date);
  if (d != 0) {
    return d;
  }

  // キャンセルされてるのは時間を無視して後ろに。
  const s = compareEventStatus(a.status, b.status);
  if (s != 0) {
    return s;
  }

  const aStart = a.acts[0]?.start ?? a.start ?? "48:00";
  const bStart = b.acts[0]?.start ?? b.start ?? "48:00";

  const t = aStart.localeCompare(bStart);
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

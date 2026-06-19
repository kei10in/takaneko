import { z } from "zod/v4";
import { assertNever } from "~/utils/assertNever";

export const EventTypeEnum = z.enum([
  "LIVE", // ソロコンサート・対バンライブ
  "EVENT", // 握手会・撮影会・サイン会など
  "RELEASE_EVENT", // CDリリースイベント
  "STREAMING", // SHOWROOM・YouTube Live など
  "VARIETY", // 単独のバラエティイベント
  "FASHION", // 明確なファッションショーイベントだけに使う。また単独イベントにも使わない。
  "SALES_OPEN", // お話し会の受付など
  "CD",
  "BIRTHDAY",
  "TV",
  "RADIO",
  "WEB",
  "BOOK",
  "MAGAZINE",
  "OTHER",
]);

export const EventType = EventTypeEnum.enum;
export type EventType = z.infer<typeof EventTypeEnum>;

export const compareEventType = (a: EventType, b: EventType): number => {
  const order = [
    EventType.LIVE,
    EventType.EVENT,
    EventType.RELEASE_EVENT,
    EventType.STREAMING,
    EventType.VARIETY,
    EventType.FASHION,
    EventType.SALES_OPEN,
    EventType.CD,
    EventType.BIRTHDAY,
    EventType.TV,
    EventType.RADIO,
    EventType.WEB,
    EventType.BOOK,
    EventType.MAGAZINE,
    EventType.OTHER,
  ];

  return order.indexOf(a) - order.indexOf(b);
};

export const eventTypeToEmoji = (category: EventType): string => {
  switch (category) {
    case EventType.LIVE:
      return "🎤";
    case EventType.EVENT:
      return "🌸";
    case EventType.RELEASE_EVENT:
      return "🚀";
    case EventType.STREAMING:
      return "🎥";
    case EventType.VARIETY:
      return "🎭";
    case EventType.FASHION:
      return "👗";
    case EventType.SALES_OPEN:
      return "📋";
    case EventType.CD:
      return "💿";
    case EventType.BIRTHDAY:
      return "🎂";
    case EventType.TV:
      return "📺";
    case EventType.RADIO:
      return "📻";
    case EventType.WEB:
      return "📱";
    case EventType.BOOK:
      return "📖";
    case EventType.MAGAZINE:
      return "📰";
    case EventType.OTHER:
      return "📅";
    default:
      assertNever(category);
  }
};

export const eventTypeToColor = (category: EventType): string => {
  switch (category) {
    case EventType.LIVE:
      return "bg-nadeshiko-700";
    case EventType.EVENT:
      return "bg-gray-800";
    case EventType.RELEASE_EVENT:
      return "bg-gray-800";
    case EventType.STREAMING:
      return "bg-orange-400";
    case EventType.VARIETY:
      return "bg-purple-400";
    case EventType.FASHION:
      return "bg-pink-400";
    case EventType.SALES_OPEN:
      return "bg-gray-500";
    case EventType.CD:
      return "bg-fuchsia-500";
    case EventType.BIRTHDAY:
      return "bg-red-600";
    case EventType.TV:
      return "bg-sky-500";
    case EventType.RADIO:
      return "bg-sky-500";
    case EventType.WEB:
      return "bg-blue-600";
    case EventType.BOOK:
      return "bg-indigo-400";
    case EventType.MAGAZINE:
      return "bg-indigo-400";
    case EventType.OTHER:
      return "bg-amber-700";
    default:
      assertNever(category);
  }
};

export const LiveTypeEnum = z.enum([
  "SOLO", // ソロライブ
  "HOSTED", // 主催ライブ
  "JOINT", // 対バン・少数組の共同ライブ
  "GUEST", // 他者の単独公演・ツアーへのゲスト出演
  "FESTIVAL", // 音楽・アイドルライブを主目的にしたフェス・サーキット・多数組イベント
  "EVENT_LIVE", // ファッションショーなど、ライブイベント以外の催しでのライブ出演
  "RELEASE_EVENT", // リリースイベント
]);

export const LiveType = LiveTypeEnum.enum;
export type LiveType = z.infer<typeof LiveTypeEnum>;

export const liveTypeColor = (liveType: LiveType | undefined): string => {
  switch (liveType) {
    case LiveType.SOLO:
      return "bg-nadeshiko-700";
    case LiveType.HOSTED:
      return "bg-blue-300";
    case LiveType.JOINT:
      return "bg-amber-300";
    case LiveType.GUEST:
      return "bg-orange-300";
    case LiveType.FESTIVAL:
      return "bg-emerald-400";
    case LiveType.EVENT_LIVE:
      return "bg-cyan-400";
    case LiveType.RELEASE_EVENT:
      return "bg-violet-400";
    default:
      return "bg-gray-300";
  }
};

export const MeetAndGreetTypeEnum = z.enum([
  "握手会",
  "撮影会",
  "TikTok 撮影会",
  "サイン会",
  "団体サイン会",
  "オンライン サイン会",
  "オンライン お話し会",
  "対面お話し会",
  "お渡し会",
]);

export const MeetAndGreetType = MeetAndGreetTypeEnum.enum;
export type MeetAndGreetType = z.infer<typeof MeetAndGreetTypeEnum>;

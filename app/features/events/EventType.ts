import { z } from "zod/v4";
import { assertNever } from "~/utils/assertNever";
import { UiColors } from "~/utils/uiColors";

export const EventTypeEnum = z.enum([
  "LIVE", // ソロコンサート・対バンライブ
  "MEET_AND_GREET", // 握手会・撮影会・サイン会など
  "RELEASE_EVENT", // CDリリースイベント
  "STREAMING", // SHOWROOM・YouTube Live など
  "VARIETY", // 単独のバラエティイベント
  "FASHION", // 明確な外部のファッションショーイベント。単独イベントには使わない。
  "SALES_OPEN", // お話し会の受付など
  "CD",
  "BIRTHDAY",
  "TV",
  "RADIO",
  "ON_DEMAND",
  "BOOK",
  "MAGAZINE",
  "OTHER",
]);

export const EventType = EventTypeEnum.enum;
export type EventType = z.infer<typeof EventTypeEnum>;

export const compareEventType = (a: EventType, b: EventType): number => {
  const order = [
    EventType.LIVE,
    EventType.MEET_AND_GREET,
    EventType.RELEASE_EVENT,
    EventType.STREAMING,
    EventType.VARIETY,
    EventType.FASHION,
    EventType.SALES_OPEN,
    EventType.CD,
    EventType.BIRTHDAY,
    EventType.TV,
    EventType.RADIO,
    EventType.ON_DEMAND,
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
    case EventType.MEET_AND_GREET:
      return "🌸";
    case EventType.RELEASE_EVENT:
      return "🚀";
    case EventType.STREAMING:
      return "🎥";
    case EventType.VARIETY:
      return "✨";
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
    case EventType.ON_DEMAND:
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
    case EventType.MEET_AND_GREET:
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
    case EventType.ON_DEMAND:
      return "bg-sky-500";
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

export const eventTypeColors = (category: EventType): UiColors => {
  switch (category) {
    case EventType.LIVE:
      return {
        text: "text-nadeshiko-800",
        background: "bg-nadeshiko-800",
        border: "border-nadeshiko-800",
      };
    case EventType.MEET_AND_GREET:
      return { text: "text-zinc-600", background: "bg-zinc-800", border: "border-zinc-600" };
    case EventType.RELEASE_EVENT:
      return { text: "text-violet-400", background: "bg-violet-600", border: "border-violet-400" };
    case EventType.STREAMING:
      return { text: "text-amber-500", background: "bg-amber-500", border: "border-amber-500" };
    case EventType.VARIETY:
      return { text: "text-purple-400", background: "bg-purple-400", border: "border-purple-400" };
    case EventType.FASHION:
      return {
        text: "text-nadeshiko-800",
        background: "bg-nadeshiko-800",
        border: "border-nadeshiko-800",
      };
    case EventType.SALES_OPEN:
      return { text: "text-gray-500", background: "bg-gray-500", border: "border-gray-500" };
    case EventType.CD:
      return {
        text: "text-fuchsia-500",
        background: "bg-fuchsia-500",
        border: "border-fuchsia-500",
      };
    case EventType.BIRTHDAY:
      return { text: "text-red-600", background: "bg-red-600", border: "border-red-600" };
    case EventType.TV:
      return { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" };
    case EventType.RADIO:
      return { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" };
    case EventType.ON_DEMAND:
      return { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" };
    case EventType.BOOK:
      return { text: "text-indigo-400", background: "bg-indigo-400", border: "border-indigo-400" };
    case EventType.MAGAZINE:
      return { text: "text-indigo-400", background: "bg-indigo-400", border: "border-indigo-400" };
    case EventType.OTHER:
      return { text: "text-amber-700", background: "bg-amber-700", border: "border-amber-700" };
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

export const liveTypeLabel = (liveType: LiveType | undefined): string => {
  switch (liveType) {
    case "SOLO":
      return "ワンマン";
    case "HOSTED":
      return "主催対バン";
    case "JOINT":
    case "GUEST":
    case "FESTIVAL":
      return "対バン";
    case "EVENT_LIVE":
      return "イベント出演";
    case "RELEASE_EVENT":
      return "リリースイベント";
    default:
      return "不明";
  }
};

export const liveTypeColor = (liveType: LiveType | undefined): string => {
  switch (liveType) {
    case LiveType.SOLO:
      return "bg-nadeshiko-700";
    case LiveType.HOSTED:
      return "bg-blue-300";
    case LiveType.JOINT:
      return "bg-amber-300";
    case LiveType.GUEST:
      return "bg-amber-300";
    case LiveType.FESTIVAL:
      return "bg-amber-400";
    case LiveType.EVENT_LIVE:
      return "bg-amber-400";
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

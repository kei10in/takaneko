import { z } from "zod/v4";
import type { UiColors } from "~/utils/uiColors";

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

type EventTypeMetadata = {
  order: number;
  emoji: string;
  color: string;
  colors: UiColors;
};

export const eventTypeMetadata = {
  [EventType.LIVE]: {
    order: 0,
    emoji: "🎤",
    color: "bg-nadeshiko-700",
    colors: {
      text: "text-nadeshiko-800",
      background: "bg-nadeshiko-800",
      border: "border-nadeshiko-800",
    },
  },
  [EventType.MEET_AND_GREET]: {
    order: 1,
    emoji: "🌸",
    color: "bg-gray-800",
    colors: { text: "text-zinc-600", background: "bg-zinc-800", border: "border-zinc-600" },
  },
  [EventType.RELEASE_EVENT]: {
    order: 2,
    emoji: "🚀",
    color: "bg-gray-800",
    colors: { text: "text-violet-400", background: "bg-violet-600", border: "border-violet-400" },
  },
  [EventType.STREAMING]: {
    order: 3,
    emoji: "🎥",
    color: "bg-orange-400",
    colors: { text: "text-amber-500", background: "bg-amber-500", border: "border-amber-500" },
  },
  [EventType.VARIETY]: {
    order: 4,
    emoji: "✨",
    color: "bg-purple-400",
    colors: { text: "text-purple-400", background: "bg-purple-400", border: "border-purple-400" },
  },
  [EventType.FASHION]: {
    order: 5,
    emoji: "👗",
    color: "bg-pink-400",
    colors: {
      text: "text-nadeshiko-800",
      background: "bg-nadeshiko-800",
      border: "border-nadeshiko-800",
    },
  },
  [EventType.SALES_OPEN]: {
    order: 6,
    emoji: "📋",
    color: "bg-gray-500",
    colors: { text: "text-gray-500", background: "bg-gray-500", border: "border-gray-500" },
  },
  [EventType.CD]: {
    order: 7,
    emoji: "💿",
    color: "bg-fuchsia-500",
    colors: {
      text: "text-fuchsia-500",
      background: "bg-fuchsia-500",
      border: "border-fuchsia-500",
    },
  },
  [EventType.BIRTHDAY]: {
    order: 8,
    emoji: "🎂",
    color: "bg-red-600",
    colors: { text: "text-red-600", background: "bg-red-600", border: "border-red-600" },
  },
  [EventType.TV]: {
    order: 9,
    emoji: "📺",
    color: "bg-sky-500",
    colors: { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" },
  },
  [EventType.RADIO]: {
    order: 10,
    emoji: "📻",
    color: "bg-sky-500",
    colors: { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" },
  },
  [EventType.ON_DEMAND]: {
    order: 11,
    emoji: "📱",
    color: "bg-sky-500",
    colors: { text: "text-blue-400", background: "bg-blue-400", border: "border-blue-400" },
  },
  [EventType.BOOK]: {
    order: 12,
    emoji: "📖",
    color: "bg-indigo-400",
    colors: { text: "text-indigo-400", background: "bg-indigo-400", border: "border-indigo-400" },
  },
  [EventType.MAGAZINE]: {
    order: 13,
    emoji: "📰",
    color: "bg-indigo-400",
    colors: { text: "text-indigo-400", background: "bg-indigo-400", border: "border-indigo-400" },
  },
  [EventType.OTHER]: {
    order: 14,
    emoji: "📅",
    color: "bg-amber-700",
    colors: { text: "text-amber-700", background: "bg-amber-700", border: "border-amber-700" },
  },
} satisfies Record<EventType, EventTypeMetadata>;

export const compareEventType = (a: EventType, b: EventType): number =>
  eventTypeMetadata[a].order - eventTypeMetadata[b].order;

export const eventTypeToEmoji = (category: EventType): string => eventTypeMetadata[category].emoji;

export const eventTypeToColor = (category: EventType): string => eventTypeMetadata[category].color;

export const eventTypeColors = (category: EventType): UiColors =>
  eventTypeMetadata[category].colors;

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

import { z } from "zod/v4";

export const EventTypeEnum = z.enum([
  "LIVE", // ソロコンサート・対バンライブ
  "EVENT", // 握手会・撮影会・サイン会など
  "STREAMING", // SHOWROOM・YouTube Live など
  "RELEASE",
  "BIRTHDAY",
  "TV",
  "RADIO",
  "WEB",
  "MAGAZINE",
  "OTHER",
]);

export const EventType = EventTypeEnum.enum;
export type EventType = z.infer<typeof EventTypeEnum>;

export const compareEventType = (a: EventType, b: EventType): number => {
  const order = [
    EventType.LIVE,
    EventType.EVENT,
    EventType.STREAMING,
    EventType.RELEASE,
    EventType.BIRTHDAY,
    EventType.TV,
    EventType.RADIO,
    EventType.WEB,
    EventType.MAGAZINE,
    EventType.OTHER,
  ];

  return order.indexOf(a) - order.indexOf(b);
};

export const categoryToEmoji = (category: EventType): string => {
  switch (category) {
    case EventType.LIVE:
      return "🎤";
    case EventType.EVENT:
      return "🐈‍⬛";
    case EventType.STREAMING:
      return "🎥";
    case EventType.RELEASE:
      return "💿";
    case EventType.BIRTHDAY:
      return "🎂";
    case EventType.TV:
      return "📺";
    case EventType.RADIO:
      return "📻";
    case EventType.WEB:
      return "📱";
    case EventType.MAGAZINE:
      return "📰";
    case EventType.OTHER:
      return "📅";
  }
};

export const categoryToColor = (category: EventType): string => {
  switch (category) {
    case EventType.LIVE:
      return "bg-zinc-500";
    case EventType.EVENT:
      return "bg-pink-400";
    case EventType.STREAMING:
      return "bg-orange-400";
    case EventType.RELEASE:
      return "bg-fuchsia-500";
    case EventType.BIRTHDAY:
      return "bg-red-600";
    case EventType.TV:
      return "bg-emerald-400";
    case EventType.RADIO:
      return "bg-sky-400";
    case EventType.WEB:
      return "bg-blue-600";
    case EventType.MAGAZINE:
      return "bg-indigo-400";
    case EventType.OTHER:
      return "bg-amber-900";
  }
};

export const parseCategory = (category: string | null): EventType | undefined => {
  if (category == undefined) {
    return undefined;
  }

  switch (category.toLowerCase()) {
    case "live":
      return EventType.LIVE;
    case "event":
      return EventType.EVENT;
    case "streaming":
      return EventType.STREAMING;
    case "release":
      return EventType.RELEASE;
    case "birthday":
      return EventType.BIRTHDAY;
    case "tv":
      return EventType.TV;
    case "radio":
      return EventType.RADIO;
    case "web":
      return EventType.WEB;
    case "magazine":
      return EventType.MAGAZINE;
    case "other":
      return EventType.OTHER;
    default:
      return undefined;
  }
};

export const LiveTypeEnum = z.enum([
  "SOLO", // ソロライブ
  "HOSTED", // 主催ライブ
  "GUEST", // ゲスト出演
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
    case LiveType.GUEST:
      return "bg-amber-300";
    case LiveType.RELEASE_EVENT:
      return "bg-violet-400";
    default:
      return "bg-gray-300";
  }
};

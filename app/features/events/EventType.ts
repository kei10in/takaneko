import { z } from "zod";

export const EventTypeEnum = z.enum([
  "LIVE",
  "EVENT",
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
    case EventType.RELEASE:
      return "bg-fuchsia-500";
    case EventType.BIRTHDAY:
      return "bg-red-600";
    case EventType.TV:
      return "bg-emerald-400";
    case EventType.RADIO:
      return "bg-sky-400";
    case EventType.WEB:
      return "bg-orange-400";
    case EventType.MAGAZINE:
      return "bg-ember-400";
    case EventType.OTHER:
      return "bg-amber-900";
  }
};

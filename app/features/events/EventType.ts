import { z } from "zod";

export const EventTypeEnum = z.enum([
  "LIVE",
  "EVENT",
  "RELEASE",
  "BIRTHDAY",
  "TV",
  "RADIO",
  "MAGAZINE",
  "OTHER",
]);

export const EventType = EventTypeEnum.enum;
export type EventType = z.infer<typeof EventTypeEnum>;

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
    case EventType.MAGAZINE:
      return "📰";
    case EventType.OTHER:
      return "📅";
  }
};

export const categoryToColor = (category: EventType): string => {
  switch (category) {
    case EventType.LIVE:
      return "bg-emerald-500";
    case EventType.EVENT:
      return "bg-zinc-800";
    case EventType.RELEASE:
      return "bg-fuchsia-500";
    case EventType.BIRTHDAY:
      return "bg-red-600";
    case EventType.TV:
      return "bg-sky-600";
    case EventType.RADIO:
      return "bg-sky-400";
    case EventType.MAGAZINE:
      return "bg-ember-400";
    case EventType.OTHER:
      return "bg-pink-300";
  }
};

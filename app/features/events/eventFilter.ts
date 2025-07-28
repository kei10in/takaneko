import { z } from "zod/v4";
import { EventType } from "./EventType";
import { EventModule } from "./eventModule";

export const EventFilterTypeEnum = z.enum([
  "all",
  "live",
  "event",
  "streaming",
  "tv",
  "radio",
  "web",
  "birthday",
  "release",
  "other",
]);

export const EventFilterType = EventFilterTypeEnum.enum;
export type EventFilterType = z.infer<typeof EventFilterTypeEnum>;

export interface EventFilter {
  display: string;
  name: EventFilterType;
  predicate: (event: EventModule) => boolean;
}

export const EventFilters: EventFilter[] = [
  {
    display: "すべて",
    name: "all",
    predicate: () => true,
  },
  {
    display: "ライブ",
    name: "live",
    predicate: (event) => event.meta.category === EventType.LIVE,
  },
  {
    display: "イベント",
    name: "event",
    predicate: (event) => event.meta.category === EventType.EVENT,
  },
  {
    display: "生配信",
    name: "streaming",
    predicate: (event) => event.meta.category === EventType.STREAMING,
  },
  {
    display: "テレビ",
    name: "tv",
    predicate: (event) => event.meta.category === EventType.TV,
  },
  {
    display: "ラジオ",
    name: "radio",
    predicate: (event) => event.meta.category === EventType.RADIO,
  },
  {
    display: "Web",
    name: "web",
    predicate: (event) => event.meta.category === EventType.WEB,
  },
  {
    display: "誕生日",
    name: "birthday",
    predicate: (event) => event.meta.category === EventType.BIRTHDAY,
  },
  {
    display: "発売日",
    name: "release",
    predicate: (event) =>
      event.meta.category == EventType.RELEASE ||
      event.meta.category == EventType.BOOK ||
      event.meta.category == EventType.MAGAZINE,
  },
  {
    display: "その他",
    name: "other",
    predicate: (event) => event.meta.category === EventType.OTHER,
  },
] as const;

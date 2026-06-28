import { z } from "zod/v4";
import { EventType } from "./EventType";
import { EventModule } from "./eventModule";

export const EventFilterTypeEnum = z.enum([
  "all",
  "live",
  "event",
  "release-event",
  "streaming",
  "tv",
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
    predicate: (event) =>
      event.meta.category === EventType.LIVE || event.meta.liveType != undefined,
  },
  {
    display: "イベント",
    name: "event",
    predicate: (event) =>
      event.meta.category === EventType.MEET_AND_GREET ||
      event.meta.category == EventType.VARIETY ||
      event.meta.category == EventType.FASHION,
  },
  {
    display: "リリース イベント",
    name: "release-event",
    predicate: (event) => event.meta.category == EventType.RELEASE_EVENT,
  },
  {
    display: "配信",
    name: "streaming",
    predicate: (event) => event.meta.category === EventType.STREAMING,
  },
  {
    display: "TV・ラジオ",
    name: "tv",
    predicate: (event) =>
      event.meta.category === EventType.TV ||
      event.meta.category === EventType.RADIO ||
      event.meta.category === EventType.ON_DEMAND,
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
      event.meta.category == EventType.CD ||
      event.meta.category == EventType.BOOK ||
      event.meta.category == EventType.MAGAZINE,
  },
  {
    display: "その他",
    name: "other",
    predicate: (event) => event.meta.category === EventType.OTHER,
  },
] as const;

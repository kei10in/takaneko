import { z } from "zod";

export const EventTypeEnum = z.enum([
  "LIVE",
  "RELEASE",
  "BIRTHDAY",
  "TV",
  "RADIO",
  "MAGAZINE",
  "WEB",
  "OTHER",
]);

export const EventType = EventTypeEnum.enum;
export type EventType = z.infer<typeof EventTypeEnum>;

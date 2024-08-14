import { z } from "zod";
import { CalendarEvent, EventType } from "~/components/calendar/event";
import { EventModule } from "./events";

const EventMeta = z.object({
  summary: z.string(),
  date: z.string(),
  region: z.string().optional(),
  location: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
});

export type EventMeta = z.infer<typeof EventMeta>;

export const validateEventMeta = (obj: unknown): EventMeta | undefined => {
  const r = EventMeta.safeParse(obj);

  if (r.success) {
    return r.data;
  } else {
    return undefined;
  }
};

export const convertEventModuleToCalendarEvent = (event: EventModule): CalendarEvent => {
  return {
    id: event.id,
    category: EventType.LIVE,
    summary: event.meta.summary,
    date: Date.parse(event.meta.date),
    location: event.meta.location,
    region: event.meta.region,
  };
};

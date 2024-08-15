import { EventType } from "~/features/events/EventType";
import { EventModule } from "../events/events";

export interface CalendarEvent {
  id: string;
  category: EventType;
  summary: string;
  date: number;
  region?: string;
  location?: string;
}

export const groupEventsByDate = (events: CalendarEvent[]): Map<number, CalendarEvent[]> => {
  const map = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const date = new Date(event.date);
    const key = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(event);
  }
  return map;
};

export const convertEventModuleToCalendarEvent = (event: EventModule): CalendarEvent => {
  return {
    id: event.id,
    category: event.meta.category,
    summary: event.meta.summary,
    date: Date.parse(event.meta.date),
    location: event.meta.location,
    region: event.meta.region,
  };
};

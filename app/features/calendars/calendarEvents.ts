import { compareEventType, EventType } from "~/features/events/EventType";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventModule } from "../events/events";

export interface CalendarEvent {
  id: string;
  category: EventType;
  summary: string;
  date: NaiveDate;
  region?: string;
  location?: string;
  link?: { text: string; url: string };
  image?: { path: string; ref: string };
}

/**
 * Zip calendar dates and events.
 */
export const zipCalendarDatesAndEvents = (
  dates: NaiveDate[][],
  events: CalendarEvent[],
): { date: NaiveDate; events: CalendarEvent[] }[][] => {
  const groupedEvents = groupEventsByDate(events);

  return dates.map((week) =>
    week.map((date) => {
      const utcDate = date.getTimeAsUTC();
      const eventsInDate = sortedCalendarEventsByCategory(groupedEvents.get(utcDate) ?? []);
      return { date, events: eventsInDate };
    }),
  );
};

/**
 * Group events by date.
 */
export const groupEventsByDate = (events: CalendarEvent[]): Map<number, CalendarEvent[]> => {
  const map = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const key = event.date.getTimeAsUTC();
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
    date: NaiveDate.parseUnsafe(event.meta.date),
    location: event.meta.location,
    region: event.meta.region,
    link: event.meta.link,
    image: event.meta.image,
  };
};

export const sortedCalendarEventsByCategory = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.toSorted((a, b) => {
    return compareEventType(a.category, b.category);
  });
};

export const uniqueEventRegions = (events: CalendarEvent[]): string[] => {
  const regions = events
    .filter((event) => event.region != undefined)
    .map((event) => event.region ?? "");

  const result: string[] = [];

  for (const region of regions) {
    if (!result.includes(region)) {
      result.push(region);
    }
  }

  return result;
};

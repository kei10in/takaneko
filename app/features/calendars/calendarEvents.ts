import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { compareEventStatus, EventStatus } from "../events/eventMeta";
import { EventModule } from "../events/eventModule";
import { compareEventType, EventType } from "../events/EventType";

export type CalendarEvent = {
  slug: string;
  date: string;
  start: string | undefined;
  summary: string;
  status: EventStatus | undefined;
  category: EventType;
  region: string | undefined;
  location: string | undefined;
};

export const calendarEventFromEventModule = (e: EventModule): CalendarEvent => {
  return {
    slug: e.slug,
    date: e.meta.date.toString(),
    start: e.meta.start,
    summary: e.meta.summary,
    status: e.meta.status,
    category: e.meta.category,
    region: e.meta.region,
    location: e.meta.location,
  };
};

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
      const eventsInDate = sortedCalendarEvents(groupedEvents.get(date.toString()) ?? []);
      return { date, events: eventsInDate };
    }),
  );
};

/**
 * Group events by date.
 */
export const groupEventsByDate = (events: CalendarEvent[]): Map<string, CalendarEvent[]> => {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = event.date;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(event);
  }
  return map;
};

export const sortedCalendarEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.toSorted((a, b) => compareCalendarEvents(a, b));
};

export const compareCalendarEvents = (a: CalendarEvent, b: CalendarEvent): number => {
  const d = a.date.localeCompare(b.date);
  if (d != 0) {
    return d;
  }

  // キャンセルされてるのは時間を無視して後ろに。
  const s = compareEventStatus(a.status, b.status);
  if (s != 0) {
    return s;
  }

  const t = (a.start ?? "24:00").localeCompare(b.start ?? "24:00");
  if (t != 0) {
    return t;
  }

  return compareEventType(a.category, b.category);
};

export const uniqueEventRegions = (events: CalendarEvent[]): string[] => {
  const regions = events
    .filter((event) => event.status == undefined)
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

import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventMeta } from "../events/eventMeta";
import { EventModule } from "../events/eventModule";

export type CalendarEvent = {
  slug: string;
} & EventMeta;

export const calendarEventFromEventModule = (e: EventModule): CalendarEvent => {
  return {
    slug: e.slug,
    ...e.meta,
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
      const eventsInDate = groupedEvents.get(date.toString()) ?? [];
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

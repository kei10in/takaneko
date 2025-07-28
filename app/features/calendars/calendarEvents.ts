import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { compareEventMeta } from "../events/eventMeta";
import { EventModule } from "../events/eventModule";

export type CalendarEvent = Omit<EventModule, "Content">;

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
      const eventsInDate = sortedCalendarEvents(groupedEvents.get(utcDate) ?? []);
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
    const key = event.meta.date.getTimeAsUTC();
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(event);
  }
  return map;
};

export const sortedCalendarEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.toSorted((a, b) => compareEventMeta(a.meta, b.meta));
};

export const uniqueEventRegions = (events: CalendarEvent[]): string[] => {
  const regions = events
    .filter((event) => event.meta.status == undefined)
    .filter((event) => event.meta.region != undefined)
    .map((event) => event.meta.region ?? "");

  const result: string[] = [];

  for (const region of regions) {
    if (!result.includes(region)) {
      result.push(region);
    }
  }

  return result;
};

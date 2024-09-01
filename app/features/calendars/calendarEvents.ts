import { compareEventType } from "~/features/events/EventType";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventModule } from "../events/events";
import { EventMeta } from "../events/meta";

export type CalendarEvent = EventMeta & { id: string };

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
    ...event.meta,
  };
};

export const sortedCalendarEventsByCategory = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.toSorted((a, b) => {
    return compareEventType(a.category, b.category);
  });
};

export const uniqueEventRegions = (events: CalendarEvent[]): string[] => {
  const regions = events
    .filter((events) => events.status != "CANCELED")
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

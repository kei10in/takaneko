import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { EventStatus } from "../events/eventMeta";
import { EventModule } from "../events/eventModule";
import { EventType } from "../events/EventType";

export type CalendarEvent = {
  slug: string;
  date: string;
  summary: string;
  status: EventStatus | undefined;
  category: EventType;
  region: string | undefined;
  location: string | undefined;
  thumbnail?: string | undefined;
  time?: string | undefined;
};

export const calendarEventFromEventModule = (e: EventModule): CalendarEvent => {
  if (e.meta.category == EventType.RADIO || e.meta.category == EventType.TV) {
    return {
      slug: e.slug,
      date: e.meta.date,
      summary: e.meta.summary,
      status: e.meta.status,
      category: e.meta.category,
      region: e.meta.region,
      location: e.meta.location,
      thumbnail: e.meta.images?.[0]?.path,
      // ラジオとテレビは放送時間が重要になるため、時間も表示します。
      time: `${e.meta.start} 〜 ${e.meta.end}`,
    };
  } else {
    return {
      slug: e.slug,
      date: e.meta.date,
      summary: e.meta.summary,
      status: e.meta.status,
      category: e.meta.category,
      region: e.meta.region,
      location: e.meta.location,
      thumbnail: e.meta.images?.[0]?.path,
    };
  }
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

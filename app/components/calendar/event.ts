export const EventType = {
  LIVE: "LIVE",
  RELEASE: "RELEASE",
  BIRTHDAY: "BIRTHDAY",
  TV: "TV",
  RADIO: "RADIO",
  MAGAZINE: "MAGAZINE",
  WEB: "WEB",
  OTHER: "OTHER",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

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

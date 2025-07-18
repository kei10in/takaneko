import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { importEventFilesAsEventModule } from "./eventFiles";
import { compareEventMeta } from "./eventMeta";
import { EventModule } from "./eventModule";

export const ALL_EVENTS = importEventFilesAsEventModule();

export const isEventExists = (eventId: string): boolean => {
  const [year, month] = eventId.split("_")[0].split("-");
  const path = `./${year}/${month}/${eventId}.mdx`;
  return path in ALL_EVENTS;
};

export const loadEvents = (month: NaiveMonth): EventModule[] => {
  const prev = month.previousMonth();
  const next = month.nextMonth();
  const prefixes = [
    `./${prev.year}/${prev.month.toString().padStart(2, "0")}/`,
    `./${month.year}/${month.month.toString().padStart(2, "0")}/`,
    `./${next.year}/${next.month.toString().padStart(2, "0")}/`,
  ];

  const events = Object.values(ALL_EVENTS).filter(({ filename }) => {
    return prefixes.some((prefix) => filename.startsWith(prefix));
  });

  return events;
};

export const loadEventsInDay = (date: NaiveDate): EventModule[] => {
  const y = date.year.toString();
  const m = date.month.toString().padStart(2, "0");
  const d = date.day.toString().padStart(2, "0");

  const prefixes = [`./${y}/${m}/${y}-${m}-${d}_`];

  const events = Object.values(ALL_EVENTS).filter(({ filename }) => {
    return prefixes.some((prefix) => filename.startsWith(prefix));
  });

  events.sort((a, b) => compareEventMeta(a.meta, b.meta));

  return events;
};

export const loadEventModule = (slug: string): EventModule | undefined => {
  const [year, month] = slug.split("_")[0].split("-");

  return (
    ALL_EVENTS[`./${year}/${month}/${slug}.mdx`] ?? ALL_EVENTS[`./${year}/${month}/${slug}.tsx`]
  );
};

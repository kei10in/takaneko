import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { importEventFilesAsEventModule } from "./eventFiles";
import { EventModule } from "./eventModule";

export const ALL_EVENTS = importEventFilesAsEventModule();

export const isEventExists = (eventId: string): boolean => {
  const [year, month] = eventId.split("_")[0].split("-");
  const path = `./${year}/${month}/${eventId}.mdx`;
  return path in ALL_EVENTS;
};

export const loadEvents = (month: NaiveMonth | NaiveMonth[]): EventModule[] => {
  if (!Array.isArray(month)) {
    return loadEvents([month]);
  }

  const prefixes = month.map((m) => {
    return `./${m.year}/${m.month.toString().padStart(2, "0")}/`;
  });

  const events = Object.values(ALL_EVENTS).filter(({ filename }) => {
    return prefixes.some((prefix) => filename.startsWith(prefix));
  });

  return events;
};

export const loadEventModule = (slug: string): EventModule | undefined => {
  const [year, month] = slug.split("_")[0].split("-");

  return (
    ALL_EVENTS[`./${year}/${month}/${slug}.mdx`] ?? ALL_EVENTS[`./${year}/${month}/${slug}.tsx`]
  );
};

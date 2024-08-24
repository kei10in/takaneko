import { stem } from "~/utils/string";
import { nextMonth, previousMonth } from "../calendars/utils";
import { compareEventType } from "./EventType";
import { EventMeta, validateEventMeta } from "./meta";

export interface EventModule {
  id: string;
  filename: string;
  meta: EventMeta;
}

export interface EventContent {
  meta: EventMeta;
  Content: () => JSX.Element;
}

export const loadEvents = async (params: {
  year: number;
  month: number;
}): Promise<EventModule[]> => {
  const { year, month } = params;

  const prev = previousMonth(year, month);
  const next = nextMonth(year, month);

  const events = import.meta.glob("./**/*.mdx", { import: "meta" });

  const prefixes = [
    `./${prev.year}/${prev.month.toString().padStart(2, "0")}/`,
    `./${year}/${month.toString().padStart(2, "0")}/`,
    `./${next.year}/${next.month.toString().padStart(2, "0")}/`,
  ];

  const promises = Object.entries(events)
    .filter(([filename]) => {
      return prefixes.some((prefix) => filename.startsWith(prefix));
    })
    .map(async ([filename, event]) => {
      const meta = validateEventMeta(await event());
      if (meta == undefined) {
        return undefined;
      }
      const id = stem(filename);

      return { id, filename, meta };
    });

  return (await Promise.all(promises)).filter((x) => x != undefined);
};

export const loadEventsInDay = async (params: {
  year: number;
  month: number;
  date: number;
}): Promise<EventModule[]> => {
  const { year, month, date } = params;

  const modules = import.meta.glob("./**/*.mdx", { import: "meta" });
  const y = year.toString();
  const m = month.toString().padStart(2, "0");
  const d = date.toString().padStart(2, "0");

  const prefixes = [`./${y}/${m}/${y}-${m}-${d}_`];

  const promises = Object.entries(modules)
    .filter(([filename]) => {
      return prefixes.some((prefix) => filename.startsWith(prefix));
    })
    .map(async ([filename, event]) => {
      const meta = validateEventMeta(await event());
      if (meta == undefined) {
        return undefined;
      }
      const id = stem(filename);

      return { id, filename, meta };
    });

  const events = (await Promise.all(promises)).filter((x): x is EventModule => x != undefined);
  events.sort((a, b) => compareEventType(a.meta.category, b.meta.category));

  return events;
};

export const loadEventContent = async (eventId: string): Promise<EventContent | undefined> => {
  const [year, month] = eventId.split("_")[0].split("-");

  const path = `./${year}/${month}/${eventId}.mdx`;
  const events = import.meta.glob("./**/*.mdx");

  const loadEvent = events[path];

  if (loadEvent == undefined) {
    return undefined;
  }

  const event = (await loadEvent()) as Record<string, unknown>;
  const meta = validateEventMeta(event.meta);

  if (meta == undefined) {
    return undefined;
  }

  return { meta, Content: event.default as () => JSX.Element };
};

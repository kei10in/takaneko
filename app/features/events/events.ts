import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { stem } from "~/utils/string";
import { compareEventMeta, EventMeta, validateEventMeta } from "./meta";

export interface EventModule {
  id: string;
  filename: string;
  meta: EventMeta;
}

export interface EventContent {
  meta: EventMeta;
  Content: () => JSX.Element;
}

const ALL_EVENTS = Object.fromEntries(
  Object.entries(import.meta.glob("./**/*.mdx", { eager: true })).flatMap(([filename, module]) => {
    const m = module as Record<string, unknown>;
    const meta = validateEventMeta(m.meta);
    if (meta == undefined) {
      return [];
    }

    const Content = m.default as () => JSX.Element;

    return [[filename, { meta, Content }]];
  }),
);

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

  const events = Object.entries(ALL_EVENTS)
    .filter(([filename]) => {
      return prefixes.some((prefix) => filename.startsWith(prefix));
    })
    .map(([filename, { meta }]) => ({ id: stem(filename), filename, meta }));

  return events;
};

export const loadEventsInDay = (date: NaiveDate): EventModule[] => {
  const y = date.year.toString();
  const m = date.month.toString().padStart(2, "0");
  const d = date.day.toString().padStart(2, "0");

  const prefixes = [`./${y}/${m}/${y}-${m}-${d}_`];

  const events = Object.entries(ALL_EVENTS)
    .filter(([filename]) => {
      return prefixes.some((prefix) => filename.startsWith(prefix));
    })
    .map(([filename, { meta }]) => ({ id: stem(filename), filename, meta }));

  events.sort((a, b) => compareEventMeta(a.meta, b.meta));

  return events;
};

export const loadEventModule = (eventId: string): EventModule | undefined => {
  const [year, month] = eventId.split("_")[0].split("-");

  const path = `./${year}/${month}/${eventId}.mdx`;

  const loadEvent = ALL_EVENTS[path];
  if (loadEvent == undefined) {
    return undefined;
  }

  return { id: eventId, filename: path, meta: loadEvent.meta };
};

export const loadEventContent = (eventId: string): EventContent | undefined => {
  const [year, month] = eventId.split("_")[0].split("-");

  const path = `./${year}/${month}/${eventId}.mdx`;
  const loadEvent = ALL_EVENTS[path];

  return loadEvent;
};

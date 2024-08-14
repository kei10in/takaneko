import { CalendarEvent, EventType } from "~/components/calendar/event";
import { EventModule } from "../events/events";

export const validateYearMonth = (args: {
  year: string | undefined;
  month: string | undefined;
}): { year: number; month: number } | undefined => {
  const year = Number(args.year);
  const month = Number(args.month);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    !Number.isSafeInteger(year) ||
    !Number.isSafeInteger(month) ||
    year < 2000 ||
    month < 1 ||
    month > 12
  ) {
    return undefined;
  }

  return { year, month };
};

export const todayHref = (): string => {
  return "/calendar";
};

export const previousMonthHref = (year: number, month: number): string => {
  const d = new Date(Date.UTC(year, month - 2, 1));
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");

  return `/calendar/${y}/${m}`;
};

export const nextMonthHref = (year: number, month: number): string => {
  const d = new Date(Date.UTC(year, month, 1));
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");

  return `/calendar/${y}/${m}`;
};

export const convertEventModuleToCalendarEvent = (event: EventModule): CalendarEvent => {
  return {
    id: event.id,
    category: EventType.LIVE,
    summary: event.meta.summary,
    date: Date.parse(event.meta.date),
    location: event.meta.location,
    region: event.meta.region,
  };
};

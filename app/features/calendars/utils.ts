import { NaiveMonth } from "~/utils/datetime/NaiveMonth";

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

export const validateYearMonthDate = (args: {
  year: string | undefined;
  month: string | undefined;
  date: string | undefined;
}): { year: number; month: number; date: number } | undefined => {
  const year = Number(args.year);
  const month = Number(args.month);
  const date = Number(args.date);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(date) ||
    !Number.isSafeInteger(year) ||
    !Number.isSafeInteger(month) ||
    !Number.isSafeInteger(date) ||
    year < 2000 ||
    month < 1 ||
    month > 12 ||
    date < 1
  ) {
    return undefined;
  }

  const d = new Date(Date.UTC(year, month - 1, date));

  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, date: d.getUTCDate() };
};

export const currentMonthHref = (): string => {
  return "/calendar";
};

export const calendarMonthHref = (month: NaiveMonth): string => {
  const y = month.year.toString().padStart(4, "0");
  const m = month.month.toString().padStart(2, "0");

  return `/calendar/${y}/${m}`;
};

export const previousMonth = (year: number, month: number): { year: number; month: number } => {
  const d = new Date(Date.UTC(year, month - 2, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
};

export const nextMonth = (year: number, month: number): { year: number; month: number } => {
  const d = new Date(Date.UTC(year, month, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
};

export const todayHref = (): string => {
  return "/calendar/today";
};

export const previousDayHref = (year: number, month: number, date: number): string => {
  const { year: y, month: m, date: d } = previousDay(year, month, date);
  return dateHref(y, m, d);
};

export const dateHref = (year: number, month: number, date: number): string => {
  const y = year.toString();
  const m = month.toString().padStart(2, "0");
  const d = date.toString().padStart(2, "0");
  return `/calendar/${y}/${m}/${d}`;
};

export const nextDayHref = (year: number, month: number, date: number): string => {
  const { year: y, month: m, date: d } = nextDay(year, month, date);
  return dateHref(y, m, d);
};

export const previousDay = (
  year: number,
  month: number,
  date: number,
): { year: number; month: number; date: number } => {
  const d = new Date(Date.UTC(year, month - 1, date - 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, date: d.getUTCDate() };
};

export const nextDay = (
  year: number,
  month: number,
  date: number,
): { year: number; month: number; date: number } => {
  const d = new Date(Date.UTC(year, month - 1, date + 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, date: d.getUTCDate() };
};

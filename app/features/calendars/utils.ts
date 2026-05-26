import { MonthRange } from "~/utils/datetime/MonthRange";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
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
  day: string | undefined;
}): { year: number; month: number; day: number } | undefined => {
  const year = Number(args.year);
  const month = Number(args.month);
  const day = Number(args.day);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    !Number.isSafeInteger(year) ||
    !Number.isSafeInteger(month) ||
    !Number.isSafeInteger(day) ||
    year < 2000 ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return undefined;
  }

  const d = new Date(Date.UTC(year, month - 1, day));

  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
};

export const currentMonthHref = (param: { search?: string } = {}): string => {
  const { search = "" } = param;
  return `/calendar${search}`;
};

export const calendarMonthHref = (month: NaiveMonth, param: { search?: string } = {}): string => {
  const y = month.year.toString().padStart(4, "0");
  const m = month.month.toString().padStart(2, "0");
  const { search = "" } = param;

  return `/calendar/${y}/${m}${search}`;
};

export const dateHref = (date: NaiveDate, param: { search?: string } = {}): string => {
  const y = date.year.toString().padStart(4, "0");
  const m = date.month.toString().padStart(2, "0");
  const d = date.day.toString().padStart(2, "0");
  const { search = "" } = param;

  return `/calendar/${y}/${m}/${d}${search}`;
};

/**
 * calendarMonthRange はカレンダーページで表示する月の範囲を返す関数です。
 */
export const calendarMonthRange = (currentMonth: NaiveMonth): MonthRange => {
  const startMonth = new NaiveMonth(2022, 1);
  const lastMonth = new NaiveMonth(currentMonth.year + 2, 1);

  return { start: startMonth, end: lastMonth };
};

export const calendarMonthRangeForSEO = (currentMonth: NaiveMonth): MonthRange => {
  const upperLimitMonth = currentMonth.advance(9);
  const lowerLimitMonth = currentMonth.advance(2);

  return { start: lowerLimitMonth, end: upperLimitMonth };
};

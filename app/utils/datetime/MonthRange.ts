import { NaiveMonth } from "./NaiveMonth";

export interface MonthRange {
  start: NaiveMonth;
  end: NaiveMonth;
}

export const isMonthInRange = (month: NaiveMonth, range: MonthRange): boolean => {
  return range.start.differenceInMonths(month) <= 0 && month.differenceInMonths(range.end) < 0;
};

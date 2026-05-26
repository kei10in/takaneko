import { NaiveMonth } from "./NaiveMonth";

export interface MonthRange {
  start: NaiveMonth;
  end: NaiveMonth;
}

export const isMonthInRange = (month: NaiveMonth, range: MonthRange): boolean => {
  return range.start.differenceInMonths(month) <= 0 && month.differenceInMonths(range.end) < 0;
};

export const iterateMonthsInRange = function* (range: MonthRange): Generator<NaiveMonth> {
  let current = range.start;
  while (current.differenceInMonths(range.end) < 0) {
    yield current;
    current = current.nextMonth();
  }
};

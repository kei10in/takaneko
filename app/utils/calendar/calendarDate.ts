import { NaiveDate } from "~/utils/datetime/NaiveDate";

export const getCalendarDatesOfMonth = (year: number, month: number): NaiveDate[][] => {
  const firstDate = new NaiveDate(year, month, 1);
  const lastDate = new NaiveDate(year, month + 1, 0);

  const firstDateOfCalendar = new NaiveDate(
    firstDate.year,
    firstDate.month,
    1 - firstDate.dayOfWeek,
  );
  const lastDateOfCalendar = new NaiveDate(
    lastDate.year,
    lastDate.month,
    lastDate.day + 6 - lastDate.dayOfWeek + 1,
  );

  const weeks: NaiveDate[][] = [];
  let d = firstDateOfCalendar;
  do {
    if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(d);
    d = d.nextDate();
  } while (!d.equals(lastDateOfCalendar));

  return weeks;
};

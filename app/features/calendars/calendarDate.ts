import { NaiveDate } from "~/utils/datetime/NaiveDate";

export const getCalendarDatesOfMonth = (year: number, month: number): NaiveDate[][] => {
  const firstDateOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const firstDayOfMonth = firstDateOfMonth.getUTCDay();
  const startDate = new Date(firstDateOfMonth);
  startDate.setUTCDate(firstDateOfMonth.getUTCDate() - firstDayOfMonth);

  const lastDateOfMonth = new Date(Date.UTC(year, month, 0));
  const lastDayOfMonth = lastDateOfMonth.getUTCDay();
  const endDate = new Date(lastDateOfMonth);
  endDate.setUTCDate(lastDateOfMonth.getUTCDate() + (6 - lastDayOfMonth));

  const weeks: NaiveDate[][] = [];
  for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(NaiveDate.fromTimeAsUTC(d.getTime()));
  }

  return weeks;
};

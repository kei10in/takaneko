export const getCalendarDatesOfMonth = (year: number, month: number): Date[][] => {
  const firstDateOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const firstDayOfMonth = firstDateOfMonth.getUTCDay();
  const startDate = new Date(firstDateOfMonth);
  startDate.setUTCDate(firstDateOfMonth.getUTCDate() - firstDayOfMonth);

  const lastDateOfMonth = new Date(Date.UTC(year, month, 0));
  const lastDayOfMonth = lastDateOfMonth.getUTCDay();
  const endDate = new Date(lastDateOfMonth);
  endDate.setUTCDate(lastDateOfMonth.getUTCDate() + (6 - lastDayOfMonth));

  const weeks: Date[][] = [];
  for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(new Date(d));
  }

  return weeks;
};

export const toISODateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const toJapaneseDateString = (date: Date): string => {
  const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const d = date.getUTCDate().toString().padStart(2, "0");
  return `${date.getUTCFullYear()}年${m}月${d}日`;
};

export const convertISODateStringToJapaneseDateString = (date: string): string => {
  const [year, month, day] = date.split("-");
  return `${year}年${month}月${day}日`;
};

export const dateToYearMonth = (date: Date): { year: number; month: number } => {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
};

export const isEqualDate = (a: Date, b: Date): boolean => {
  return (
    a.getUTCFullYear() == b.getUTCFullYear() &&
    a.getUTCMonth() == b.getUTCMonth() &&
    a.getUTCDate() == b.getUTCDate()
  );
};

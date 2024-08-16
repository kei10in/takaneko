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
  const { year: y, month: m } = previousMonth(year, month);

  return `/calendar/${y}/${m}`;
};

export const nextMonthHref = (year: number, month: number): string => {
  const { year: y, month: m } = nextMonth(year, month);

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

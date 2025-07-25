export class NaiveMonth {
  readonly year: number;
  readonly month: number;

  constructor(year: number, month: number) {
    const date = new Date(Date.UTC(year, month - 1, 1));
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
  }

  weeksInMonth = (): number => {
    const firstDate = new Date(this.year, this.month - 1, 1);
    const lastDate = new Date(this.year, this.month, 0);
    const firstDayOfWeek = firstDate.getDay();
    const daysInMonth = lastDate.getDate();

    return Math.ceil((firstDayOfWeek + daysInMonth) / 7);
  };

  getTimeAsUTC = (): number => {
    return Date.UTC(this.year, this.month - 1, 1);
  };

  static fromTimeAsUTC = (time: number): NaiveMonth => {
    const date = new Date(time);
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  };

  advance = (months: number): NaiveMonth => {
    const date = new Date(Date.UTC(this.year, this.month - 1 + months, 1));
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  };

  nextMonth = (): NaiveMonth => {
    const date = new Date(Date.UTC(this.year, this.month, 1));
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  };

  previousMonth = (): NaiveMonth => {
    const date = new Date(Date.UTC(this.year, this.month - 2, 1));
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  };

  differenceInMonths = (other: NaiveMonth): number => {
    return (this.year - other.year) * 12 + (this.month - other.month);
  };

  equals = (other: NaiveMonth): boolean => {
    return this.year === other.year && this.month === other.month;
  };

  toString = (): string => {
    return `${this.year}-${String(this.month).padStart(2, "0")}`;
  };

  static current(): NaiveMonth {
    const date = new Date();
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  }
}

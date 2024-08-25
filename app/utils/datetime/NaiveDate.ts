import { NaiveMonth } from "./NaiveMonth";

export class NaiveDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  constructor(year: number, month: number, day: number) {
    const date = new Date(Date.UTC(year, month - 1, day));
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
    this.day = date.getUTCDate();
  }

  get dayOfWeek(): number {
    return new Date(Date.UTC(this.year, this.month - 1, this.day)).getUTCDay();
  }

  getTimeAsUTC = (): number => {
    return Date.UTC(this.year, this.month - 1, this.day);
  };

  static fromTimeAsUTC = (time: number): NaiveDate => {
    const date = new Date(time);
    return new NaiveDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  };

  nextDate = (): NaiveDate => {
    const date = new Date(Date.UTC(this.year, this.month - 1, this.day + 1));
    return new NaiveDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  };

  previousDate = (): NaiveDate => {
    const date = new Date(Date.UTC(this.year, this.month - 1, this.day - 1));
    return new NaiveDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  };

  naiveMonth = (): NaiveMonth => {
    return new NaiveMonth(this.year, this.month);
  };

  equals = (other: NaiveDate): boolean => {
    return this.year === other.year && this.month === other.month && this.day === other.day;
  };

  toString = (): string => {
    const y = this.year.toString().padStart(4, "0");
    const m = this.month.toString().padStart(2, "0");
    const d = this.day.toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  static today(): NaiveDate {
    const now = new Date();
    // Use local time zone
    return new NaiveDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  static parseUnsafe(date: string): NaiveDate {
    const d = Date.parse(date);
    return NaiveDate.fromTimeAsUTC(d);
  }
}

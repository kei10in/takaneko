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

  addDays = (days: number): NaiveDate => {
    const date = new Date(Date.UTC(this.year, this.month - 1, this.day + days));
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

  compareTo = (other: NaiveDate): number => {
    const thisTime = this.getTimeAsUTC();
    const otherTime = other.getTimeAsUTC();
    return thisTime - otherTime;
  };

  toString = (): string => {
    const y = this.year.toString().padStart(4, "0");
    const m = this.month.toString().padStart(2, "0");
    const d = this.day.toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  static firstDateOfMonth = (month: NaiveMonth): NaiveDate => {
    return new NaiveDate(month.year, month.month, 1);
  };

  static lastDateOfMonth = (month: NaiveMonth): NaiveDate => {
    return new NaiveDate(month.year, month.month + 1, 0);
  };

  static today(): NaiveDate {
    const now = new Date();
    // Use local time zone
    return new NaiveDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  static todayInJapan(): NaiveDate {
    const now = new Date();

    // UTC 上で 9 時間進めれば、日本時間になる。うるう秒などは考慮しない。
    const nowInJapan = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 9),
    );

    return new NaiveDate(
      nowInJapan.getUTCFullYear(),
      nowInJapan.getUTCMonth() + 1,
      nowInJapan.getUTCDate(),
    );
  }

  static parseUnsafe(date: string): NaiveDate {
    const d = Date.parse(date);
    return NaiveDate.fromTimeAsUTC(d);
  }
}

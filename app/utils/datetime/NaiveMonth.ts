export class NaiveMonth {
  readonly year: number;
  readonly month: number;

  constructor(year: number, month: number) {
    const date = new Date(Date.UTC(year, month - 1, 1));
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
  }

  getTimeAsUTC = (): number => {
    return Date.UTC(this.year, this.month - 1, 1);
  };

  static fromTimeAsUTC = (time: number): NaiveMonth => {
    const date = new Date(time);
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

  equals = (other: NaiveMonth): boolean => {
    return this.year === other.year && this.month === other.month;
  };

  static current(): NaiveMonth {
    const date = new Date();
    return new NaiveMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
  }
}

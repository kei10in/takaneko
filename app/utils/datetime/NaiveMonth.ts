export class NaiveMonth {
  readonly year: number;
  readonly month: number;

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
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
}

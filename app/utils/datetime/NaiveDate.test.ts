import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

describe("NaiveDate", () => {
  it("should correctly calculate the day of the week", () => {
    const date = new NaiveDate(2022, 10, 31);
    expect(date.dayOfWeek).toEqual(1); // Monday
  });

  it("should correctly handle out of bounds day when creating a NaiveDate", () => {
    const date = new NaiveDate(2022, 10, 32);
    expect(date.year).toEqual(2022);
    expect(date.month).toEqual(11);
    expect(date.day).toEqual(1);
  });

  it("should correctly handle out of bounds month when creating a NaiveDate", () => {
    const date = new NaiveDate(2022, 13, 1);
    expect(date.year).toEqual(2023);
    expect(date.month).toEqual(1);
    expect(date.day).toEqual(1);
  });

  it("should correctly create last date of a month", () => {
    const date = new NaiveDate(2022, 10 + 1, 0);
    expect(date.year).toEqual(2022);
    expect(date.month).toEqual(10);
    expect(date.day).toEqual(31);
  });

  it("should correctly convert to UTC time", () => {
    const date = new NaiveDate(2022, 10, 31);
    expect(date.getTimeAsUTC()).toEqual(Date.UTC(2022, 9, 31)); // Month is 0-based
  });

  it("should correctly create a NaiveDate from UTC time", () => {
    const time = Date.UTC(2022, 9, 31); // Month is 0-based
    const date = NaiveDate.fromTimeAsUTC(time);
    expect(date.year).toEqual(2022);
    expect(date.month).toEqual(10);
    expect(date.day).toEqual(31);
  });

  it("should correctly calculate the next date", () => {
    const date = new NaiveDate(2022, 10, 31);
    const nextDate = date.nextDate();
    expect(nextDate.year).toEqual(2022);
    expect(nextDate.month).toEqual(11);
    expect(nextDate.day).toEqual(1);
  });

  it("should correctly calculate the previous date", () => {
    const date = new NaiveDate(2022, 11, 1);
    const previousDate = date.previousDate();
    expect(previousDate.year).toEqual(2022);
    expect(previousDate.month).toEqual(10);
    expect(previousDate.day).toEqual(31);
  });

  it("should correctly create a NaiveMonth", () => {
    const date = new NaiveDate(2022, 10, 31);
    const month = date.naiveMonth();
    expect(month.year).toEqual(2022);
    expect(month.month).toEqual(10);
  });

  it("should correctly compare two NaiveDates for equality", () => {
    const date1 = new NaiveDate(2022, 10, 31);
    const date2 = new NaiveDate(2022, 10, 31);
    const date3 = new NaiveDate(2022, 11, 1);
    expect(date1.equals(date2)).toEqual(true);
    expect(date1.equals(date3)).toEqual(false);
  });

  it("should correctly convert NaiveDate to string", () => {
    const date = new NaiveDate(2022, 10, 31);
    expect(date.toString()).toEqual("2022-10-31");
  });

  it("should correctly create a NaiveDate representing today", () => {
    const today = NaiveDate.todayInJapan();
    const now = new Date();
    expect(today.year).toEqual(now.getUTCFullYear());
    expect(today.month).toEqual(now.getUTCMonth() + 1);
    expect(today.day).toEqual(now.getUTCDate());
  });

  it("should correctly parse a NaiveDate from a string", () => {
    const dateString = "2022-10-31";
    const date = NaiveDate.parseUnsafe(dateString);
    expect(date.year).toEqual(2022);
    expect(date.month).toEqual(10);
    expect(date.day).toEqual(31);
  });
});

import { describe, expect, it } from "vitest";
import { NaiveMonth } from "./NaiveMonth";

describe("NaiveMonth", () => {
  it("should initialize correctly", () => {
    const naiveMonth = new NaiveMonth(2024, 8);
    expect(naiveMonth.year).toBe(2024);
    expect(naiveMonth.month).toBe(8);
  });

  it("should initialize month greater than 12", () => {
    const naiveMonth = new NaiveMonth(2024, 13);
    expect(naiveMonth.year).toBe(2025);
    expect(naiveMonth.month).toBe(1);
  });

  it("should return correct UTC time", () => {
    const naiveMonth = new NaiveMonth(2024, 8);
    expect(naiveMonth.getTimeAsUTC()).toBe(Date.UTC(2024, 7, 1));
  });

  it("should create NaiveMonth from UTC time", () => {
    const time = Date.UTC(2024, 7, 1);
    const naiveMonth = NaiveMonth.fromTimeAsUTC(time);
    expect(naiveMonth.year).toBe(2024);
    expect(naiveMonth.month).toBe(8);
  });

  it("should return the next month correctly", () => {
    const naiveMonth = new NaiveMonth(2024, 8);
    const nextMonth = naiveMonth.nextMonth();
    expect(nextMonth.year).toBe(2024);
    expect(nextMonth.month).toBe(9);
  });

  it("should return the previous month correctly", () => {
    const naiveMonth = new NaiveMonth(2024, 8);
    const previousMonth = naiveMonth.previousMonth();
    expect(previousMonth.year).toBe(2024);
    expect(previousMonth.month).toBe(7);
  });

  it("should correctly compare two NaiveMonth instances", () => {
    const naiveMonth1 = new NaiveMonth(2024, 8);
    const naiveMonth2 = new NaiveMonth(2024, 8);
    const naiveMonth3 = new NaiveMonth(2023, 8);
    expect(naiveMonth1.equals(naiveMonth2)).toBe(true);
    expect(naiveMonth1.equals(naiveMonth3)).toBe(false);
  });

  it("should return the current month correctly", () => {
    const currentDate = new Date();
    const naiveMonth = NaiveMonth.current();
    expect(naiveMonth.year).toBe(currentDate.getUTCFullYear());
    expect(naiveMonth.month).toBe(currentDate.getUTCMonth() + 1);
  });
});

import { describe, expect, it } from "vitest";
import { isMonthInRange } from "~/utils/datetime/MonthRange";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { calendarMonthRange, isCalendarMonthAvailable } from "./utils";

describe("isCalendarMonthAvailable", () => {
  const currentMonth = new NaiveMonth(2026, 7);

  it("6か月先の月を表示できる", () => {
    expect(isCalendarMonthAvailable(new NaiveMonth(2027, 1), currentMonth)).toBe(true);
  });

  it("7か月先の月は表示できない", () => {
    expect(isCalendarMonthAvailable(new NaiveMonth(2027, 2), currentMonth)).toBe(false);
  });

  it("2022年7月を表示できる", () => {
    expect(isCalendarMonthAvailable(new NaiveMonth(2022, 7), currentMonth)).toBe(true);
  });

  it("2022年6月以前は表示できない", () => {
    expect(isCalendarMonthAvailable(new NaiveMonth(2022, 6), currentMonth)).toBe(false);
  });
});

describe("calendarMonthRange", () => {
  const range = calendarMonthRange(new NaiveMonth(2026, 7));

  it("2022年7月を範囲に含める", () => {
    expect(isMonthInRange(new NaiveMonth(2022, 7), range)).toBe(true);
  });

  it("2022年6月以前を範囲に含めない", () => {
    expect(isMonthInRange(new NaiveMonth(2022, 6), range)).toBe(false);
  });

  it("6か月先の月を範囲に含める", () => {
    expect(isMonthInRange(new NaiveMonth(2027, 1), range)).toBe(true);
  });

  it("7か月先の月を範囲に含めない", () => {
    expect(isMonthInRange(new NaiveMonth(2027, 2), range)).toBe(false);
  });
});

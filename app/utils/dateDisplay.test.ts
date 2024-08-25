import { describe, expect, it } from "vitest";
import { displayDate, displayMonth } from "./dateDisplay";
import { NaiveDate } from "./datetime/NaiveDate";
import { NaiveMonth } from "./datetime/NaiveMonth";

describe("displayDate", () => {
  it("should return '2022年01月01日' for year 2022-01-01", () => {
    expect(displayDate(2022, 1, 1)).toBe("2022年01月01日");
  });

  it("should return '2025年05月10日' for NaiveDate instance of 2025-05-10", () => {
    const naiveDate = new NaiveDate(2025, 5, 10);
    expect(displayDate(naiveDate)).toBe("2025年05月10日");
  });
});

describe("displayMonth", () => {
  it("should return '2024年08月' for year 2024-08", () => {
    expect(displayMonth(2024, 8)).toBe("2024年08月");
  });

  it("should return '2021年11月' for NaiveMonth instance of 2021-11", () => {
    const naiveMonth = new NaiveMonth(2021, 11);
    expect(displayMonth(naiveMonth)).toBe("2021年11月");
  });
});

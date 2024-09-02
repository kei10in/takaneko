import { describe, expect, it } from "vitest";
import { getActiveDateInJapan } from "../utils/japanTime";

describe("getActiveDateInJapan", () => {
  it("should return the same day if the given time is 7:00 AM or later in Japan", () => {
    const now = new Date("2022-01-10T19:00:00Z");
    const result = getActiveDateInJapan(now);
    expect(result.year).toEqual(2022);
    expect(result.month).toEqual(1);
    expect(result.day).toEqual(11);
  });

  it("should return the previous day if the given time is before 7:00 AM in Japan", () => {
    const now = new Date("2022-01-10T18:59:59Z");
    const result = getActiveDateInJapan(now);
    expect(result.year).toEqual(2022);
    expect(result.month).toEqual(1);
    expect(result.day).toEqual(10);
  });
});

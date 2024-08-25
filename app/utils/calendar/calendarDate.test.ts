import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { getCalendarDatesOfMonth } from "./calendarDate";

describe("getCalendarDatesOfMonth", () => {
  it("should return the correct calendar dates of a month", () => {
    const year = 2024;
    const month = 8;

    const expectedDates: NaiveDate[][] = [
      [
        new NaiveDate(2024, 7, 28),
        new NaiveDate(2024, 7, 29),
        new NaiveDate(2024, 7, 30),
        new NaiveDate(2024, 7, 31),
        new NaiveDate(2024, 8, 1),
        new NaiveDate(2024, 8, 2),
        new NaiveDate(2024, 8, 3),
      ],
      [
        new NaiveDate(2024, 8, 4),
        new NaiveDate(2024, 8, 5),
        new NaiveDate(2024, 8, 6),
        new NaiveDate(2024, 8, 7),
        new NaiveDate(2024, 8, 8),
        new NaiveDate(2024, 8, 9),
        new NaiveDate(2024, 8, 10),
      ],
      [
        new NaiveDate(2024, 8, 11),
        new NaiveDate(2024, 8, 12),
        new NaiveDate(2024, 8, 13),
        new NaiveDate(2024, 8, 14),
        new NaiveDate(2024, 8, 15),
        new NaiveDate(2024, 8, 16),
        new NaiveDate(2024, 8, 17),
      ],
      [
        new NaiveDate(2024, 8, 18),
        new NaiveDate(2024, 8, 19),
        new NaiveDate(2024, 8, 20),
        new NaiveDate(2024, 8, 21),
        new NaiveDate(2024, 8, 22),
        new NaiveDate(2024, 8, 23),
        new NaiveDate(2024, 8, 24),
      ],
      [
        new NaiveDate(2024, 8, 25),
        new NaiveDate(2024, 8, 26),
        new NaiveDate(2024, 8, 27),
        new NaiveDate(2024, 8, 28),
        new NaiveDate(2024, 8, 29),
        new NaiveDate(2024, 8, 30),
        new NaiveDate(2024, 8, 31),
      ],
    ];

    const result = getCalendarDatesOfMonth(year, month);

    expect.addEqualityTesters([
      (a: unknown, b: unknown) => {
        if (a instanceof NaiveDate && b instanceof NaiveDate) {
          return a.equals(b);
        } else {
          return undefined;
        }
      },
    ]);

    expect(result).toEqual(expectedDates);
  });
});

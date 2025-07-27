import { describe, expect, test } from "vitest";
import { calculateChartDimensions } from "./scale";

describe("calculateChartDimensions", () => {
  test.each([
    { input: 0, limit: 1, step: 1 },
    { input: 1, limit: 1, step: 1 },
    { input: 2, limit: 2, step: 1 },
    { input: 3, limit: 3, step: 1 },
    { input: 4, limit: 4, step: 1 },
    { input: 5, limit: 5, step: 1 },
    { input: 6, limit: 6, step: 1 },
    { input: 7, limit: 8, step: 2 },
    { input: 8, limit: 8, step: 2 },
    { input: 9, limit: 10, step: 2 },
    { input: 10, limit: 10, step: 2 },
    { input: 11, limit: 12, step: 2 },
    { input: 12, limit: 12, step: 2 },
    { input: 13, limit: 14, step: 2 },
    { input: 14, limit: 15, step: 3 },
    { input: 15, limit: 15, step: 3 },
    { input: 16, limit: 18, step: 3 },
    { input: 17, limit: 18, step: 3 },
    { input: 18, limit: 20, step: 4 },
    { input: 19, limit: 20, step: 4 },
    { input: 20, limit: 20, step: 4 },
    { input: 22, limit: 24, step: 4 },
    { input: 31, limit: 35, step: 5 },
    { input: 48, limit: 50, step: 10 },
    { input: 77, limit: 80, step: 10 },
    { input: 101, limit: 120, step: 20 },
    { input: 150, limit: 150, step: 25 },
    { input: 290, limit: 300, step: 50 },
  ])(
    "calculateChartDimensions($input) returns limit: $limit and step: $step",
    ({ input, limit, step }) => {
      expect(calculateChartDimensions(input)).toMatchObject({ limit, step });
    },
  );
});

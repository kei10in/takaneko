import { expect, it } from "vitest";
import { calculateGroupedBarLayout } from "./groupedBarChartLayout.ts";

it.each([240, 600, 1200, 2400])(
  "描画幅 %i pxでも、バー幅の75％を重ね、左右を逆転させない",
  (width) => {
    [2, 5, 12].forEach((categories) => {
      const { barSize, barGap } = calculateGroupedBarLayout(width, categories, 2);
      expect(barSize).toBeGreaterThan(0);
      expect(barSize).toBeLessThanOrEqual(48);
      expect(-barGap / barSize).toBeCloseTo(0.75);
      expect(barSize + barGap).toBeGreaterThan(0);
      expect(barSize * 2 + barGap).toBeLessThanOrEqual((width / categories) * 0.8 + 0.000001);
    });
  },
);

it("広い画面では48pxを上限とし、系列が増えても区間内に収める", () => {
  expect(calculateGroupedBarLayout(2000, 2, 2).barSize).toBe(48);
  const { barSize, barGap } = calculateGroupedBarLayout(240, 12, 4);
  expect(barSize * 4 + barGap * 3).toBeCloseTo((240 / 12) * 0.8);
});

it("幅やデータがない場合は0を返す", () => {
  expect(calculateGroupedBarLayout(0, 12, 2)).toEqual({ barSize: 0, barGap: 0 });
  expect(calculateGroupedBarLayout(600, 0, 2)).toEqual({ barSize: 0, barGap: 0 });
  expect(calculateGroupedBarLayout(600, 12, 0)).toEqual({ barSize: 0, barGap: 0 });
});

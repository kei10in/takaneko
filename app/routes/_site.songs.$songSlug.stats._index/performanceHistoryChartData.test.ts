import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  monthlyPerformanceChartData,
  yearlyPerformanceChartData,
} from "./performanceHistoryChartData.ts";

const today = new NaiveDate(2026, 10, 31);
const months = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

describe("monthlyPerformanceChartData", () => {
  it("集計データが空でも1月から12月を重複なく月順に含む", () => {
    const data = monthlyPerformanceChartData([], today.year, today);

    expect(data.map((row) => row.label)).toEqual(months);
  });

  it.each([2021, 2022])("%i年の2022年7月以前の月は集計値の有無によらずundefinedになる", (year) => {
    const labels = year === 2022 ? months.slice(0, 7) : months;
    const counts = labels.map((label) => ({ label, count: 2 }));

    [[], counts].forEach((input) => {
      const data = monthlyPerformanceChartData(input, year, today);

      labels.forEach((label) => {
        expect(data).toContainEqual({ label, count: undefined });
      });
    });
  });

  it.each([
    { year: 2022, labels: months.slice(7) },
    { year: 2025, labels: months },
    { year: today.year, labels: months.slice(0, today.month) },
  ])("$year年の集計対象期間では欠損月が0になる", ({ year, labels }) => {
    const data = monthlyPerformanceChartData([], year, today);

    labels.forEach((label) => {
      expect(data).toContainEqual({ label, count: 0 });
    });
  });

  it.each([1, 10, 12])(
    "今年の未来の月は集計値の有無によらずundefinedになる（当月: %i月）",
    (month) => {
      const date = new NaiveDate(today.year, month, 1);
      const labels = months.slice(month);
      const counts = labels.map((label) => ({ label, count: 5 }));

      [[], counts].forEach((input) => {
        const data = monthlyPerformanceChartData(input, date.year, date);

        expect(data).toContainEqual({ label: `${month}月`, count: 0 });
        labels.forEach((label) => {
          expect(data).toContainEqual({ label, count: undefined });
        });
      });
    },
  );

  it("未来の年はすべての月がundefinedになる", () => {
    const data = monthlyPerformanceChartData([], today.year + 1, today);

    months.forEach((label) => {
      expect(data).toContainEqual({ label, count: undefined });
    });
  });

  it("集計対象期間の集計値を保持し、元のデータを変更しない", () => {
    const counts = [
      { label: "8月", count: 0 },
      { label: "9月", count: 3 },
    ];
    const before = structuredClone(counts);
    const data = monthlyPerformanceChartData(counts, 2022, today);

    counts.forEach((row) => expect(data).toContainEqual(row));
    expect(counts).toEqual(before);
  });
});

describe("yearlyPerformanceChartData", () => {
  it.each([2022, 2026, 2027])(
    "集計データが空でも2022年から%i年までを重複なく年順に含み、値は0になる",
    (year) => {
      const data = yearlyPerformanceChartData([], new NaiveDate(year, 1, 1));
      const years = data.map((row) => Number.parseInt(row.label, 10));

      expect(years.at(0)).toBe(2022);
      expect(years.at(-1)).toBe(year);
      expect(years).toHaveLength(year - 2022 + 1);
      years.slice(1).forEach((value, index) => expect(value).toBe(years[index] + 1));
      data.forEach((row) => expect(row.count).toBe(0));
    },
  );

  it("2022年より前の集計データを含めない", () => {
    const data = yearlyPerformanceChartData([{ label: "2021年", count: 1 }], today);

    data.forEach((row) => expect(Number.parseInt(row.label, 10)).toBeGreaterThanOrEqual(2022));
  });

  it("既存の集計値を保持し、欠損年を0で補完し、元のデータを変更しない", () => {
    const counts = [
      { label: "2024年", count: 3 },
      { label: "2026年", count: 5 },
    ];
    const before = structuredClone(counts);
    const data = yearlyPerformanceChartData(counts, today);

    counts.forEach((row) => expect(data).toContainEqual(row));
    [2022, 2023, 2025].forEach((year) => {
      expect(data).toContainEqual({ label: `${year}年`, count: 0 });
    });
    expect(counts).toEqual(before);
  });
});

import type { PerformanceCount } from "~/features/songs/statistics.ts";
import type { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

export interface PerformanceChartRow {
  label: string;
  count: number | undefined;
}

export const monthlyPerformanceChartData = (
  counts: PerformanceCount[],
  year: number,
  today: NaiveDate,
): PerformanceChartRow[] => {
  const byLabel = new Map(counts.map((row) => [row.label, row.count]));
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const label = `${month}月`;
    const beforeStart = year < 2022 || (year === 2022 && month < 8);
    const isFuture = year > today.year || (year === today.year && month > today.month);
    return {
      label,
      count: beforeStart || isFuture ? undefined : (byLabel.get(label) ?? 0),
    };
  });
};

export const yearlyPerformanceChartData = (
  counts: PerformanceCount[],
  today: NaiveDate,
): PerformanceChartRow[] => {
  const byLabel = new Map(counts.map((row) => [row.label, row.count]));
  const lastYear = Math.max(today.year, ...counts.map((row) => Number.parseInt(row.label, 10)));
  return Array.from({ length: lastYear - 2022 + 1 }, (_, index) => {
    const label = `${2022 + index}年`;
    return { label, count: byLabel.get(label) ?? 0 };
  });
};

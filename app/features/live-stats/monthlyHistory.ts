import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { aggregateLiveCounts } from "./liveCounts.ts";
import type { LiveCounts, LiveStatsData, MonthlyLiveCounts } from "./liveStatsData.ts";

export type MonthlyHistoryData = Pick<
  LiveStatsData,
  "aggregatedOn" | "monthlyEvents" | "monthlyStages"
>;
export type MonthlyHistorySelection = "average" | "total" | number;

interface MonthlyHistoryPeriod {
  label: string;
  counts: LiveCounts | undefined;
}

const monthlyPeriods = (aggregatedOn: string, selection: MonthlyHistorySelection) => {
  const today = NaiveDate.parseUnsafe(aggregatedOn);
  if (today.compareTo(DebutDate) < 0) {
    return [];
  }
  const firstMonth = DebutDate.toString().slice(0, 7);
  const latestMonth = aggregatedOn.slice(0, 7);
  const years =
    typeof selection !== "number"
      ? Array.from(
          { length: today.year - DebutDate.year + 1 },
          (_, index) => DebutDate.year + index,
        )
      : [selection];

  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    const months = years
      .map((year) => `${year}-${month}`)
      .filter((value) => firstMonth <= value && value <= latestMonth);
    return { label: `${index + 1}月`, months };
  });
};

export const buildMonthlyHistory = (
  monthlyCounts: MonthlyLiveCounts[],
  aggregatedOn: string,
  selection: MonthlyHistorySelection,
): MonthlyHistoryPeriod[] =>
  // 出演0件の年も平均の分母に含める。
  monthlyPeriods(aggregatedOn, selection).map(({ label, months }) => ({
    label,
    counts:
      months.length === 0
        ? undefined
        : aggregateLiveCounts(
            monthlyCounts.filter((row) => months.includes(row.month)),
            selection === "average" ? months.length : 1,
          ),
  }));

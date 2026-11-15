import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import type { LiveStatsData, LiveStatsMetrics } from "./liveStatsData.ts";

export type MonthlyHistoryData = Pick<LiveStatsData, "aggregatedOn" | "monthly">;
export type MonthlyHistorySelection = "average" | "total" | number;

interface MonthlyHistoryPeriod {
  label: string;
  counts: LiveStatsMetrics | undefined;
}

export const buildMonthlyHistory = (
  data: MonthlyHistoryData,
  selection: MonthlyHistorySelection,
): MonthlyHistoryPeriod[] => {
  const today = NaiveDate.parseUnsafe(data.aggregatedOn);
  if (today.compareTo(DebutDate) < 0) {
    return [];
  }
  const firstMonth = DebutDate.toString().slice(0, 7);
  const latestMonth = data.aggregatedOn.slice(0, 7);
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
    const rows = data.monthly.filter((row) => months.includes(row.month));
    // 集計対象月のデータがない場合は出演0件として、平均の分母にも含める。
    const aggregate = (key: keyof LiveStatsMetrics) =>
      rows.reduce((sum, row) => sum + row[key], 0) / (selection === "average" ? months.length : 1);
    return {
      label: `${index + 1}月`,
      counts:
        months.length === 0
          ? undefined
          : {
              events: aggregate("events"),
              soloEvents: aggregate("soloEvents"),
              hostedEvents: aggregate("hostedEvents"),
              jointEvents: aggregate("jointEvents"),
              releaseEvents: aggregate("releaseEvents"),
              otherEvents: aggregate("otherEvents"),
              count: aggregate("count"),
              soloStages: aggregate("soloStages"),
              hostedStages: aggregate("hostedStages"),
              jointStages: aggregate("jointStages"),
              releaseEventStages: aggregate("releaseEventStages"),
              otherStages: aggregate("otherStages"),
              days: aggregate("days"),
            },
    };
  });
};

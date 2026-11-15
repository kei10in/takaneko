import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { aggregateLiveCounts } from "./liveCounts.ts";
import type { LiveCounts, LiveStatsData } from "./liveStatsData.ts";

export interface StageHistoryPeriod {
  label: string;
  counts: LiveCounts | undefined;
}

export type StageHistoryData = Pick<
  LiveStatsData,
  "aggregatedOn" | "monthlyStages" | "careerYearlyStages"
>;

export const buildStageHistory = (data: StageHistoryData) => {
  const today = NaiveDate.parseUnsafe(data.aggregatedOn);
  if (today.compareTo(DebutDate) < 0) {
    return { calendar: [], career: [] };
  }

  const calendar: StageHistoryPeriod[] = Array.from(
    { length: today.year - DebutDate.year + 1 },
    (_, index) => {
      const year = DebutDate.year + index;
      return {
        label: `${year}年`,
        counts: aggregateLiveCounts(
          data.monthlyStages.filter((row) => row.month.startsWith(`${year}-`)),
        ),
      };
    },
  );
  const career: StageHistoryPeriod[] = data.careerYearlyStages.map(({ year, ...counts }) => ({
    label: `${year}年目`,
    counts,
  }));
  return { calendar, career };
};

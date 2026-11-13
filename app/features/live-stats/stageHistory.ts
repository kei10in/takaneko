import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import type { LiveStatsData, StageCounts } from "./liveStatsData.ts";

export interface StageHistoryPeriod {
  label: string;
  counts: StageCounts | undefined;
}

export type StageHistoryData = Pick<LiveStatsData, "aggregatedOn" | "monthly" | "careerYearly">;

const sumCounts = (rows: StageCounts[]): StageCounts => ({
  count: rows.reduce((sum, row) => sum + row.count, 0),
  soloStages: rows.reduce((sum, row) => sum + row.soloStages, 0),
  jointStages: rows.reduce((sum, row) => sum + row.jointStages, 0),
  releaseEventStages: rows.reduce((sum, row) => sum + row.releaseEventStages, 0),
  otherStages: rows.reduce((sum, row) => sum + row.otherStages, 0),
});

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
        counts: sumCounts(data.monthly.filter((row) => row.month.startsWith(`${year}-`))),
      };
    },
  );
  const career: StageHistoryPeriod[] = data.careerYearly.map(({ year, ...counts }) => ({
    label: `${year}年目`,
    counts: {
      count: counts.count,
      soloStages: counts.soloStages,
      jointStages: counts.jointStages,
      releaseEventStages: counts.releaseEventStages,
      otherStages: counts.otherStages,
    },
  }));
  return { calendar, career };
};

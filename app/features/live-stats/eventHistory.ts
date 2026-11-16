import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { aggregateLiveCounts } from "./liveCounts.ts";
import type { LiveCounts, LiveStatsData } from "./liveStatsData.ts";

export interface EventHistoryPeriod {
  label: string;
  counts: LiveCounts | undefined;
}

export type EventHistoryData = Pick<
  LiveStatsData,
  "aggregatedOn" | "monthlyEvents" | "careerYearlyEvents"
>;

export const buildEventHistory = (data: EventHistoryData) => {
  const today = NaiveDate.parseUnsafe(data.aggregatedOn);
  if (today.compareTo(DebutDate) < 0) {
    return { calendar: [], career: [] };
  }

  const calendar: EventHistoryPeriod[] = Array.from(
    { length: today.year - DebutDate.year + 1 },
    (_, index) => {
      const year = DebutDate.year + index;
      return {
        label: `${year}年`,
        counts: aggregateLiveCounts(
          data.monthlyEvents.filter((row) => row.month.startsWith(`${year}-`)),
        ),
      };
    },
  );
  const career: EventHistoryPeriod[] = data.careerYearlyEvents.map(({ year, ...counts }) => ({
    label: `${year}年目`,
    counts,
  }));
  return { calendar, career };
};

import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import type { EventCounts, LiveStatsData } from "./liveStatsData.ts";

export interface EventHistoryPeriod {
  label: string;
  counts: EventCounts | undefined;
}

export type EventHistoryData = Pick<LiveStatsData, "aggregatedOn" | "monthly" | "careerYearly">;

const sumCounts = (rows: EventCounts[]): EventCounts => ({
  events: rows.reduce((sum, row) => sum + row.events, 0),
  soloEvents: rows.reduce((sum, row) => sum + row.soloEvents, 0),
  hostedEvents: rows.reduce((sum, row) => sum + row.hostedEvents, 0),
  jointEvents: rows.reduce((sum, row) => sum + row.jointEvents, 0),
  releaseEvents: rows.reduce((sum, row) => sum + row.releaseEvents, 0),
  otherEvents: rows.reduce((sum, row) => sum + row.otherEvents, 0),
});

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
        counts: sumCounts(data.monthly.filter((row) => row.month.startsWith(`${year}-`))),
      };
    },
  );
  const career: EventHistoryPeriod[] = data.careerYearly.map(
    ({ year, events, soloEvents, hostedEvents, jointEvents, releaseEvents, otherEvents }) => ({
      label: `${year}年目`,
      counts: { events, soloEvents, hostedEvents, jointEvents, releaseEvents, otherEvents },
    }),
  );
  return { calendar, career };
};

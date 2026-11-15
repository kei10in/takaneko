import { aggregateLiveCounts } from "./liveCounts.ts";
import type { LiveStatsData, MonthlyLiveCounts } from "./liveStatsData.ts";

export type LiveStatsSummary = LiveStatsData["summary"];

export const buildLiveStatsSummary = (
  monthlyEvents: MonthlyLiveCounts[],
  monthlyStages: MonthlyLiveCounts[],
  days: number,
): LiveStatsSummary => {
  const events = aggregateLiveCounts(monthlyEvents);
  const stages = aggregateLiveCounts(monthlyStages);
  return {
    events: events.total,
    stages: stages.total,
    days,
    soloStages: stages.solo,
    jointStages: stages.hosted + stages.joint,
  };
};

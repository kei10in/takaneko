import type { LiveStatsData } from "./liveStatsData.ts";

export interface LiveStatsSummary {
  events: number;
  days: number;
  stages: number;
  soloStages: number;
  jointStages: number;
}

export const buildLiveStatsSummary = (monthly: LiveStatsData["monthly"]): LiveStatsSummary => ({
  events: monthly.reduce((sum, month) => sum + month.events, 0),
  days: monthly.reduce((sum, month) => sum + month.days, 0),
  stages: monthly.reduce((sum, month) => sum + month.count, 0),
  soloStages: monthly.reduce((sum, month) => sum + month.soloStages, 0),
  jointStages: monthly.reduce((sum, month) => sum + month.jointStages, 0),
});

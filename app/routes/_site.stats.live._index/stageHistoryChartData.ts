import type { ChartRow, ChartStack } from "~/components/charts/stackedBarChartData.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { stageHistorySeries } from "./stageHistorySeries.ts";

export const buildStageHistoryChartData = (
  rows: StageHistoryPeriod[],
): { stacks: ChartStack[]; data: ChartRow[] } => {
  const series = stageHistorySeries;
  return {
    stacks: series.map((item) => ({
      label: item.label,
      color: item.color,
    })),
    data: rows.map((row) => {
      const counts = row.counts;
      return {
        label: row.label,
        values: counts == undefined ? undefined : series.map((item) => counts[item.key]),
      };
    }),
  };
};

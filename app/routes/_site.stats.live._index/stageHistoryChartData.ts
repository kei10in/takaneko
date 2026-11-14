import type { ChartRow, ChartStack } from "~/components/charts/stackedBarChartData.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { stageHistorySeries, type StageHistoryFilter } from "./stageHistorySeries.ts";

export const buildStageHistoryChartData = (
  rows: StageHistoryPeriod[],
  filter: StageHistoryFilter,
): { stacks: ChartStack[]; data: ChartRow[] } => {
  const series = stageHistorySeries.filter((item) => filter === "all" || item.key === filter);
  return {
    stacks: stageHistorySeries.map((item, index) => {
      const selected = series[index];
      if (selected == undefined) {
        return { color: item.color };
      }
      return {
        label: selected.label,
        color: item.color,
      };
    }),
    data: rows.map((row) => {
      const counts = row.counts;
      return {
        label: row.label,
        values: counts == undefined ? undefined : series.map((item) => counts[item.key]),
      };
    }),
  };
};

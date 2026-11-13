import type { ChartRow, ChartStack } from "~/components/charts/stackedBarChartData.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { stageHistorySeries, type StageHistoryFilter } from "./stageHistorySeries.ts";

export const buildStageHistoryChartData = (
  rows: StageHistoryPeriod[],
  filter: StageHistoryFilter,
): { stacks: ChartStack[]; data: ChartRow[] } => {
  const series = stageHistorySeries.filter((item) => filter === "all" || item.key === filter);
  return {
    stacks: series.map((item) => ({
      label: item.label,
      color: filter === "all" ? item.color : "var(--color-nadeshiko-900)",
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

import type { ChartRow, ChartSeries } from "~/components/charts/types.ts";
import type { EventHistoryPeriod } from "~/features/live-stats/eventHistory.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import type { StageHistoryFilter } from "./stageHistorySeries.ts";

const series: ChartSeries[] = [
  { label: "イベント数", color: "var(--color-nadeshiko-900)" },
  { label: "ステージ数", color: "var(--color-nadeshiko-500)" },
];

export const buildStageHistoryChartData = (
  stages: StageHistoryPeriod[],
  events: EventHistoryPeriod[],
  filter: StageHistoryFilter,
): { series: ChartSeries[]; data: ChartRow[] } => ({
  series,
  data: stages.map((row, index) => {
    const key = filter === "all" ? "total" : filter;
    const stageCounts = row.counts;
    const eventCounts = events[index]?.counts;
    return {
      label: row.label,
      values:
        stageCounts == undefined || eventCounts == undefined
          ? undefined
          : [eventCounts[key], stageCounts[key]],
    };
  }),
});

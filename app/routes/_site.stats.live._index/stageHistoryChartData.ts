import type { ChartRow, ChartSeries } from "~/components/charts/types.ts";
import type { EventHistoryPeriod } from "~/features/live-stats/eventHistory.ts";
import type { LiveCounts } from "~/features/live-stats/liveCounts.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import type { StageHistoryFilter } from "./stageHistorySeries.ts";

const series: ChartSeries[] = [
  { label: "イベント数", color: "var(--color-nadeshiko-900)" },
  { label: "ステージ数", color: "var(--color-nadeshiko-500)" },
];

const eventKeys: Record<StageHistoryFilter, keyof LiveCounts> = {
  all: "total",
  soloStages: "solo",
  hostedStages: "hosted",
  jointStages: "joint",
  releaseEventStages: "release-event",
  otherStages: "event-live",
};

export const buildStageHistoryChartData = (
  stages: StageHistoryPeriod[],
  events: EventHistoryPeriod[],
  filter: StageHistoryFilter,
): { series: ChartSeries[]; data: ChartRow[] } => ({
  series,
  data: stages.map((row, index) => {
    const stageCounts = row.counts;
    const eventCounts = events[index]?.counts;
    return {
      label: row.label,
      values:
        stageCounts == undefined || eventCounts == undefined
          ? undefined
          : [eventCounts[eventKeys[filter]], stageCounts[filter === "all" ? "count" : filter]],
    };
  }),
});

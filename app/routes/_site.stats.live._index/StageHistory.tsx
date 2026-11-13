import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { StackedBarChart } from "~/components/charts/StackedBarChart.tsx";
import { buildStageHistory, type StageHistoryData } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";

export const StageHistory = ({ data }: { data: StageHistoryData }) => {
  const [basis, setBasis] = useState<"career" | "calendar">("career");
  const history = useMemo(() => buildStageHistory(data), [data]);
  const chart = useMemo(() => buildStageHistoryChartData(history[basis]), [history, basis]);
  if (history[basis].length === 0) {
    return <p>集計対象のライブはありません。</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          aria-label="集計基準"
          value={[basis]}
          onValueChange={([nextBasis]) => {
            if (nextBasis === "career" || nextBasis === "calendar") {
              setBasis(nextBasis);
            }
          }}
          className="relative isolate grid h-10 shrink-0 grid-cols-2 rounded-full bg-zinc-100 p-1"
        >
          <span
            aria-hidden="true"
            className={clsx(
              "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out motion-reduce:transition-none",
              basis === "calendar" && "translate-x-full",
            )}
          />
          <Toggle
            value="career"
            className={clsx(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
              basis === "career" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            活動年
          </Toggle>
          <Toggle
            value="calendar"
            className={clsx(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
              basis === "calendar" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            西暦
          </Toggle>
        </ToggleGroup>
      </div>
      <StackedBarChart
        name={basis === "career" ? "活動年ごとのステージ数の推移" : "年ごとのステージ数の推移"}
        xAxisLabel={basis === "career" ? "活動年" : "年"}
        yAxisLabel="ステージ数"
        unit="回"
        stacks={chart.stacks}
        data={chart.data}
      />
    </div>
  );
};

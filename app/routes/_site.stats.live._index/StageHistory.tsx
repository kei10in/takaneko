import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { GroupedBarChart } from "~/components/charts/GroupedBarChart.tsx";
import { buildEventHistory, type EventHistoryData } from "~/features/live-stats/eventHistory.ts";
import { buildStageHistory, type StageHistoryData } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";
import { stageHistorySeries, type StageHistoryFilter } from "./stageHistorySeries.ts";

export const StageHistory = ({ data }: { data: StageHistoryData & EventHistoryData }) => {
  const [basis, setBasis] = useState<"career" | "calendar">("career");
  const [filter, setFilter] = useState<StageHistoryFilter>("all");
  const history = useMemo(
    () => ({ stages: buildStageHistory(data), events: buildEventHistory(data) }),
    [data],
  );
  const chart = useMemo(
    () => buildStageHistoryChartData(history.stages[basis], history.events[basis], filter),
    [history, basis, filter],
  );
  if (history.stages[basis].length === 0) {
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
        <label className="relative block shrink-0">
          <span className="sr-only">表示する種別</span>
          <select
            value={filter}
            onChange={(event) => {
              const selected = stageHistorySeries.find(
                (series) => series.key === event.target.value,
              );
              setFilter(selected?.key ?? "all");
            }}
            className="h-10 appearance-none rounded-full bg-zinc-100 pr-10 pl-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 forced-colors:appearance-auto"
          >
            <option value="all">すべて</option>
            {stageHistorySeries.map((series) => (
              <option key={series.key} value={series.key}>
                {series.label}
              </option>
            ))}
          </select>
          <HiChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500 forced-colors:hidden"
          />
        </label>
      </div>
      <GroupedBarChart
        name={
          basis === "career"
            ? "活動年ごとのイベント数・ステージ数の推移"
            : "年ごとのイベント数・ステージ数の推移"
        }
        xAxisLabel={basis === "career" ? "活動年" : "年"}
        yAxisLabel="回数"
        unit="回"
        series={chart.series}
        data={chart.data}
      />
    </div>
  );
};

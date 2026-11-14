import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import { useMemo, useState } from "react";
import { PercentStackedBarChart } from "~/components/charts/PercentStackedBarChart.tsx";
import type { PercentChartSeries } from "~/components/charts/types.ts";
import { buildEventHistory, type EventHistoryData } from "~/features/live-stats/eventHistory.ts";
import type { EventCounts } from "~/features/live-stats/liveStatsData.ts";

interface LiveTypeSeries extends PercentChartSeries {
  key: keyof EventCounts;
}

const series: LiveTypeSeries[] = [
  {
    key: "soloEvents",
    label: "ワンマン",
    color: "var(--color-nadeshiko-900)",
    labelColor: "white",
  },
  { key: "jointEvents", label: "対バン", color: "var(--color-nadeshiko-700)", labelColor: "white" },
  {
    key: "releaseEvents",
    label: "リリイベ",
    color: "var(--color-nadeshiko-500)",
    labelColor: "var(--color-zinc-900)",
  },
  {
    key: "otherEvents",
    label: "その他",
    color: "var(--color-nadeshiko-300)",
    labelColor: "var(--color-zinc-900)",
  },
];

export const LiveTypeBreakdown = ({ data }: { data: EventHistoryData }) => {
  const [basis, setBasis] = useState<"career" | "calendar">("career");
  const history = useMemo(() => buildEventHistory(data), [data]);
  const chartData = useMemo(
    () =>
      history[basis].map(({ label, counts }) => ({
        label,
        values: counts == undefined ? undefined : series.map((item) => counts[item.key]),
      })),
    [history, basis],
  );
  if (chartData.length === 0) {
    return <p>集計対象のライブはありません。</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex">
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
      <PercentStackedBarChart
        data={chartData}
        series={series}
        unit="件"
        xAxisLabel="割合"
        name={
          basis === "career"
            ? "活動年ごとの出演イベントの種類別割合"
            : "年ごとの出演イベントの種類別割合"
        }
        yAxisLabel={basis === "career" ? "活動年" : "年"}
      />
    </div>
  );
};

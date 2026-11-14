import { useMemo, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { GroupedBarChart } from "~/components/charts/GroupedBarChart.tsx";
import { DebutDate } from "~/constants.ts";
import {
  buildMonthlyHistory,
  type MonthlyHistoryData,
  type MonthlyHistorySelection,
} from "~/features/live-stats/monthlyHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";
import { stageHistorySeries, type StageHistoryFilter } from "./stageHistorySeries.ts";

export const MonthlyHistory = ({ data }: { data: MonthlyHistoryData }) => {
  const [selection, setSelection] = useState<MonthlyHistorySelection>("average");
  const [filter, setFilter] = useState<StageHistoryFilter>("all");
  const currentYear = Number(data.aggregatedOn.slice(0, 4));
  const years = Array.from(
    { length: Math.max(0, currentYear - DebutDate.year + 1) },
    (_, index) => currentYear - index,
  );
  const chart = useMemo(() => {
    const history = buildMonthlyHistory(data, selection);
    return buildStageHistoryChartData(history, history, filter);
  }, [data, selection, filter]);
  if (chart.data.length === 0) {
    return <p>集計対象のライブはありません。</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative block shrink-0">
          <span className="sr-only">表示する年</span>
          <select
            value={selection}
            onChange={(event) => {
              const year = years.find((value) => String(value) === event.target.value);
              setSelection(year ?? "average");
            }}
            className="h-10 appearance-none rounded-full bg-zinc-100 pr-10 pl-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 forced-colors:appearance-auto"
          >
            <option value="average">平均</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
          <HiChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500 forced-colors:hidden"
          />
        </label>
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
          selection === "average"
            ? "月ごとのイベント数・ステージ数の平均"
            : `${selection}年の月ごとのイベント数・ステージ数の推移`
        }
        xAxisLabel="月"
        yAxisLabel="回数"
        unit="回"
        series={chart.series}
        data={chart.data}
      />
    </div>
  );
};

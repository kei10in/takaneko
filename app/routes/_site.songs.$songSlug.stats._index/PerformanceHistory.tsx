import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import { useState } from "react";
import { monthlyPerformanceCounts, yearlyPerformanceCounts } from "~/features/songs/statistics.ts";
import { SimpleSongActivity } from "~/features/songs/types.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { StatisticsBarChart } from "./StatisticsBarChart.tsx";

export const PerformanceHistory = ({
  lives,
  today,
}: {
  lives: SimpleSongActivity[];
  today: NaiveDate;
}) => {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedYear, setSelectedYear] = useState<number>();
  const yearly = yearlyPerformanceCounts(lives, today);
  const years = yearly.map((item) => Number.parseInt(item.label, 10));
  const year =
    selectedYear != undefined && years.includes(selectedYear) ? selectedYear : today.year;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ToggleGroup
          aria-label="集計単位"
          value={[period]}
          onValueChange={([nextPeriod]) => {
            if (nextPeriod != undefined) {
              setPeriod(nextPeriod);
            }
          }}
          className="relative isolate grid grid-cols-2 rounded-full bg-zinc-100 p-1"
        >
          <span
            aria-hidden="true"
            className={clsx(
              "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out motion-reduce:transition-none",
              period === "yearly" && "translate-x-full",
            )}
          />
          <Toggle
            value="monthly"
            className={clsx(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
              period === "monthly" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            月別
          </Toggle>
          <Toggle
            value="yearly"
            className={clsx(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
              period === "yearly" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            年別
          </Toggle>
        </ToggleGroup>
        {period === "monthly" && (
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="sr-only">表示する年</span>
            <select
              value={year}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-zinc-700"
            >
              {years.toReversed().map((value) => (
                <option key={value} value={value}>
                  {value}年
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <StatisticsBarChart
        name={period === "monthly" ? `${year}年の月別披露回数` : "年別披露回数"}
        labelName={period === "monthly" ? "月" : "年"}
        data={period === "monthly" ? monthlyPerformanceCounts(lives, year, today) : yearly}
      />
    </div>
  );
};

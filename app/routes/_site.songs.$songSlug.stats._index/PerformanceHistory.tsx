import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import {
  careerYearlyPerformanceCounts,
  monthlyPerformanceCounts,
  yearlyPerformanceCounts,
} from "~/features/songs/statistics.ts";
import { SimpleSongActivity } from "~/features/songs/types.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  monthlyPerformanceChartData,
  yearlyPerformanceChartData,
} from "./performanceHistoryChartData.ts";
import { StatisticsBarChart } from "./StatisticsBarChart.tsx";

export const PerformanceHistory = ({
  lives,
  today,
  firstYear,
}: {
  lives: SimpleSongActivity[];
  today: NaiveDate;
  firstYear: number | undefined;
}) => {
  const [period, setPeriod] = useState<"monthly" | "yearly" | "career">("monthly");
  const [selectedYear, setSelectedYear] = useState<number>();
  const yearly = yearlyPerformanceChartData(yearlyPerformanceCounts(lives, today), today);
  const startYear = firstYear ?? 2022;
  const years = Array.from({ length: today.year - startYear + 1 }, (_, index) => startYear + index);
  const year =
    selectedYear != undefined && years.includes(selectedYear) ? selectedYear : today.year;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          aria-label="集計単位"
          value={[period]}
          onValueChange={([nextPeriod]) => {
            if (nextPeriod != undefined) {
              setPeriod(nextPeriod);
            }
          }}
          className="relative isolate grid h-10 shrink-0 grid-cols-3 rounded-full bg-zinc-100 p-1"
        >
          <span
            aria-hidden="true"
            className={clsx(
              "absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out motion-reduce:transition-none",
              period === "yearly" && "translate-x-full",
              period === "career" && "translate-x-[200%]",
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
          <Toggle
            value="career"
            className={clsx(
              "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
              period === "career" ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            活動年
          </Toggle>
        </ToggleGroup>
        {period === "monthly" && (
          <label className="relative block shrink-0">
            <span className="sr-only">表示する年</span>
            <select
              value={year}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="h-10 w-28 appearance-none rounded-full bg-zinc-100 pr-10 pl-4 text-sm font-medium text-zinc-800 tabular-nums transition-colors hover:bg-zinc-200/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none forced-colors:appearance-auto"
            >
              {years.toReversed().map((value) => (
                <option key={value} value={value}>
                  {value}年
                </option>
              ))}
            </select>
            <HiChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500 forced-colors:hidden"
              aria-hidden="true"
            />
          </label>
        )}
      </div>
      <StatisticsBarChart
        name={
          period === "monthly"
            ? `${year}年の月別披露回数`
            : period === "yearly"
              ? "年別披露回数"
              : "活動年別披露回数"
        }
        labelName={period === "monthly" ? "月" : period === "yearly" ? "年" : "活動年"}
        data={
          period === "monthly"
            ? monthlyPerformanceChartData(monthlyPerformanceCounts(lives, year, today), year, today)
            : period === "yearly"
              ? yearly
              : careerYearlyPerformanceCounts(lives, today)
        }
      />
    </div>
  );
};

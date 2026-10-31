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
        <fieldset aria-label="集計単位" className="flex gap-2">
          <button
            type="button"
            aria-pressed={period === "monthly"}
            onClick={() => setPeriod("monthly")}
            className={clsx(
              "rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100/50",
              period === "monthly" && "bg-zinc-100",
            )}
          >
            月別
          </button>
          <button
            type="button"
            aria-pressed={period === "yearly"}
            onClick={() => setPeriod("yearly")}
            className={clsx(
              "rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100/50",
              period === "yearly" && "bg-zinc-100",
            )}
          >
            年別
          </button>
        </fieldset>
        {period === "monthly" && (
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <span>表示する年</span>
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

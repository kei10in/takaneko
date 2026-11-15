import type { TooltipContentProps } from "recharts";
import type { ChartRow, ChartSeries } from "./types.ts";

export const PercentStackedBarChartTooltip = ({
  active,
  label: position,
  payload = [],
  series,
  data,
  unit,
}: Partial<TooltipContentProps> & { series: ChartSeries[]; data: ChartRow[]; unit: string }) => {
  if (!active || payload.length === 0) {
    return undefined;
  }
  const total = payload.reduce(
    (sum, entry) => sum + (typeof entry.value === "number" ? entry.value : 0),
    0,
  );
  return (
    <div
      role="tooltip"
      className="min-w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-md"
    >
      <p className="mb-2 font-medium text-zinc-900">
        {typeof position === "number" ? data[position]?.label : undefined}
      </p>
      <dl className="space-y-1.5">
        {series.map((item, index) => {
          const entry = payload.find((candidate) => candidate.dataKey === `values[${index}]`);
          const value = entry?.value;
          return (
            <div key={index} className="flex items-baseline justify-between gap-4">
              <dt className="flex items-center gap-2 text-left font-semibold text-zinc-500">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </dt>
              <dd className="grid grid-cols-[auto_5ch] items-baseline gap-x-3 text-right font-medium text-zinc-900 tabular-nums">
                <span>
                  {typeof value === "number"
                    ? `${value.toLocaleString("ja-JP")} ${unit}`
                    : "データなし"}
                </span>
                <span className="text-zinc-500">
                  {typeof value === "number"
                    ? ` ${(total === 0 ? 0 : (value / total) * 100).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}%`
                    : undefined}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

import type { TooltipContentProps } from "recharts";
import type { ChartRow, ChartStack } from "./stackedBarChartData.ts";

export const StackedBarChartTooltip = ({
  active,
  label: position,
  payload = [],
  stacks,
  data,
  unit,
}: Partial<TooltipContentProps> & { stacks: ChartStack[]; data: ChartRow[]; unit: string }) => {
  if (!active || payload.length === 0) {
    return undefined;
  }
  return (
    <div
      role="tooltip"
      className="min-w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-md"
    >
      <p className="mb-2 font-medium text-zinc-900">
        {typeof position === "number" ? data[position]?.label : undefined}
      </p>
      <dl className="space-y-1.5">
        {stacks.map((stack, index) => {
          const entry = payload.find((item) => item.dataKey === `values[${index}]`);
          const value = entry?.value;
          return (
            <div key={index} className="flex items-baseline justify-between gap-4">
              <dt className="flex items-center gap-2 text-left font-semibold text-zinc-500">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: stack.color }}
                />
                {stack.label}
              </dt>
              <dd className="text-right font-medium text-zinc-900 tabular-nums">
                {typeof value === "number"
                  ? `${value.toLocaleString("ja-JP")} ${unit}`
                  : "データなし"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

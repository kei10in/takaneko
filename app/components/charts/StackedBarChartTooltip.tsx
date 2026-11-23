import type { TooltipContentProps } from "recharts";
import { ChartTooltip } from "./ChartTooltip.tsx";
import type { ChartRow, ChartStack } from "./types.ts";

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
    <ChartTooltip
      title={typeof position === "number" ? data[position]?.label : undefined}
      entries={stacks.flatMap(({ label, color }, index) => {
        if (label == undefined) {
          return [];
        }
        const value = payload.find((entry) => entry.dataKey === `values[${index}]`)?.value;
        return [
          {
            label,
            color,
            value:
              typeof value === "number" ? `${value.toLocaleString("ja-JP")} ${unit}` : "データなし",
          },
        ];
      })}
    />
  );
};

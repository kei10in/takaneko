import type { LegendProps, XAxisProps, YAxisProps } from "recharts";

export const verticalChartHeight = 320;
export const verticalChartMargin = { top: 20, right: 12, bottom: 0, left: 0 };

export const verticalChartGridProps = {
  vertical: false,
  strokeDasharray: "3 3",
  stroke: "var(--color-zinc-200)",
};

export const verticalChartXAxisProps = {
  tick: { fontSize: 12 },
  angle: -45,
  textAnchor: "end",
  height: 48,
  tickMargin: 2,
  tickLine: false,
} satisfies XAxisProps;

export const verticalChartYAxisProps = {
  width: 40,
  tickMargin: 2,
  tick: { fontSize: 12 },
  tickLine: false,
} satisfies YAxisProps;

export const verticalChartLegendProps = {
  align: "left",
  verticalAlign: "top",
  height: 24,
  wrapperStyle: { fontSize: 12, top: 0, paddingLeft: 48 },
  iconType: "circle",
  iconSize: 8,
  labelStyle: { color: "var(--color-zinc-600)" },
} satisfies LegendProps;

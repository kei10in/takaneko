import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useActiveTooltipCoordinate,
  usePlotArea,
  type RenderableText,
} from "recharts";
import { StackedBarChartTooltip } from "./StackedBarChartTooltip.tsx";
import { sumChartValues } from "./stackedBarChartData.ts";
import type { ChartRow, PercentChartSeries } from "./types.ts";

const barShape = <Rectangle />;
const maxBarSize = 32;

const formatLabel = (value: RenderableText) =>
  typeof value === "number" ? value.toLocaleString("ja-JP") : value;

interface Props {
  data: ChartRow[];
  series: PercentChartSeries[];
  name: string;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
}

const RowTooltip = ({
  data,
  series,
  unit,
  trigger,
  active,
}: Pick<Props, "data" | "series" | "unit"> & {
  trigger: "hover" | "click";
  active: boolean | undefined;
}) => {
  const plotArea = usePlotArea();
  const coordinate = useActiveTooltipCoordinate();

  return (
    <Tooltip
      position={
        plotArea && coordinate
          ? { x: plotArea.x + plotArea.width, y: coordinate.y + maxBarSize / 2 + 8 }
          : undefined
      }
      wrapperStyle={{ translate: "-100% 0", zIndex: 10 }}
      trigger={trigger}
      active={active}
      filterNull={false}
      cursor={{ fill: "var(--color-zinc-100)" }}
      content={<StackedBarChartTooltip stacks={series} data={data} unit={unit} />}
      isAnimationActive={false}
    />
  );
};

export const PercentStackedBarChart = ({
  data,
  series,
  name,
  xAxisLabel,
  yAxisLabel,
  unit,
}: Props) => {
  const [trigger, setTrigger] = useState<"hover" | "click">("click");
  const isTapInput = useRef(false);
  const [tappedIndex, setTappedIndex] = useState<string>();
  const [tooltipSource, setTooltipSource] = useState({ data, series });
  if (tooltipSource.data !== data || tooltipSource.series !== series) {
    setTooltipSource({ data, series });
    setTappedIndex(undefined);
    setTrigger("click");
  }
  const chartData = useMemo(() => data.map((row, position) => ({ ...row, position })), [data]);

  return (
    <figure
      aria-label={name}
      className="w-full min-w-0"
      onPointerDownCapture={(event) => {
        isTapInput.current = event.pointerType === "touch" || event.pointerType === "pen";
        if (isTapInput.current) {
          setTrigger("click");
        }
      }}
      onPointerMoveCapture={(event) => {
        if (event.pointerType === "mouse") {
          setTrigger("hover");
          setTappedIndex(undefined);
        }
      }}
      onKeyDownCapture={() => {
        setTrigger("hover");
        setTappedIndex(undefined);
      }}
    >
      <ResponsiveContainer width="100%" minWidth={0} height={Math.max(180, data.length * 48 + 44)}>
        <BarChart
          data={chartData}
          layout="vertical"
          stackOffset="expand"
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          accessibilityLayer
          onClick={({ activeTooltipIndex }) => {
            if (isTapInput.current && trigger === "click") {
              const index =
                activeTooltipIndex == undefined ? undefined : String(activeTooltipIndex);
              setTappedIndex((previous) => (previous === index ? undefined : index));
            }
          }}
        >
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis
            type="category"
            dataKey="position"
            width={56}
            tickFormatter={(position: number) => data[position]?.label ?? ""}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
          />
          <RowTooltip
            data={data}
            series={series}
            unit={unit}
            trigger={trigger}
            active={trigger === "click" ? tappedIndex != undefined : undefined}
          />
          {series.map((item, index) => (
            <Bar
              key={index}
              stackId="stack"
              dataKey={`values[${index}]`}
              name={item.label}
              fill={item.color}
              legendType="circle"
              maxBarSize={maxBarSize}
              shape={barShape}
              isAnimationActive
              background={index === 0 ? { fill: "var(--color-nadeshiko-50)" } : undefined}
            >
              <LabelList
                dataKey={(row: ChartRow) => {
                  const value = row.values?.[index];
                  return value != undefined && value > 0 ? value : undefined;
                }}
                position="inside"
                formatter={formatLabel}
                fill={item.labelColor}
                fontSize={12}
                className="tabular-nums"
              />
            </Bar>
          ))}
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ fontSize: 12, top: 0, paddingLeft: 60 }}
            iconType="circle"
            iconSize={8}
            labelStyle={{ color: "var(--color-zinc-600)" }}
            itemSorter={(item) =>
              series.findIndex((_, index) => item.dataKey === `values[${index}]`)
            }
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="sr-only">
        横軸：{xAxisLabel}（各行を100%として表示）、縦軸：{yAxisLabel}、数字の単位：{unit}
      </p>
      <table className="sr-only">
        <caption>{name}のデータ</caption>
        <thead>
          <tr>
            <th scope="col">{yAxisLabel}</th>
            <th scope="col">合計</th>
            {series.map((item, index) => (
              <th key={index} scope="col">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">{row.label}</th>
              <td>{sumChartValues(row.values) ?? "データなし"}</td>
              {series.map((_, index) => (
                <td key={index}>{row.values?.[index] ?? "データなし"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

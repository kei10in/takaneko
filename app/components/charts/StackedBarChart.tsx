import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type RenderableText,
} from "recharts";
import { StackedBarChartTooltip } from "./StackedBarChartTooltip.tsx";
import {
  fillVirtualStackValues,
  sumChartValues,
  type ChartRow,
  type ChartStack,
} from "./stackedBarChartData.ts";

interface Props {
  data: ChartRow[];
  stacks: ChartStack[];
  name: string;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
}

const formatLabel = (value: RenderableText) =>
  typeof value === "number" ? value.toLocaleString("ja-JP") : value;

// shape を明示し、高さ0の矩形も Recharts のアニメーション対象に残す。
const barShape = <Rectangle />;

export const StackedBarChart = ({ data, stacks, name, xAxisLabel, yAxisLabel, unit }: Props) => {
  // 最初のタップで入力モードの更新を待たなくて済むよう、ホバーはマウス移動時に有効にする。
  const [trigger, setTrigger] = useState<"hover" | "click">("click");
  // 再描画のタイミングに依存せず、クリックがタッチ・ペン由来かを判定する。
  const isTapInput = useRef(false);
  const [tappedIndex, setTappedIndex] = useState<string>();
  const [tooltipSource, setTooltipSource] = useState({ data, stacks });
  // 新しいデータには以前のチップを引き継がず、次の操作まで非表示にする。
  if (tooltipSource.data !== data || tooltipSource.stacks !== stacks) {
    setTooltipSource({ data, stacks });
    setTappedIndex(undefined);
    setTrigger("click");
  }
  const chartData = useMemo(
    () =>
      data.map((row, position) => ({
        ...row,
        position,
        values: fillVirtualStackValues(row.values, stacks),
      })),
    [data, stacks],
  );
  const realStacks = stacks.filter((stack) => stack.label != undefined);

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
      <ResponsiveContainer width="100%" minWidth={0} height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 12, bottom: 0, left: 0 }}
          accessibilityLayer
          onClick={({ activeTooltipIndex }) => {
            if (isTapInput.current && trigger === "click") {
              const index =
                activeTooltipIndex == undefined ? undefined : String(activeTooltipIndex);
              setTappedIndex((previous) => (previous === index ? undefined : index));
            }
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-zinc-200)" />
          <XAxis
            dataKey="position"
            tickFormatter={(position: number) => data[position]?.label ?? ""}
            type="category"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={48}
            tickMargin={2}
            tickLine={false}
            interval={0}
          />
          <YAxis
            type="number"
            allowDecimals={false}
            width={40}
            tickMargin={2}
            tick={{ fontSize: 12 }}
            tickLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            trigger={trigger}
            active={trigger === "click" ? tappedIndex != undefined : undefined}
            filterNull={false}
            cursor={{ fill: "var(--color-zinc-100)" }}
            content={<StackedBarChartTooltip stacks={stacks} data={data} unit={unit} />}
            offset={{ x: 36, y: 12 }}
            isAnimationActive={false}
          />
          {stacks.map((stack, index) => (
            <Bar
              key={index}
              stackId="stack"
              dataKey={`values[${index}]`}
              name={stack.label}
              fill={stack.color}
              shape={barShape}
              legendType={stack.label == undefined ? "none" : "circle"}
              maxBarSize={48}
              isAnimationActive
            >
              <LabelList
                dataKey={(row: ChartRow) =>
                  row.values != undefined &&
                  (row.values[index] ?? 0) > 0 &&
                  row.values.slice(index + 1).every((value) => value === 0)
                    ? sumChartValues(row.values)
                    : undefined
                }
                formatter={formatLabel}
                position="top"
                fontSize={12}
                fill="var(--color-zinc-900)"
              />
            </Bar>
          ))}
          <Legend
            align="left"
            verticalAlign="top"
            height={24}
            wrapperStyle={{ fontSize: 12, top: 0, paddingLeft: 48 }}
            iconType="circle"
            iconSize={8}
            labelStyle={{ color: "var(--color-zinc-600)" }}
            itemSorter={(item) =>
              stacks.findIndex((_, index) => item.dataKey === `values[${index}]`)
            }
          />
        </BarChart>
      </ResponsiveContainer>
      <table className="sr-only">
        <caption>{name}のデータ</caption>
        <thead>
          <tr>
            <th scope="col">{xAxisLabel}</th>
            <th scope="col">{yAxisLabel}</th>
            {realStacks.map((stack, index) => (
              <th key={index} scope="col">
                {stack.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">{item.label}</th>
              <td>{sumChartValues(item.values) ?? "データなし"}</td>
              {realStacks.map((_, index) => (
                <td key={index}>{item.values?.[index] ?? "データなし"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

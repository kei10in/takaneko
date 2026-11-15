import { useCallback, useMemo, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  DefaultZIndexes,
  Legend,
  BarChart as RechartsBarChart,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GroupedBarChartTooltip } from "./GroupedBarChartTooltip.tsx";
import { calculateGroupedBarLayout } from "./groupedBarChartLayout.ts";
import type { ChartRow, ChartSeries } from "./types.ts";

interface Props {
  series: ChartSeries[];
  data: ChartRow[];
  name: string;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
}

// shape を明示し、高さ0の矩形も Recharts のアニメーション対象に残す。
const barShape = <Rectangle />;
const chartMargin = { top: 20, right: 12, bottom: 0, left: 0 };
const yAxisWidth = 40;

export const GroupedBarChart = ({ data, series, name, xAxisLabel, yAxisLabel, unit }: Props) => {
  const containerRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const measureContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
    if (element != undefined) {
      setContainerWidth(element.getBoundingClientRect().width);
    }
  }, []);
  const { barSize, barGap } = calculateGroupedBarLayout(
    containerWidth - yAxisWidth - chartMargin.left - chartMargin.right,
    data.length,
    series.length,
  );
  // 最初のタップで入力モードの更新を待たなくて済むよう、ホバーはマウス移動時に有効にする。
  const [trigger, setTrigger] = useState<"hover" | "click">("click");
  // 再描画のタイミングに依存せず、クリックがタッチ・ペン由来かを判定する。
  const isTapInput = useRef(false);
  const [tappedIndex, setTappedIndex] = useState<string>();
  const [tooltipSource, setTooltipSource] = useState({ data, series });
  // 新しいデータには以前のチップを引き継がず、次の操作まで非表示にする。
  if (tooltipSource.data !== data || tooltipSource.series !== series) {
    setTooltipSource({ data, series });
    setTappedIndex(undefined);
    setTrigger("click");
  }
  const chartData = useMemo(() => data.map((row, position) => ({ ...row, position })), [data]);

  return (
    <figure
      ref={measureContainer}
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
      <ResponsiveContainer width="100%" minWidth={0} height={320} onResize={setContainerWidth}>
        <RechartsBarChart
          data={chartData}
          barSize={barSize}
          barGap={barGap}
          margin={chartMargin}
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
            width={yAxisWidth}
            tickMargin={2}
            tick={{ fontSize: 12 }}
            tickLine={false}
            domain={[0, "auto"]}
          />
          <GroupedBarChartTooltip
            groupWidth={barSize * series.length + barGap * Math.max(0, series.length - 1)}
            containerRef={containerRef}
            data={data}
            series={series}
            unit={unit}
            trigger={trigger}
            active={trigger === "click" ? tappedIndex != undefined : undefined}
          />
          {series.map((item, index) => (
            <Bar
              key={index}
              dataKey={`values[${index}]`}
              name={item.label}
              fill={item.color}
              zIndex={DefaultZIndexes.bar + series.length - index}
              shape={barShape}
              legendType="circle"
              isAnimationActive
              animationMatchBy={(bar) => bar.originalDataIndex}
            />
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
              series.findIndex((_, index) => item.dataKey === `values[${index}]`)
            }
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      <p className="sr-only">
        横軸：{xAxisLabel}、縦軸：{yAxisLabel}、単位：{unit}
      </p>
      <table className="sr-only">
        <caption>{name}のデータ</caption>
        <thead>
          <tr>
            <th scope="col">{xAxisLabel}</th>
            {series.map((item, index) => (
              <th key={index} scope="col">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">{item.label}</th>
              {series.map((_, index) => (
                <td key={index}>{item.values?.[index] ?? "データなし"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

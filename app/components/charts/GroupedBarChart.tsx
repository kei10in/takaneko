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
import {
  verticalChartGridProps,
  verticalChartHeight,
  verticalChartLegendProps,
  verticalChartMargin,
  verticalChartXAxisProps,
  verticalChartYAxisProps,
} from "./verticalChartStyle.ts";

interface Props {
  series: ChartSeries[];
  data: ChartRow[];
  name: string;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
  yAxisScale?: { limit: number; step: number };
}

// shape を明示し、高さ0の矩形も Recharts のアニメーション対象に残す。
const barShape = <Rectangle />;

export const GroupedBarChart = ({
  data,
  series,
  name,
  xAxisLabel,
  yAxisLabel,
  unit,
  yAxisScale,
}: Props) => {
  const containerRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const measureContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
    if (element != undefined) {
      setContainerWidth(element.getBoundingClientRect().width);
    }
  }, []);
  const { barSize, barGap } = calculateGroupedBarLayout(
    containerWidth -
      verticalChartYAxisProps.width -
      verticalChartMargin.left -
      verticalChartMargin.right,
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
      <ResponsiveContainer
        width="100%"
        minWidth={0}
        height={verticalChartHeight}
        onResize={setContainerWidth}
      >
        <RechartsBarChart
          data={chartData}
          barSize={barSize}
          barGap={barGap}
          margin={verticalChartMargin}
          accessibilityLayer
          onClick={({ activeTooltipIndex }) => {
            if (isTapInput.current && trigger === "click") {
              const index =
                activeTooltipIndex == undefined ? undefined : String(activeTooltipIndex);
              setTappedIndex((previous) => (previous === index ? undefined : index));
            }
          }}
        >
          <CartesianGrid {...verticalChartGridProps} />
          <XAxis
            {...verticalChartXAxisProps}
            dataKey="position"
            tickFormatter={(position: number) => data[position]?.label ?? ""}
            type="category"
            interval={0}
          />
          <YAxis
            {...verticalChartYAxisProps}
            type="number"
            allowDecimals={false}
            domain={[0, yAxisScale?.limit ?? "auto"]}
            ticks={
              yAxisScale == undefined
                ? undefined
                : Array.from(
                    { length: Math.round(yAxisScale.limit / yAxisScale.step) + 1 },
                    (_, index) => index * yAxisScale.step,
                  )
            }
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
            {...verticalChartLegendProps}
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

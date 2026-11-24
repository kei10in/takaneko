import {
  Area,
  AreaChart,
  CartesianGrid,
  DefaultZIndexes,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ZIndexLayer,
  usePlotArea,
  useXAxisScale,
} from "recharts";
import {
  verticalChartGridProps,
  verticalChartHeight,
  verticalChartLegendProps,
  verticalChartMargin,
  verticalChartXAxisProps,
  verticalChartYAxisProps,
} from "~/components/charts/verticalChartStyle.ts";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth.ts";
import {
  repertoireDensityStartMonth,
  type RepertoireDensityPoint,
} from "./repertoireDensityData.ts";
import { repertoireSeries } from "./repertoireHistoryData.ts";

const calendarTickSize = 6;
const careerAxisHeight = 20;

const formatRate = (value: number) => value.toLocaleString("ja-JP", { maximumFractionDigits: 2 });

const CalendarYearMarks = ({ monthOffsets }: { monthOffsets: number[] }) => {
  const plot = usePlotArea();
  const scale = useXAxisScale();
  if (plot == undefined || scale == undefined) {
    return null;
  }

  const axisY = plot.y + plot.height;
  return (
    <ZIndexLayer zIndex={DefaultZIndexes.axis}>
      <g aria-hidden="true" pointerEvents="none" stroke="var(--color-zinc-500)">
        {monthOffsets.map((offset) => {
          const x = scale(offset);
          return <line key={offset} x1={x} x2={x} y1={axisY} y2={axisY - calendarTickSize} />;
        })}
      </g>
    </ZIndexLayer>
  );
};

export const RepertoireDensity = ({
  data,
  chartName,
  yAxisScale,
}: {
  data: RepertoireDensityPoint[];
  chartName: string;
  yAxisScale: { limit: number; step: number };
}) => {
  const first = data[0];
  const last = data.at(-1);
  if (first == undefined || last == undefined) {
    return <p>集計対象の楽曲はありません。</p>;
  }

  const startMonth = repertoireDensityStartMonth.advance(first.monthOffset);
  const endMonth = repertoireDensityStartMonth.advance(last.monthOffset);
  const calendarYearStarts = Array.from({ length: endMonth.year - startMonth.year }, (_, index) =>
    new NaiveMonth(startMonth.year + index + 1, 1).differenceInMonths(repertoireDensityStartMonth),
  );
  const careerYearStarts = Array.from(
    { length: Math.floor(last.monthOffset / 12) + 1 },
    (_, index) => index * 12,
  );
  const careerYearTicks = careerYearStarts.map((offset, index) => {
    const periodEnd = careerYearStarts[index + 1] ?? last.monthOffset;
    return (offset + periodEnd) / 2;
  });
  const { limit, step } = yAxisScale;
  const densityTicks = Array.from(
    { length: Math.round(limit / step) + 1 },
    (_, index) => index * step,
  );

  return (
    <figure aria-label={chartName} className="w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        minWidth={0}
        height={verticalChartHeight + careerAxisHeight}
      >
        <AreaChart data={data} margin={verticalChartMargin} accessibilityLayer>
          <CartesianGrid {...verticalChartGridProps} />
          <CalendarYearMarks monthOffsets={calendarYearStarts} />
          <XAxis
            {...verticalChartXAxisProps}
            dataKey="monthOffset"
            type="number"
            domain={[first.monthOffset, last.monthOffset]}
            ticks={[first.monthOffset, ...calendarYearStarts]}
            tickFormatter={(offset: number) =>
              `${repertoireDensityStartMonth.advance(offset).year}年`
            }
            tickSize={calendarTickSize}
          />
          <XAxis
            xAxisId="career-year"
            dataKey="monthOffset"
            type="number"
            orientation="top"
            domain={[first.monthOffset, last.monthOffset]}
            ticks={careerYearTicks}
            tickFormatter={(offset: number) => `${careerYearTicks.indexOf(offset) + 1}年目`}
            height={careerAxisHeight}
            interval="preserveStartEnd"
            minTickGap={4}
            tick={{ fontSize: 11, fill: "var(--color-zinc-600)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            {...verticalChartYAxisProps}
            type="number"
            domain={[0, limit]}
            ticks={densityTicks}
            allowDataOverflow
            tickFormatter={formatRate}
          />
          {repertoireSeries.map(({ category, color }, index) => (
            <Area
              key={category.key}
              dataKey={`values[${index}]`}
              stackId="repertoire"
              type="natural"
              name={category.name}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.6}
              dot={data.length === 1}
              activeDot={false}
            />
          ))}
          {careerYearStarts.slice(1).map((start) => (
            <ReferenceLine
              key={start}
              x={start}
              zIndex={DefaultZIndexes.grid}
              stroke={verticalChartGridProps.stroke}
              strokeDasharray="4 3"
            />
          ))}
          <Legend {...verticalChartLegendProps} itemSorter="dataKey" />
        </AreaChart>
      </ResponsiveContainer>
    </figure>
  );
};

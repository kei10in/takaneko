import {
  Area,
  AreaChart,
  CartesianGrid,
  DefaultZIndexes,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ZIndexLayer,
  usePlotArea,
  useXAxisScale,
  type TooltipContentProps,
} from "recharts";
import { ChartTooltip } from "~/components/charts/ChartTooltip.tsx";
import {
  verticalChartGridProps,
  verticalChartHeight,
  verticalChartLegendProps,
  verticalChartMargin,
  verticalChartXAxisProps,
  verticalChartYAxisProps,
} from "~/components/charts/verticalChartStyle.ts";
import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  repertoireDensityDisplayDays as displayDays,
  repertoireDensityBandwidthDays,
  type RepertoireDensityPoint,
} from "./repertoireDensityData.ts";
import {
  listCareerYearStarts,
  repertoireSeries,
  type RepertoireDateOption,
} from "./repertoireHistoryData.ts";

const calendarTickSize = 6;
const careerAxisHeight = 20;

const formatDate = (value: number) =>
  NaiveDate.fromTimeAsUTC(value).toString().replaceAll("-", "/");

const formatRate = (value: number) =>
  (value * displayDays).toLocaleString("ja-JP", { maximumFractionDigits: 2 });

const RepertoireDensityTooltip = ({
  active,
  label,
  payload = [],
}: Partial<TooltipContentProps>) => {
  if (!active || payload.length === 0 || typeof label !== "number") {
    return undefined;
  }

  return (
    <ChartTooltip
      title={formatDate(label)}
      entries={repertoireSeries.map(({ category, color }, index) => {
        const value = payload.find((entry) => entry.dataKey === `values[${index}]`)?.value;
        return {
          label: category.name,
          color,
          value:
            typeof value === "number" ? `${formatRate(value)} 曲 / ${displayDays}日` : "データなし",
        };
      })}
    />
  );
};

const CalendarYearMarks = ({ dates }: { dates: number[] }) => {
  const plot = usePlotArea();
  const scale = useXAxisScale();
  if (plot == undefined || scale == undefined) {
    return null;
  }

  const axisY = plot.y + plot.height;
  return (
    <ZIndexLayer zIndex={DefaultZIndexes.axis}>
      <g aria-hidden="true" pointerEvents="none" stroke="var(--color-zinc-500)">
        {dates.map((date) => {
          const x = scale(date);
          return <line key={date} x1={x} x2={x} y1={axisY} y2={axisY - calendarTickSize} />;
        })}
      </g>
    </ZIndexLayer>
  );
};

export const RepertoireDensity = ({
  data,
  dateBasis,
  yAxisScale,
}: {
  data: RepertoireDensityPoint[];
  dateBasis: RepertoireDateOption;
  yAxisScale: { limit: number; step: number };
}) => {
  const first = data[0];
  const last = data.at(-1);
  if (first == undefined || last == undefined) {
    return <p>集計対象の楽曲はありません。</p>;
  }

  const startYear = NaiveDate.fromTimeAsUTC(first.date).year;
  const end = NaiveDate.fromTimeAsUTC(last.date);
  const calendarYearStarts = Array.from({ length: end.year - startYear }, (_, index) =>
    Date.UTC(startYear + index + 1, 0, 1),
  );
  const careerYearStarts = listCareerYearStarts(end).map((start) => start.getTimeAsUTC());
  const careerYearTicks = careerYearStarts.map((start, index) => {
    const periodEnd = careerYearStarts[index + 1] ?? last.date;
    return (start + periodEnd) / 2;
  });
  const { limit, step } = yAxisScale;
  const densityTicks = Array.from(
    { length: Math.round(limit / step) + 1 },
    (_, index) => (index * step) / displayDays,
  );

  return (
    <figure aria-label={`${dateBasis.activity}の密度グラフ`} className="w-full min-w-0 space-y-2">
      <ResponsiveContainer
        width="100%"
        minWidth={0}
        height={verticalChartHeight + careerAxisHeight}
      >
        <AreaChart data={data} margin={verticalChartMargin} accessibilityLayer>
          <CartesianGrid {...verticalChartGridProps} />
          <CalendarYearMarks dates={calendarYearStarts} />
          <XAxis
            {...verticalChartXAxisProps}
            dataKey="date"
            type="number"
            domain={[first.date, last.date]}
            ticks={[first.date, ...calendarYearStarts]}
            tickFormatter={(date: number) => `${NaiveDate.fromTimeAsUTC(date).year}年`}
            tickSize={calendarTickSize}
          />
          <XAxis
            xAxisId="career-year"
            dataKey="date"
            type="number"
            orientation="top"
            domain={[first.date, last.date]}
            ticks={careerYearTicks}
            tickFormatter={(date: number) => `${careerYearTicks.indexOf(date) + 1}年目`}
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
            domain={[0, limit / displayDays]}
            ticks={densityTicks}
            allowDataOverflow
            tickFormatter={formatRate}
          />
          <Tooltip
            content={<RepertoireDensityTooltip />}
            cursor={{ stroke: "var(--color-zinc-300)" }}
            isAnimationActive={false}
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
      <figcaption className="space-y-1 text-sm text-zinc-600">
        <p>{dateBasis.label}をその月の1日に丸めて、曲数の変化を推定しています。</p>
        <p>
          平滑化幅{repertoireDensityBandwidthDays}日。縦軸は{displayDays}
          日あたりの推定{dateBasis.rate}です。
        </p>
        <p>
          {formatDate(first.date)} ～ {formatDate(last.date)}
        </p>
        <p>
          活動年は毎年{DebutDate.month}月{DebutDate.day}日が区切りです。
        </p>
      </figcaption>
    </figure>
  );
};

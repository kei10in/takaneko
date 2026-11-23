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
} from "recharts";
import { DebutDate } from "~/constants.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  repertoireDensityBandwidthDays,
  type RepertoireDensityPoint,
} from "./repertoireDensityData.ts";
import { listCareerYearStarts, repertoireSeries } from "./repertoireHistoryData.ts";

const displayDays = 30;
const gridLineColor = "var(--color-zinc-200)";
const calendarTickSize = 6;

const formatDate = (value: number) =>
  NaiveDate.fromTimeAsUTC(value).toString().replaceAll("-", "/");

const formatRate = (value: number) =>
  (value * displayDays).toLocaleString("ja-JP", { maximumFractionDigits: 2 });

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

export const RepertoireDensity = ({ data }: { data: RepertoireDensityPoint[] }) => {
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

  return (
    <figure aria-label="持ち歌追加の密度グラフ" className="w-full min-w-0 space-y-2">
      <figcaption className="text-sm text-zinc-600">
        平滑化幅{repertoireDensityBandwidthDays}日。縦軸は{displayDays}日あたりの推定追加曲数です。
      </figcaption>
      <ResponsiveContainer width="100%" minWidth={0} height={320}>
        <AreaChart
          data={data}
          margin={{ top: 12, right: 20, bottom: 0, left: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridLineColor} />
          <CalendarYearMarks dates={calendarYearStarts} />
          <XAxis
            dataKey="date"
            type="number"
            domain={[first.date, last.date]}
            ticks={[first.date, ...calendarYearStarts]}
            tickFormatter={(date: number) => `${NaiveDate.fromTimeAsUTC(date).year}年`}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={48}
            tickSize={calendarTickSize}
            tickMargin={2}
            tickLine={false}
          />
          <XAxis
            xAxisId="career-year"
            dataKey="date"
            type="number"
            orientation="top"
            domain={[first.date, last.date]}
            ticks={careerYearTicks}
            tickFormatter={(date: number) => `${careerYearTicks.indexOf(date) + 1}年目`}
            height={20}
            interval="preserveStartEnd"
            minTickGap={4}
            tick={{ fontSize: 11, fill: "var(--color-zinc-600)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            domain={[0, "auto"]}
            width={40}
            tickFormatter={formatRate}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            itemSorter="dataKey"
            labelFormatter={(date) => (typeof date === "number" ? formatDate(date) : "")}
            formatter={(value) =>
              typeof value === "number" ? `${formatRate(value)} 曲 / ${displayDays}日` : undefined
            }
          />
          {repertoireSeries.map(({ category, color }, index) => (
            <Area
              key={category.key}
              dataKey={`values[${index}]`}
              stackId="repertoire"
              type="monotone"
              name={category.name}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.6}
              dot={data.length === 1}
              isAnimationActive={false}
            />
          ))}
          {careerYearStarts.slice(1).map((start) => (
            <ReferenceLine
              key={start}
              x={start}
              zIndex={DefaultZIndexes.grid}
              stroke={gridLineColor}
              strokeDasharray="4 3"
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
            itemSorter="dataKey"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-sm text-zinc-500">
        {formatDate(first.date)} ～ {formatDate(last.date)}
      </p>
      <p className="text-sm text-zinc-500">
        活動年は毎年{DebutDate.month}月{DebutDate.day}日が区切りです。
      </p>
    </figure>
  );
};

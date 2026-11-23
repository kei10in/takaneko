import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  repertoireDensityBandwidthDays,
  type RepertoireDensityPoint,
} from "./repertoireDensityData.ts";
import { repertoireSeries } from "./repertoireHistoryData.ts";

const displayDays = 30;

const formatDate = (value: number) =>
  NaiveDate.fromTimeAsUTC(value).toString().replaceAll("-", "/");

const formatRate = (value: number) =>
  (value * displayDays).toLocaleString("ja-JP", { maximumFractionDigits: 2 });

export const RepertoireDensity = ({ data }: { data: RepertoireDensityPoint[] }) => {
  const first = data[0];
  const last = data.at(-1);
  if (first == undefined || last == undefined) {
    return <p>集計対象の楽曲はありません。</p>;
  }

  const startYear = NaiveDate.fromTimeAsUTC(first.date).year;
  const endYear = NaiveDate.fromTimeAsUTC(last.date).year;
  const ticks = [
    first.date,
    ...Array.from({ length: endYear - startYear }, (_, index) =>
      Date.UTC(startYear + index + 1, 0, 1),
    ),
  ];

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
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-zinc-200)" />
          <XAxis
            dataKey="date"
            type="number"
            domain={[first.date, last.date]}
            ticks={ticks}
            tickFormatter={(date: number) => `${NaiveDate.fromTimeAsUTC(date).year}年`}
            tick={{ fontSize: 12 }}
            tickLine={false}
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
    </figure>
  );
};

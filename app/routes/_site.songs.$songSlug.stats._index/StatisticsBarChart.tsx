import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PerformanceCount } from "~/features/songs/statistics.ts";

interface Props {
  data: PerformanceCount[];
  name: string;
  labelName: string;
}

export const StatisticsBarChart = ({ data, name, labelName }: Props) => (
  <figure aria-label={name} className="w-full min-w-0">
    <ResponsiveContainer width="100%" minWidth={0} height={256}>
      <BarChart data={data} margin={{ top: 20, right: 12, bottom: 0, left: 0 }} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-zinc-200)" />
        <XAxis
          dataKey="label"
          type="category"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={48}
          tickMargin={8}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          type="number"
          allowDecimals={false}
          width={24}
          tickMargin={2}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <Tooltip
          filterNull={false}
          formatter={(value) => (value == undefined ? "データなし" : `${String(value)}回`)}
          cursor={{ fill: "var(--color-zinc-100)" }}
          contentStyle={{ borderRadius: 12, borderColor: "var(--color-zinc-200)" }}
        />
        <Bar
          dataKey="count"
          name="披露回数"
          fill="var(--color-nadeshiko-700)"
          maxBarSize={48}
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="count"
            position="top"
            fontSize={12}
            fill="var(--color-nadeshiko-800)"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <table className="sr-only">
      <caption>{name}のデータ</caption>
      <thead>
        <tr>
          <th scope="col">{labelName}</th>
          <th scope="col">披露回数</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.label}>
            <th scope="row">{item.label}</th>
            <td>{item.count ?? "データなし"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </figure>
);

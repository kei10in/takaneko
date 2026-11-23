import { useState } from "react";
import { calculateChartDimensions } from "~/components/charts/scale.ts";
import { StackedBarChart } from "~/components/charts/StackedBarChart.tsx";
import { sumChartValues } from "~/components/charts/stackedBarChartData.ts";
import { YearBasisToggle, type YearBasis } from "~/components/YearBasisToggle.tsx";
import { repertoireSeries, type RepertoireHistoryData } from "./repertoireHistoryData.ts";

const stacks = repertoireSeries.map(({ category, color }) => ({ label: category.name, color }));

export const RepertoireHistory = ({ data }: { data: RepertoireHistoryData }) => {
  const [basis, setBasis] = useState<YearBasis>("career");
  if (data[basis].length === 0) {
    return <p>集計対象の楽曲はありません。</p>;
  }
  const maxTotal = Math.max(
    0,
    ...[...data.career, ...data.calendar].map(({ values }) => sumChartValues(values) ?? 0),
  );

  return (
    <div className="space-y-4">
      <div className="flex">
        <YearBasisToggle value={basis} onChange={setBasis} />
      </div>
      <StackedBarChart
        data={data[basis]}
        stacks={stacks}
        name={basis === "career" ? "活動年ごとの持ち歌の追加数" : "西暦ごとの持ち歌の追加数"}
        xAxisLabel={basis === "career" ? "活動年" : "西暦"}
        yAxisLabel="曲数"
        yAxisScale={calculateChartDimensions(maxTotal)}
        unit="曲"
      />
    </div>
  );
};

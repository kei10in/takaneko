import { useState } from "react";
import { StackedBarChart } from "~/components/charts/StackedBarChart.tsx";
import { YearBasisToggle, type YearBasis } from "~/components/YearBasisToggle.tsx";
import { repertoireSeries, type RepertoireHistoryData } from "./repertoireHistoryData.ts";

const stacks = repertoireSeries.map(({ category, color }) => ({ label: category.name, color }));

export const RepertoireHistory = ({
  data,
  countLabel,
  yAxisScale,
}: {
  data: RepertoireHistoryData;
  countLabel: string;
  yAxisScale: { limit: number; step: number };
}) => {
  const [basis, setBasis] = useState<YearBasis>("career");
  if (data[basis].length === 0) {
    return <p>集計対象の楽曲はありません。</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex">
        <YearBasisToggle value={basis} onChange={setBasis} />
      </div>
      <StackedBarChart
        data={data[basis]}
        stacks={stacks}
        name={`${basis === "career" ? "活動年" : "西暦"}ごとの${countLabel}`}
        xAxisLabel={basis === "career" ? "活動年" : "西暦"}
        yAxisLabel="曲数"
        yAxisScale={yAxisScale}
        unit="曲"
      />
    </div>
  );
};

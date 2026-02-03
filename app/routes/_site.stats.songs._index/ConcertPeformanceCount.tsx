import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsBarChartLineFill, BsXCircleFill } from "react-icons/bs";
import useSWR from "swr";
import { SongBarChart } from "~/components/charts/SongBarChart";
import { calculatePerformanceCount } from "~/features/stats/performanceCount";
import { SongPerformanceStats } from "~/features/stats/types";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

Chart.register(ChartDataLabels);

interface Props {
  term: string;
  range?: number | undefined;
}

const findStartDate = (term: string): NaiveDate => {
  if (term.startsWith("recent")) {
    const days = parseInt(term.replace("recent", ""), 10);

    const today = NaiveDate.today();
    const start = today.addDays(-days + 1);

    return start;
  } else {
    // 高嶺のなでしこのデビュー日が最初の日。
    return new NaiveDate(2022, 8, 7);
  }
};

export const ConcertPerformanceCount: React.FC<Props> = ({ term, range }: Props) => {
  const { data, error, isLoading } = useSWR(`/data/stats/${term}/songs.json`, async () => {
    const start = findStartDate(term);
    const response = await fetch("/data/stats/songs.json");
    if (!response.ok) {
      throw new Error("Failed to fetch song performance data");
    }

    const json = await response.json();
    const parsed = SongPerformanceStats.safeParse(json);
    if (!parsed.success) {
      throw new Error("Invalid song performance data");
    }

    return calculatePerformanceCount(parsed.data, start, NaiveDate.today(), range ?? "all");
  });

  if (isLoading) {
    return (
      <div className="flex h-56 w-full items-center justify-center">
        <BsBarChartLineFill className="h-12 w-12 animate-pulse text-gray-300" />
      </div>
    );
  } else if (error || data == undefined) {
    return (
      <div className="flex h-56 w-full items-center justify-center">
        <div className="space-y-3">
          <BsXCircleFill className="mx-auto h-12 w-12 text-gray-300" />
          <p className="text-gray-400">データの読み込みに失敗しました。</p>
        </div>
      </div>
    );
  } else {
    return <SongBarChart songs={data} />;
  }
};

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsBarChartLineFill, BsXCircleFill } from "react-icons/bs";
import useSWR from "swr";
import { SongBarChart } from "~/components/charts/SongBarChart";
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
    const startDateStr = start.toString();
    const response = await fetch("/data/stats/songs.json");
    if (!response.ok) {
      throw new Error("Failed to fetch song performance data");
    }

    const json = await response.json();
    const parsed = SongPerformanceStats.safeParse(json);
    if (!parsed.success) {
      throw new Error("Invalid song performance data");
    }

    const data = parsed.data.songs
      .map((song) => ({
        ...song,
        lives: song.lives.filter((dateStr) => dateStr >= startDateStr),
      }))
      .map((song) => ({
        song: { slug: song.slug, name: song.title, coverArt: song.coverArt },
        value: song.lives.length,
      }))
      .toSorted((a, b) => b.value - a.value);

    if (range != undefined) {
      // 披露回数が 0 のものは除外する
      const i = data.findLastIndex((x) => x.value > 0);

      // 披露回数が同じものがある場合は、range より多くなっても良いように調整する
      const n = data[range - 1].value;
      const j = data.findLastIndex((x) => x.value === n);

      const k = Math.min(i, j);

      return data.slice(0, k + 1);
    }

    return data;
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
    return <SongBarChart data={data} />;
  }
};

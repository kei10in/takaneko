import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsBarChartLineFill, BsXCircleFill } from "react-icons/bs";
import useSWR from "swr";
import { BarChart } from "~/components/charts/BarChart";
import { importEventFilesAsEventModule } from "~/features/events/eventFiles";
import { EventModule } from "~/features/events/eventModule";
import { makeSongToLiveMap, SongActivitySummary } from "~/features/songs/songActivities";
import { ALL_SONGS } from "~/features/songs/songs";

Chart.register(ChartDataLabels);

interface Props {
  range: "all";
}

export const ConcertPerformanceCount: React.FC<Props> = ({ range }: Props) => {
  const { data, error, isLoading } = useSWR(range, async (x) => {
    const allEvents = await new Promise<Record<string, EventModule>>((resolve) => {
      resolve(importEventFilesAsEventModule());
    });

    const songToLiveMap = await new Promise<Record<string, SongActivitySummary>>((resolve) => {
      resolve(makeSongToLiveMap(Object.values(allEvents), ALL_SONGS));
    });

    const allSongs = Object.values(songToLiveMap);
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count);
    const data = sortedAllSongs.map((x) => ({ key: x.name, value: x.count }));
    return data;
  });

  if (isLoading || data == undefined) {
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
    return <BarChart data={data} />;
  }
};

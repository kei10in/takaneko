import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsBarChartLineFill, BsXCircleFill } from "react-icons/bs";
import useSWR from "swr";
import { BarChart } from "~/components/charts/BarChart";
import { importEventFilesAsEventModule } from "~/features/events/eventFiles";
import {
  EventModule,
  importEventModules,
  selectEventModulesByDate,
} from "~/features/events/eventModule";
import { makeSongToLiveMap, SongActivitySummary } from "~/features/songs/songActivities";
import { ALL_SONGS } from "~/features/songs/songs";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

Chart.register(ChartDataLabels);

interface Props {
  term: string;
  range?: number | undefined;
}

const loadEvents = async (term: string) => {
  if (term.startsWith("recent")) {
    const days = parseInt(term.replace("recent", ""), 10);

    const today = NaiveDate.today();

    const importingModules = Array.from({ length: days }).flatMap((_, i) =>
      selectEventModulesByDate(today.addDays(-i)),
    );
    const modules = await importEventModules(importingModules);

    return modules;
  }

  const modules = await new Promise<Record<string, EventModule>>((resolve) => {
    resolve(importEventFilesAsEventModule());
  });
  return Object.values(modules);
};

export const ConcertPerformanceCount: React.FC<Props> = ({ term, range }: Props) => {
  const { data, error, isLoading } = useSWR(term, async (key: string) => {
    const events = await loadEvents(key);

    const songToLiveMap = await new Promise<Record<string, SongActivitySummary>>((resolve) => {
      resolve(makeSongToLiveMap(events, ALL_SONGS));
    });

    const allSongs = Object.values(songToLiveMap);
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count);
    const data = sortedAllSongs.map((x) => ({ key: x.name, value: x.count }));

    if (range != undefined) {
      if (range > data.length) {
        return data;
      }

      // 披露回数が同じものがある場合は、range より多くなっても良いように調整する
      const n = data[range - 1].value;
      const i = data.findLastIndex((x) => x.value === n);

      return data.slice(0, i + 1);
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
    return <BarChart data={data} />;
  }
};

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import { BarChart } from "~/components/charts/BarChart";
import { SongToLiveMap } from "~/features/songs/songToLive";

Chart.register(ChartDataLabels);

export default function ConcertPerformanceCount() {
  const { data } = useMemo(() => {
    const allSongs = Object.values(SongToLiveMap);
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count);
    const data = sortedAllSongs.map((x) => ({ key: x.name, value: x.count }));
    return { data };
  }, []);

  return <BarChart data={data} />;
}

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { SongToLiveMap } from "~/features/songs/songToLive";

Chart.register(ChartDataLabels);

export default function ConcertPerformanceCount() {
  const { labels, data } = useMemo(() => {
    const allSongs = Object.values(SongToLiveMap);
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count);
    const labels = sortedAllSongs.map((x) => x.name);
    const data = sortedAllSongs.map((x) => x.count);
    return { labels, data };
  }, []);

  const height = 20 * labels.length + 80;

  return (
    <div style={{ height: `${height}px` }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: "rgba(242, 104, 158, 0.8)",
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          layout: {
            padding: {
              right: 22,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              color: "#f26894",
              font: {
                weight: "bold",
              },
              align: "end",
              anchor: "end",
              formatter: (value) => value.toString(),
            },
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}

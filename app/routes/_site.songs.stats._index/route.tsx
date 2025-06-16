import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { MetaFunction } from "react-router";
import { SongToLiveMap } from "~/features/songs/songToLive";
import { formatTitle } from "~/utils/htmlHeader";

Chart.register(ChartDataLabels);

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲の統計情報") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の統計情報です。",
    },
  ];
};

export default function Component() {
  const { labels, data } = useMemo(() => {
    const allSongs = Object.values(SongToLiveMap);
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count).slice(0, 20);
    const labels = sortedAllSongs.map((x) => x.name);
    const data = sortedAllSongs.map((x) => x.count);
    return { labels, data };
  }, []);

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">
          楽曲の統計情報 (α)
        </h1>

        <section className="mt-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">
            ライブでよくやるやつ 上位 20 曲
          </h2>

          <div className="h-[520px]">
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
        </section>
      </section>
    </div>
  );
}

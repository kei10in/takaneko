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
    const sortedAllSongs = allSongs.sort((a, b) => b.count - a.count);
    const labels = sortedAllSongs.map((x) => x.name);
    const data = sortedAllSongs.map((x) => x.count);
    return { labels, data };
  }, []);

  const height = 20 * labels.length + 80;

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">
          楽曲の統計情報 (α)
        </h1>

        <section className="mt-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">ライブでよくやるやつ</h2>

          <p className="mb-4 text-gray-600">
            数値は一部不正確です。いくつかのライブのセットリストが不明なためです。
          </p>

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
        </section>

        <section className="mt-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">不明なセットリストについて</h2>

          <p>現在下記のライブのセットリストが不明です。 </p>

          <ul className="my-2 list-disc pl-6 marker:text-gray-400">
            <li>
              <p>たかねこの秋まつり2024 〜FC limited〜 第一部</p>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { MetaFunction } from "react-router";
import { ALL_EVENTS } from "~/features/events/events";
import { aggregatePrefectureStats } from "~/features/stats/pref";
import { formatTitle } from "~/utils/htmlHeader";
import type { Route } from "./+types/route";
import ConcertPerformanceCount from "./ConcertPeformanceCount";

Chart.register(ChartDataLabels);

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("統計") },
    {
      name: "description",
      content: "高嶺のなでしこの統計情報です。",
    },
  ];
};

export const loader = async () => {
  const concertCountsByPrefecture = aggregatePrefectureStats(Object.values(ALL_EVENTS));

  return {
    concertCountsByPrefecture,
  };
};

export default function Component({ loaderData }: Route.ComponentProps) {
  const { concertCountsByPrefecture } = loaderData;

  const labels = concertCountsByPrefecture.map((pref) => pref.name);
  const data = concertCountsByPrefecture.map((pref) => pref.count);
  const height = 20 * labels.length + 80;

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">統計</h1>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-600">都道府県別ライブ開催数</h2>

          <p className="text-sm">
            各都道府県でのライブ開催回数を集計したグラフです。東京は除外しています。
          </p>
          <p className="text-sm">
            同じ日のイベントで複数回ステージがあった場合や、一部と二部に分かれているライブであっても
            1 回としてカウントしています。
            同じ日に複数の場所でステージをしている場合は、それぞれにカウントしています。
          </p>

          <div className="mt-4" style={{ height }}>
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
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">ライブでよくやるやつ</h2>
          <p className="mb-4 text-gray-600">
            数値は一部不正確です。いくつかのライブのセットリストが不明なためです。
          </p>
          <ConcertPerformanceCount />
          <section className="mt-8">
            <h3 className="mb-2 text-lg font-semibold text-gray-600">不明なセットリストについて</h3>

            <p>現在下記のライブのセットリストが不明です。 </p>

            <ul className="my-2 list-disc pl-6 marker:text-gray-400">
              <li>
                <p>たかねこの秋まつり2024 〜FC limited〜 第一部</p>
              </li>
            </ul>
          </section>
        </section>
      </section>
    </div>
  );
}

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Link, MetaFunction } from "react-router";
import { formatTitle } from "~/utils/htmlHeader";

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

const items = [
  {
    title: "楽曲別パフォーマンス回数",
    description:
      "わかっているすべてのライブのセットリストをもとに楽曲パフォーマンス回数を集計したグラフです。",
    url: "/stats/concert-performances",
  },
  {
    title: "都道府県別ライブ開催数",
    description: "各都道府県でのライブ開催回数を集計したグラフです。東京は除外しています。",
    url: "/stats/prefectures",
  },
];

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 mb-8 text-5xl font-semibold lg:mt-12">統計</h1>

        <div className="space-y-4">
          {items.map((item) => {
            return (
              <Link key={item.url} to={item.url} className="block">
                <section
                  key={item.url}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow"
                >
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-gray-500">{item.title}</h2>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </section>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Link, MetaFunction } from "react-router";
import { pageBox, pageHeading } from "~/components/styles";
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
    url: "/stats/songs",
  },
  {
    title: "都道府県別ライブ開催数",
    description: "各都道府県でのライブ開催回数を集計したグラフです。東京は除外しています。",
    url: "/stats/prefectures",
  },
  {
    title: "データセット",
    description:
      "集計に使用しているセットリストのデータを公開しています。CSV または JSON 形式でダウンロードできます。",
    url: "/dataset",
  },
];

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>統計</h1>

        <div className="mt-8 space-y-4">
          {items.map((item) => {
            return (
              <Link
                key={item.url}
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow"
                to={item.url}
              >
                <div>
                  <h2 className="mb-1 text-lg font-semibold text-gray-500">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MetaFunction } from "react-router";
import { formatTitle } from "~/utils/htmlHeader";
import { ConcertPerformanceCount } from "./ConcertPeformanceCount";

Chart.register(ChartDataLabels);

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲別パフォーマンス回数") },
    {
      name: "description",
      content: "高嶺のなでしこの統計情報です。",
    },
  ];
};

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">
          楽曲別パフォーマンス回数
        </h1>

        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">ライブでよくやるやつ</h2>
          <p className="mb-4 text-gray-600">
            数値は一部不正確です。いくつかのライブのセットリストが不明なためです。
          </p>
          <ConcertPerformanceCount range="all" />
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

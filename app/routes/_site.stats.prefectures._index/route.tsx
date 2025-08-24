import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BsBarChartLineFill, BsXCircleFill } from "react-icons/bs";
import { MetaFunction } from "react-router";
import useSWR from "swr";
import { BarChart } from "~/components/charts/BarChart";
import { ALL_EVENTS } from "~/features/events/events";
import { aggregatePrefectureStats } from "~/features/stats/pref";
import { formatTitle } from "~/utils/htmlHeader";

Chart.register(ChartDataLabels);

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("都道府県別ライブ開催数") },
    {
      name: "description",
      content:
        "高嶺のなでしこ（たかねこ）が各都道府県で開催したライブや全国ツアー、リリースイベント（リリイベ）の回数を集計し、グラフで公開しています。",
    },
  ];
};

export default function Component() {
  const { data, error, isLoading } = useSWR("prefectureStats", async () => {
    const concertCountsByPrefecture = await new Promise<{ name: string; count: number }[]>(
      (resolve) => resolve(aggregatePrefectureStats(Object.values(ALL_EVENTS))),
    );

    const data = concertCountsByPrefecture.map((pref) => ({ key: pref.name, value: pref.count }));

    return data;
  });

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 mb-8 text-3xl font-semibold lg:mt-12">
          都道府県別ライブ開催数
        </h1>

        <p className="text-sm">
          各都道府県でのライブ開催回数を集計したグラフです。東京は除外しています。
        </p>
        <p className="text-sm">
          同じ日のイベントで複数回ステージがあった場合や、一部と二部に分かれているライブであっても 1
          回としてカウントしています。
          同じ日に複数の場所でステージをしている場合は、それぞれにカウントしています。
        </p>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-56 w-full items-center justify-center">
              <BsBarChartLineFill className="h-12 w-12 animate-pulse text-gray-300" />
            </div>
          ) : error || data == undefined ? (
            <div className="flex h-56 w-full items-center justify-center">
              <div className="space-y-3">
                <BsXCircleFill className="mx-auto h-12 w-12 text-gray-300" />
                <p className="text-gray-400">データの読み込みに失敗しました。</p>
              </div>
            </div>
          ) : (
            <BarChart data={data} />
          )}
        </div>
      </section>
    </div>
  );
}

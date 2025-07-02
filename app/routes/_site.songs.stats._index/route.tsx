import { Chart } from "chart.js";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MetaFunction } from "react-router";
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

export const loader = async () => {
  return new Response(null, {
    status: 301,
    headers: { Location: "/stats" },
  });
};

export default function Component() {
  return null;
}

import { expect, it } from "vitest";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";
import type { StageHistorySeriesKey } from "./stageHistorySeries.ts";

const data: StageHistoryPeriod[] = [
  {
    label: "1年目",
    counts: {
      count: 11,
      soloStages: 5,
      jointStages: 3,
      releaseEventStages: 2,
      otherStages: 1,
    },
  },
];

it("すべての種別を4つの表示枠へ変換する", () => {
  const chart = buildStageHistoryChartData(data, "all");
  expect(chart.data).toEqual([{ label: "1年目", values: [5, 3, 2, 1] }]);
  expect(
    chart.data.every((row) => row.values == undefined || row.values.length === chart.stacks.length),
  ).toBe(true);
  expect(chart.stacks.map((stack) => stack.label)).toEqual([
    "ワンマン",
    "対バン",
    "リリイベ",
    "その他",
  ]);
});

it.each<{ filter: StageHistorySeriesKey; label: string; value: number }>([
  { filter: "soloStages", label: "ワンマン", value: 5 },
  { filter: "jointStages", label: "対バン", value: 3 },
  { filter: "releaseEventStages", label: "リリイベ", value: 2 },
  { filter: "otherStages", label: "その他", value: 1 },
])(
  "$label の単独表示は先頭のスタックを使い、残り3枠は色を維持した仮想スタックにする",
  ({ filter, label, value }) => {
    const chart = buildStageHistoryChartData(data, filter);
    expect(chart.data).toEqual([{ label: "1年目", values: [value] }]);
    expect(chart.stacks).toEqual([
      { label, color: "var(--color-nadeshiko-900)" },
      { color: "var(--color-nadeshiko-700)" },
      { color: "var(--color-nadeshiko-500)" },
      { color: "var(--color-nadeshiko-300)" },
    ]);
    expect(
      chart.data.every(
        (row) =>
          row.values == undefined ||
          row.values.length === chart.stacks.filter((stack) => stack.label != undefined).length,
      ),
    ).toBe(true);
  },
);

it("0件と未集計を区別してチャートへ渡す", () => {
  const chart = buildStageHistoryChartData(
    [
      {
        label: "10月",
        counts: {
          count: 0,
          soloStages: 0,
          jointStages: 0,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
      {
        label: "11月",
        counts: undefined,
      },
    ],
    "jointStages",
  );
  expect(chart.data).toEqual([
    { label: "10月", values: [0] },
    { label: "11月", values: undefined },
  ]);
});

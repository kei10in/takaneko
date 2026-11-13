import { expect, it } from "vitest";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";

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
  const chart = buildStageHistoryChartData(data);
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

it("0件と未集計を区別してチャートへ渡す", () => {
  const chart = buildStageHistoryChartData([
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
  ]);
  expect(chart.data).toEqual([
    { label: "10月", values: [0, 0, 0, 0] },
    { label: "11月", values: undefined },
  ]);
});

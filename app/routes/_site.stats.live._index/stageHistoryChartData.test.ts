import { expect, it } from "vitest";
import type { EventHistoryPeriod } from "~/features/live-stats/eventHistory.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";
import type { StageHistorySeriesKey } from "./stageHistorySeries.ts";

const stages: StageHistoryPeriod[] = [
  {
    label: "1年目",
    counts: {
      count: 11,
      soloStages: 5,
      hostedStages: 1,
      jointStages: 2,
      releaseEventStages: 2,
      otherStages: 1,
    },
  },
];
const events: EventHistoryPeriod[] = [
  {
    label: "1年目",
    counts: {
      events: 7,
      soloEvents: 2,
      hostedEvents: 1,
      jointEvents: 2,
      releaseEvents: 1,
      otherEvents: 1,
    },
  },
];

it("左にイベント数、右にステージ数を渡す", () => {
  const chart = buildStageHistoryChartData(stages, events, "all");
  expect(chart.series).toEqual([
    { label: "イベント数", color: "var(--color-nadeshiko-900)" },
    { label: "ステージ数", color: "var(--color-nadeshiko-500)" },
  ]);
  expect(chart.data).toEqual([{ label: "1年目", values: [7, 11] }]);
});

it.each<{ filter: StageHistorySeriesKey; events: number; stages: number }>([
  { filter: "soloStages", events: 2, stages: 5 },
  { filter: "hostedStages", events: 1, stages: 1 },
  { filter: "jointStages", events: 2, stages: 2 },
  { filter: "releaseEventStages", events: 1, stages: 2 },
  { filter: "otherStages", events: 1, stages: 1 },
])(
  "$filter の絞り込みを両方に適用して順序と色を維持する",
  ({ filter, events: eventCount, stages: stageCount }) => {
    const chart = buildStageHistoryChartData(stages, events, filter);
    expect(chart.data).toEqual([{ label: "1年目", values: [eventCount, stageCount] }]);
    expect(chart.series).toEqual(buildStageHistoryChartData(stages, events, "all").series);
  },
);

it("0件とデータなしを区別し、片方が未集計なら行全体をデータなしにする", () => {
  const zeroStages = {
    count: 0,
    soloStages: 0,
    hostedStages: 0,
    jointStages: 0,
    releaseEventStages: 0,
    otherStages: 0,
  };
  const zeroEvents = {
    events: 0,
    soloEvents: 0,
    hostedEvents: 0,
    jointEvents: 0,
    releaseEvents: 0,
    otherEvents: 0,
  };
  const chart = buildStageHistoryChartData(
    [
      { label: "2024年", counts: zeroStages },
      { label: "2025年", counts: undefined },
      { label: "2026年", counts: zeroStages },
    ],
    [
      { label: "2024年", counts: zeroEvents },
      { label: "2025年", counts: zeroEvents },
      { label: "2026年", counts: undefined },
    ],
    "all",
  );
  expect(chart.data).toEqual([
    { label: "2024年", values: [0, 0] },
    { label: "2025年", values: undefined },
    { label: "2026年", values: undefined },
  ]);
});

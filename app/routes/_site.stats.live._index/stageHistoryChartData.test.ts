import { expect, it } from "vitest";
import type { LiveCategory } from "~/features/events/LiveCategory.ts";
import type { EventHistoryPeriod } from "~/features/live-stats/eventHistory.ts";
import type { StageHistoryPeriod } from "~/features/live-stats/stageHistory.ts";
import { buildStageHistoryChartData } from "./stageHistoryChartData.ts";

const stages: StageHistoryPeriod[] = [
  {
    label: "1年目",
    counts: {
      total: 11,
      solo: 5,
      hosted: 1,
      joint: 2,
      "release-event": 2,
      "event-live": 1,
    },
  },
];
const events: EventHistoryPeriod[] = [
  {
    label: "1年目",
    counts: {
      total: 7,
      solo: 2,
      hosted: 1,
      joint: 2,
      "release-event": 1,
      "event-live": 1,
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

it.each<{ filter: LiveCategory; events: number; stages: number }>([
  { filter: "solo", events: 2, stages: 5 },
  { filter: "hosted", events: 1, stages: 1 },
  { filter: "joint", events: 2, stages: 2 },
  { filter: "release-event", events: 1, stages: 2 },
  { filter: "event-live", events: 1, stages: 1 },
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
    total: 0,
    solo: 0,
    hosted: 0,
    joint: 0,
    "release-event": 0,
    "event-live": 0,
  };
  const zeroEvents = {
    total: 0,
    solo: 0,
    hosted: 0,
    joint: 0,
    "release-event": 0,
    "event-live": 0,
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

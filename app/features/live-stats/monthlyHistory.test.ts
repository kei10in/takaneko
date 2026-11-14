import { expect, it } from "vitest";
import type { LiveStatsMetrics } from "./liveStatsData.ts";
import { buildMonthlyHistory } from "./monthlyHistory.ts";

const zero: LiveStatsMetrics = {
  events: 0,
  soloEvents: 0,
  jointEvents: 0,
  releaseEvents: 0,
  otherEvents: 0,
  count: 0,
  soloStages: 0,
  jointStages: 0,
  releaseEventStages: 0,
  otherStages: 0,
  days: 0,
};
const data = {
  aggregatedOn: "2024-10-15",
  monthly: [
    { ...zero, month: "2022-08", events: 2, count: 4 },
    { ...zero, month: "2023-01", events: 2, count: 3 },
    { ...zero, month: "2024-01", events: 3, count: 6 },
    { ...zero, month: "2024-10", events: 2, count: 5 },
    { ...zero, month: "2023-12", events: 4, count: 8 },
  ],
};

it("1〜12月を維持し、出演のない月は0、未来やデビュー前の月は未集計にする", () => {
  const history = buildMonthlyHistory(data, 2024);
  expect(history.map((row) => row.label)).toEqual(
    Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
  );
  expect(history[0]?.counts).toMatchObject({ events: 3, count: 6 });
  expect(history[1]?.counts).toEqual(zero);
  expect(history[9]?.counts).toMatchObject({ events: 2, count: 5 });
  expect(history[10]?.counts).toBeUndefined();
  expect(history[11]?.counts).toBeUndefined();
  const debut = buildMonthlyHistory(data, 2022);
  expect(debut[6]?.counts).toBeUndefined();
  expect(debut[7]?.counts).toMatchObject({ events: 2, count: 4 });
});

it("平均は各月の集計対象年で割り、出演0の年は含め、デビュー前や未来は除外する", () => {
  const history = buildMonthlyHistory(data, "average");
  expect(history[0]?.counts).toMatchObject({ events: 2.5, count: 4.5 });
  expect(history[1]?.counts).toEqual(zero);
  expect(history[7]?.counts?.events).toBeCloseTo(2 / 3);
  expect(history[11]?.counts).toMatchObject({ events: 2, count: 4 });
});

it("デビュー前は集計対象がない", () => {
  expect(buildMonthlyHistory({ aggregatedOn: "2022-08-06", monthly: [] }, "average")).toEqual([]);
});

import { expect, it } from "vitest";
import { buildEventHistory } from "./eventHistory.ts";

const metrics = {
  days: 1,
  count: 10,
  soloStages: 0,
  jointStages: 0,
  releaseEventStages: 0,
  otherStages: 10,
};

it("西暦では月別の出演イベント数を合算し、出演のない年も0件で表示する", () => {
  const history = buildEventHistory({
    aggregatedOn: "2024-01-01",
    monthly: [
      {
        ...metrics,
        month: "2022-08",
        events: 2,
        soloEvents: 1,
        jointEvents: 1,
        releaseEvents: 0,
        otherEvents: 0,
      },
      {
        ...metrics,
        month: "2023-01",
        events: 3,
        soloEvents: 1,
        jointEvents: 1,
        releaseEvents: 1,
        otherEvents: 0,
      },
      {
        ...metrics,
        month: "2023-08",
        events: 4,
        soloEvents: 0,
        jointEvents: 1,
        releaseEvents: 0,
        otherEvents: 3,
      },
    ],
    careerYearly: [],
  });
  expect(history.calendar).toEqual([
    {
      label: "2022年",
      counts: { events: 2, soloEvents: 1, jointEvents: 1, releaseEvents: 0, otherEvents: 0 },
    },
    {
      label: "2023年",
      counts: { events: 7, soloEvents: 1, jointEvents: 2, releaseEvents: 1, otherEvents: 3 },
    },
    {
      label: "2024年",
      counts: { events: 0, soloEvents: 0, jointEvents: 0, releaseEvents: 0, otherEvents: 0 },
    },
  ]);
});

it("活動年ではビルド時の出演イベント数を使う", () => {
  const history = buildEventHistory({
    aggregatedOn: "2023-09-01",
    monthly: [
      {
        ...metrics,
        month: "2023-08",
        events: 9,
        soloEvents: 1,
        jointEvents: 2,
        releaseEvents: 3,
        otherEvents: 3,
      },
    ],
    careerYearly: [
      {
        ...metrics,
        year: 1,
        events: 5,
        soloEvents: 2,
        jointEvents: 2,
        releaseEvents: 1,
        otherEvents: 0,
      },
      {
        ...metrics,
        year: 2,
        events: 4,
        soloEvents: 0,
        jointEvents: 1,
        releaseEvents: 1,
        otherEvents: 2,
      },
    ],
  });
  expect(history.career).toEqual([
    {
      label: "1年目",
      counts: { events: 5, soloEvents: 2, jointEvents: 2, releaseEvents: 1, otherEvents: 0 },
    },
    {
      label: "2年目",
      counts: { events: 4, soloEvents: 0, jointEvents: 1, releaseEvents: 1, otherEvents: 2 },
    },
  ]);
});

it("デビュー前は推移を表示しない", () => {
  expect(buildEventHistory({ aggregatedOn: "2022-08-06", monthly: [], careerYearly: [] })).toEqual({
    calendar: [],
    career: [],
  });
});

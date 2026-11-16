import { expect, it } from "vitest";
import { buildEventHistory } from "./eventHistory.ts";

it("西暦では月別の出演イベント数を合算し、出演のない年も0件で表示する", () => {
  const history = buildEventHistory({
    aggregatedOn: "2024-01-01",
    monthlyEvents: [
      {
        month: "2022-08",
        total: 2,
        solo: 1,
        hosted: 0,
        joint: 1,
        "release-event": 0,
        "event-live": 0,
      },
      {
        month: "2023-01",
        total: 3,
        solo: 1,
        hosted: 0,
        joint: 1,
        "release-event": 1,
        "event-live": 0,
      },
      {
        month: "2023-08",
        total: 4,
        solo: 0,
        hosted: 0,
        joint: 1,
        "release-event": 0,
        "event-live": 3,
      },
    ],
    careerYearlyEvents: [],
  });
  expect(history.calendar).toEqual([
    {
      label: "2022年",
      counts: {
        total: 2,
        solo: 1,
        hosted: 0,
        joint: 1,
        "release-event": 0,
        "event-live": 0,
      },
    },
    {
      label: "2023年",
      counts: {
        total: 7,
        solo: 1,
        hosted: 0,
        joint: 2,
        "release-event": 1,
        "event-live": 3,
      },
    },
    {
      label: "2024年",
      counts: {
        total: 0,
        solo: 0,
        hosted: 0,
        joint: 0,
        "release-event": 0,
        "event-live": 0,
      },
    },
  ]);
});

it("活動年ではビルド時の出演イベント数を使う", () => {
  const history = buildEventHistory({
    aggregatedOn: "2023-09-01",
    monthlyEvents: [
      {
        month: "2023-08",
        total: 9,
        solo: 1,
        hosted: 0,
        joint: 2,
        "release-event": 3,
        "event-live": 3,
      },
    ],
    careerYearlyEvents: [
      {
        year: 1,
        total: 5,
        solo: 2,
        hosted: 0,
        joint: 2,
        "release-event": 1,
        "event-live": 0,
      },
      {
        year: 2,
        total: 4,
        solo: 0,
        hosted: 0,
        joint: 1,
        "release-event": 1,
        "event-live": 2,
      },
    ],
  });
  expect(history.career).toEqual([
    {
      label: "1年目",
      counts: {
        total: 5,
        solo: 2,
        hosted: 0,
        joint: 2,
        "release-event": 1,
        "event-live": 0,
      },
    },
    {
      label: "2年目",
      counts: {
        total: 4,
        solo: 0,
        hosted: 0,
        joint: 1,
        "release-event": 1,
        "event-live": 2,
      },
    },
  ]);
});

it("デビュー前は推移を表示しない", () => {
  expect(
    buildEventHistory({ aggregatedOn: "2022-08-06", monthlyEvents: [], careerYearlyEvents: [] }),
  ).toEqual({
    calendar: [],
    career: [],
  });
});

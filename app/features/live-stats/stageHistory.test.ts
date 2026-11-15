import { describe, expect, it } from "vitest";
import { buildStageHistory } from "./stageHistory.ts";

describe("buildStageHistory", () => {
  it("西暦の推移は月別データを年ごとに合算し、出演のない年も0件で表示する", () => {
    const history = buildStageHistory({
      aggregatedOn: "2026-11-12",
      monthlyStages: [
        {
          month: "2024-12",
          total: 2,
          solo: 1,
          hosted: 0,
          joint: 1,
          "release-event": 0,
          "event-live": 0,
        },
        {
          month: "2026-01",
          total: 6,
          solo: 1,
          hosted: 0,
          joint: 2,
          "release-event": 1,
          "event-live": 2,
        },
        {
          month: "2026-08",
          total: 9,
          solo: 2,
          hosted: 0,
          joint: 3,
          "release-event": 2,
          "event-live": 2,
        },
      ],
      careerYearlyStages: [],
    });
    expect(history.calendar).toEqual([
      {
        label: "2022年",
        counts: {
          total: 0,
          solo: 0,
          hosted: 0,
          joint: 0,
          "release-event": 0,
          "event-live": 0,
        },
      },
      {
        label: "2023年",
        counts: {
          total: 0,
          solo: 0,
          hosted: 0,
          joint: 0,
          "release-event": 0,
          "event-live": 0,
        },
      },
      {
        label: "2024年",
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
        label: "2025年",
        counts: {
          total: 0,
          solo: 0,
          hosted: 0,
          joint: 0,
          "release-event": 0,
          "event-live": 0,
        },
      },
      {
        label: "2026年",
        counts: {
          total: 15,
          solo: 3,
          hosted: 0,
          joint: 5,
          "release-event": 3,
          "event-live": 4,
        },
      },
    ]);
  });

  it("活動年の推移はビルド時の活動年別データを使う", () => {
    const history = buildStageHistory({
      aggregatedOn: "2023-08-08",
      monthlyStages: [
        {
          month: "2023-08",
          total: 20,
          solo: 10,
          hosted: 0,
          joint: 5,
          "release-event": 0,
          "event-live": 5,
        },
      ],
      careerYearlyStages: [
        {
          year: 1,
          total: 8,
          solo: 1,
          hosted: 0,
          joint: 2,
          "release-event": 0,
          "event-live": 5,
        },
        {
          year: 2,
          total: 12,
          solo: 9,
          hosted: 0,
          joint: 3,
          "release-event": 0,
          "event-live": 0,
        },
      ],
    });
    expect(history.career).toEqual([
      {
        label: "1年目",
        counts: {
          total: 8,
          solo: 1,
          hosted: 0,
          joint: 2,
          "release-event": 0,
          "event-live": 5,
        },
      },
      {
        label: "2年目",
        counts: {
          total: 12,
          solo: 9,
          hosted: 0,
          joint: 3,
          "release-event": 0,
          "event-live": 0,
        },
      },
    ]);
  });

  it("デビュー前は推移を表示しない", () => {
    expect(
      buildStageHistory({ aggregatedOn: "2022-08-06", monthlyStages: [], careerYearlyStages: [] }),
    ).toEqual({
      calendar: [],
      career: [],
    });
  });
});

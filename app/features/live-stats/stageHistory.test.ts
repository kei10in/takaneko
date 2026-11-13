import { describe, expect, it } from "vitest";
import { buildStageHistory } from "./stageHistory.ts";

describe("buildStageHistory", () => {
  it("西暦の推移は月別データを年ごとに合算し、出演のない年も0件で表示する", () => {
    const history = buildStageHistory({
      aggregatedOn: "2026-11-12",
      monthly: [
        {
          month: "2024-12",
          events: 1,
          days: 1,
          count: 2,
          soloStages: 1,
          jointStages: 1,
          releaseEventStages: 0,
          otherStages: 0,
        },
        {
          month: "2026-01",
          events: 1,
          days: 1,
          count: 6,
          soloStages: 1,
          jointStages: 2,
          releaseEventStages: 1,
          otherStages: 2,
        },
        {
          month: "2026-08",
          events: 1,
          days: 1,
          count: 9,
          soloStages: 2,
          jointStages: 3,
          releaseEventStages: 2,
          otherStages: 2,
        },
      ],
      careerYearly: [],
    });
    expect(history.calendar).toEqual([
      {
        label: "2022年",
        counts: {
          count: 0,
          soloStages: 0,
          jointStages: 0,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
      {
        label: "2023年",
        counts: {
          count: 0,
          soloStages: 0,
          jointStages: 0,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
      {
        label: "2024年",
        counts: {
          count: 2,
          soloStages: 1,
          jointStages: 1,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
      {
        label: "2025年",
        counts: {
          count: 0,
          soloStages: 0,
          jointStages: 0,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
      {
        label: "2026年",
        counts: {
          count: 15,
          soloStages: 3,
          jointStages: 5,
          releaseEventStages: 3,
          otherStages: 4,
        },
      },
    ]);
  });

  it("活動年の推移はビルド時の活動年別データを使う", () => {
    const history = buildStageHistory({
      aggregatedOn: "2023-08-08",
      monthly: [
        {
          month: "2023-08",
          events: 1,
          days: 1,
          count: 20,
          soloStages: 10,
          jointStages: 5,
          releaseEventStages: 0,
          otherStages: 5,
        },
      ],
      careerYearly: [
        {
          year: 1,
          events: 1,
          days: 1,
          count: 8,
          soloStages: 1,
          jointStages: 2,
          releaseEventStages: 0,
          otherStages: 5,
        },
        {
          year: 2,
          events: 1,
          days: 1,
          count: 12,
          soloStages: 9,
          jointStages: 3,
          releaseEventStages: 0,
          otherStages: 0,
        },
      ],
    });
    expect(history.career).toEqual([
      {
        label: "1年目",
        counts: {
          count: 8,
          soloStages: 1,
          jointStages: 2,
          releaseEventStages: 0,
          otherStages: 5,
        },
      },
      {
        label: "2年目",
        counts: {
          count: 12,
          soloStages: 9,
          jointStages: 3,
          releaseEventStages: 0,
          otherStages: 0,
        },
      },
    ]);
  });

  it("デビュー前は推移を表示しない", () => {
    expect(
      buildStageHistory({ aggregatedOn: "2022-08-06", monthly: [], careerYearly: [] }),
    ).toEqual({
      calendar: [],
      career: [],
    });
  });
});

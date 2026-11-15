import { describe, expect, it } from "vitest";
import { LiveTypeEnum, type LiveType } from "~/features/events/EventType.ts";
import type { LiveCategory } from "~/features/events/LiveCategory.ts";
import {
  validateEventMeta,
  type EventMeta,
  type EventMetaDescriptor,
} from "~/features/events/eventMeta.ts";
import { buildEventHistory } from "./eventHistory.ts";
import { aggregateStageHistory, buildLiveStatsData } from "./liveStats.ts";
import { LiveStatsData } from "./liveStatsData.ts";
import { buildMonthlyHistory } from "./monthlyHistory.ts";
import { buildStageHistory } from "./stageHistory.ts";

const event = (overrides: Partial<EventMetaDescriptor> = {}) => {
  const meta = validateEventMeta({
    summary: "ライブ",
    category: "LIVE",
    liveType: "SOLO",
    date: "2026-10-01",
    acts: [{ title: "公演", types: ["LIVE"] }],
    ...overrides,
  });
  if (meta == undefined) {
    throw new Error("Invalid test event");
  }
  return meta;
};

const summarizeEvents = (events: EventMeta[], today: string) =>
  buildLiveStatsData(events, today).summary;

describe("生成データの累計サマリー", () => {
  it("集計日とサマリーを含む生成データをJSONとして検証できる", () => {
    const data = buildLiveStatsData([event()], "2026-11-15");
    const json: unknown = JSON.parse(JSON.stringify(data));
    expect(LiveStatsData.parse(json)).toEqual(data);
    expect(data.aggregatedOn).toBe("2026-11-15");
    expect(data.summary).toEqual({
      events: 1,
      stages: 1,
      days: 1,
      soloStages: 1,
      jointStages: 0,
    });
  });

  it("イベント数・重複を除いた出演日数・各ステージ数を集計する", () => {
    expect(
      summarizeEvents(
        [
          event({
            acts: [
              { title: "昼", types: ["LIVE"] },
              { title: "夜", types: ["LIVE"] },
              { title: "特典会", types: ["MEET_AND_GREET"] },
            ],
          }),
          event({ liveType: "FESTIVAL" }),
          event({ date: "2026-10-02", liveType: "HOSTED" }),
          event({ date: "2026-10-03", liveType: "JOINT" }),
          event({ date: "2026-10-04", liveType: "GUEST" }),
          event({ date: "2026-10-05", liveType: undefined }),
        ],
        "2026-11-07",
      ),
    ).toEqual({ events: 5, days: 4, stages: 6, soloStages: 2, jointStages: 3 });
  });

  it("当日以降・中止・延期・出演辞退と、ライブ出演のないイベントを除外する", () => {
    expect(
      summarizeEvents(
        [
          event({ status: "CANCELED" }),
          event({ status: "RESCHEDULED" }),
          event({ status: "WITHDRAWN" }),
          event({ date: "2026-11-07" }),
          event({ date: "2026-11-08" }),
          event({ acts: [{ title: "特典会", types: ["MEET_AND_GREET"] }] }),
          event({ acts: [{ title: "中止", types: ["LIVE"], status: "CANCELED" }] }),
          event({
            acts: [
              { title: "昼", types: ["LIVE"] },
              { title: "中止", types: ["LIVE"], status: "CANCELED" },
              { title: "延期", types: ["LIVE"], status: "RESCHEDULED" },
              { title: "辞退", types: ["LIVE"], status: "WITHDRAWN" },
            ],
          }),
        ],
        "2026-11-07",
      ),
    ).toEqual({ events: 1, days: 1, stages: 1, soloStages: 1, jointStages: 0 });
  });

  it("対象がなければすべて0を返す", () => {
    expect(summarizeEvents([], "2026-11-07")).toEqual({
      events: 0,
      days: 0,
      stages: 0,
      soloStages: 0,
      jointStages: 0,
    });
  });
});

describe("aggregateStageHistory", () => {
  const expectedCategories = {
    SOLO: "solo",
    HOSTED: "hosted",
    JOINT: "joint",
    FESTIVAL: "joint",
    GUEST: "event-live",
    INVITED_SOLO: "event-live",
    EVENT_LIVE: "event-live",
    RELEASE_EVENT: "release-event",
  } satisfies Record<LiveType, LiveCategory>;

  it.each(LiveTypeEnum.options)(
    "%s のイベント数とステージ数を共通カテゴリのキーで生成する",
    (liveType) => {
      const data = buildLiveStatsData(
        [
          event({
            liveType,
            acts: [
              { title: "昼", types: ["LIVE"] },
              { title: "夜", types: ["LIVE"] },
            ],
          }),
        ],
        "2026-11-12",
      );
      const expected = {
        total: 1,
        solo: 0,
        hosted: 0,
        joint: 0,
        "event-live": 0,
        "release-event": 0,
        [expectedCategories[liveType]]: 1,
      };
      expect(data.monthlyEvents).toEqual([{ month: "2026-10", ...expected }]);
      expect(data.careerYearlyEvents.at(-1)).toEqual({ year: 5, ...expected });
      const expectedStages = { ...expected, total: 2, [expectedCategories[liveType]]: 2 };
      expect(data.monthlyStages).toEqual([{ month: "2026-10", ...expectedStages }]);
      expect(data.careerYearlyStages.at(-1)).toEqual({ year: 5, ...expectedStages });
    },
  );

  it("主催対バンを対バンと分けてイベント数・ステージ数を集計する", () => {
    const history = aggregateStageHistory(
      [
        event({
          liveType: "HOSTED",
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
          ],
        }),
        event({ liveType: "JOINT" }),
        event({ liveType: "FESTIVAL" }),
      ],
      "2026-11-12",
    );
    const counts = {
      events: 3,
      count: 4,
      hostedEvents: 1,
      hostedStages: 2,
      jointEvents: 2,
      jointStages: 2,
      otherEvents: 0,
      otherStages: 0,
    };
    expect(history.monthly[0]).toMatchObject(counts);
    expect(history.careerYearly.at(-1)).toMatchObject(counts);
  });

  it("liveType がないイベントは有効なLIVE actがあっても集計しない", () => {
    const history = aggregateStageHistory(
      [
        event({
          liveType: undefined,
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
          ],
        }),
      ],
      "2026-11-12",
    );
    expect(history.monthly).toEqual([]);
    expect(history.monthlyEvents).toEqual([]);
    expect(history.careerYearlyEvents.every((row) => row.total === 0)).toBe(true);
    expect(history.careerYearly).toHaveLength(5);
    expect(
      history.careerYearly.every((row) => row.events === 0 && row.count === 0 && row.days === 0),
    ).toBe(true);
  });

  it("複数ステージのあるイベントも種別ごとに1件と数え、月別・活動年別に集計する", () => {
    const history = aggregateStageHistory(
      [
        event({
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
          ],
        }),
        event({ liveType: "JOINT" }),
        event({ liveType: "HOSTED" }),
        event({ liveType: "FESTIVAL" }),
        event({
          liveType: "RELEASE_EVENT",
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
          ],
        }),
        event({ liveType: "GUEST" }),
        event({ status: "CANCELED" }),
      ],
      "2026-11-12",
    );
    const counts = {
      events: 6,
      soloEvents: 1,
      hostedEvents: 1,
      jointEvents: 2,
      releaseEvents: 1,
      otherEvents: 1,
    };
    expect(history.monthly[0]).toMatchObject(counts);
    expect(history.careerYearly.at(-1)).toMatchObject(counts);
  });
  it("リリースイベントをイベント出演から分け、中止ステージは含めない", () => {
    const history = aggregateStageHistory(
      [
        event({
          liveType: "RELEASE_EVENT",
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
            { title: "中止", types: ["LIVE"], status: "CANCELED" },
          ],
        }),
        event({ liveType: "GUEST" }),
      ],
      "2026-11-12",
    );
    expect(history.monthly).toEqual([
      {
        month: "2026-10",
        events: 2,
        soloEvents: 0,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 1,
        otherEvents: 1,
        days: 1,
        count: 3,
        soloStages: 0,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 2,
        otherStages: 1,
      },
    ]);
    expect(history.careerYearly.at(-1)).toEqual({
      year: 5,
      events: 2,
      soloEvents: 0,
      hostedEvents: 0,
      jointEvents: 0,
      releaseEvents: 1,
      otherEvents: 1,
      days: 1,
      count: 3,
      soloStages: 0,
      hostedStages: 0,
      jointStages: 0,
      releaseEventStages: 2,
      otherStages: 1,
    });
  });
  it("月単位のステージ数と内訳を生成し、活動年は8月7日で区切る", () => {
    const history = aggregateStageHistory(
      [
        event({ date: "2023-08-06", liveType: "SOLO" }),
        event({ date: "2023-08-07", liveType: "FESTIVAL" }),
        event({ date: "2023-08-07", liveType: "HOSTED" }),
        event({ date: "2023-09-01", liveType: "GUEST" }),
        event({ date: "2023-09-02", status: "CANCELED" }),
        event({ date: "2023-09-03" }),
        event({ date: "2023-09-04" }),
      ],
      "2023-09-03",
    );
    expect(history.monthlyEvents).toEqual([
      {
        month: "2023-08",
        total: 3,
        solo: 1,
        hosted: 1,
        joint: 1,
        "event-live": 0,
        "release-event": 0,
      },
      {
        month: "2023-09",
        total: 1,
        solo: 0,
        hosted: 0,
        joint: 0,
        "event-live": 1,
        "release-event": 0,
      },
    ]);
    expect(history.careerYearlyEvents).toEqual([
      { year: 1, total: 1, solo: 1, hosted: 0, joint: 0, "event-live": 0, "release-event": 0 },
      { year: 2, total: 3, solo: 0, hosted: 1, joint: 1, "event-live": 1, "release-event": 0 },
    ]);
    expect(history.monthly).toEqual([
      {
        month: "2023-08",
        events: 3,
        soloEvents: 1,
        hostedEvents: 1,
        jointEvents: 1,
        releaseEvents: 0,
        otherEvents: 0,
        days: 2,
        count: 3,
        soloStages: 1,
        hostedStages: 1,
        jointStages: 1,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        month: "2023-09",
        events: 1,
        soloEvents: 0,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 1,
        days: 1,
        count: 1,
        soloStages: 0,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 1,
      },
    ]);
    expect(history.careerYearly).toEqual([
      {
        year: 1,
        events: 1,
        soloEvents: 1,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 1,
        count: 1,
        soloStages: 1,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        year: 2,
        events: 3,
        soloEvents: 0,
        hostedEvents: 1,
        jointEvents: 1,
        releaseEvents: 0,
        otherEvents: 1,
        days: 2,
        count: 3,
        soloStages: 0,
        hostedStages: 1,
        jointStages: 1,
        releaseEventStages: 0,
        otherStages: 1,
      },
    ]);
  });

  it("デビュー前の出演は月別にのみ含め、対象のない活動年は0件にする", () => {
    const history = aggregateStageHistory(
      [event({ date: "2022-08-06" }), event({ date: "2022-08-07" })],
      "2023-08-07",
    );
    expect(history.monthly).toEqual([
      {
        month: "2022-08",
        events: 2,
        soloEvents: 2,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 2,
        count: 2,
        soloStages: 2,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
    ]);
    expect(history.careerYearly).toEqual([
      {
        year: 1,
        events: 1,
        soloEvents: 1,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 1,
        count: 1,
        soloStages: 1,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        year: 2,
        events: 0,
        soloEvents: 0,
        hostedEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 0,
        count: 0,
        soloStages: 0,
        hostedStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
    ]);
  });

  it("デビュー前で出演がなければ空の配列を返す", () => {
    expect(aggregateStageHistory([], "2022-08-06")).toEqual({
      monthly: [],
      careerYearly: [],
      monthlyEvents: [],
      careerYearlyEvents: [],
      monthlyStages: [],
      careerYearlyStages: [],
    });
  });
});

it("外部主催のワンマンはイベント出演としてイベント数・ステージ数を月別と活動年別に集計する", () => {
  const history = aggregateStageHistory(
    [
      event({
        liveType: "INVITED_SOLO",
        acts: [
          { title: "昼", types: ["LIVE"] },
          { title: "夜", types: ["LIVE"] },
          { title: "特典会", types: ["MEET_AND_GREET"] },
        ],
      }),
    ],
    "2026-11-12",
  );
  const counts = {
    events: 1,
    count: 2,
    soloEvents: 0,
    soloStages: 0,
    hostedEvents: 0,
    jointEvents: 0,
    hostedStages: 0,
    jointStages: 0,
    releaseEvents: 0,
    releaseEventStages: 0,
    otherEvents: 1,
    otherStages: 2,
  };
  expect(history.monthly[0]).toMatchObject(counts);
  expect(history.careerYearly.at(-1)).toMatchObject(counts);
});

it("主催対バンを西暦・活動年・月別の合計と平均でも独立して集計する", () => {
  const data = {
    aggregatedOn: "2024-11-12",
    ...aggregateStageHistory(
      [
        event({ date: "2023-10-01", liveType: "HOSTED" }),
        event({
          date: "2024-10-01",
          liveType: "HOSTED",
          acts: [
            { title: "昼", types: ["LIVE"] },
            { title: "夜", types: ["LIVE"] },
          ],
        }),
        event({ date: "2024-10-02", liveType: "JOINT" }),
      ],
      "2024-11-12",
    ),
  };
  const stages = buildStageHistory(data);
  const events = buildEventHistory(data);
  expect(stages.calendar.at(-1)?.counts).toMatchObject({ hosted: 2, joint: 1 });
  expect(events.calendar.at(-1)?.counts).toMatchObject({ hosted: 1, joint: 1 });
  expect(stages.career.at(-1)?.counts).toMatchObject({ hosted: 2, joint: 1 });
  expect(events.career.at(-1)?.counts).toMatchObject({ hosted: 1, joint: 1 });
  expect(
    buildMonthlyHistory(data.monthlyStages, data.aggregatedOn, "total")[9]?.counts,
  ).toMatchObject({
    hosted: 3,
    joint: 1,
  });
  expect(
    buildMonthlyHistory(data.monthlyEvents, data.aggregatedOn, "total")[9]?.counts,
  ).toMatchObject({
    hosted: 2,
    joint: 1,
  });
  expect(
    buildMonthlyHistory(data.monthlyStages, data.aggregatedOn, "average")[9]?.counts,
  ).toMatchObject({
    hosted: 1,
    joint: 1 / 3,
  });
  expect(
    buildMonthlyHistory(data.monthlyEvents, data.aggregatedOn, "average")[9]?.counts,
  ).toMatchObject({
    hosted: 2 / 3,
    joint: 1 / 3,
  });
});

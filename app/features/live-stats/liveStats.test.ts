import { describe, expect, it } from "vitest";
import {
  validateEventMeta,
  type EventMeta,
  type EventMetaDescriptor,
} from "~/features/events/eventMeta.ts";
import { aggregateStageHistory } from "./liveStats.ts";
import { buildLiveStatsSummary } from "./liveStatsSummary.ts";

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
  buildLiveStatsSummary(aggregateStageHistory(events, today).monthly);

describe("月別集計からの累計サマリー", () => {
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
    const counts = { events: 6, soloEvents: 1, jointEvents: 3, releaseEvents: 1, otherEvents: 1 };
    expect(history.monthly[0]).toMatchObject(counts);
    expect(history.careerYearly.at(-1)).toMatchObject(counts);
  });
  it("リリースイベントをその他から分け、中止ステージは含めない", () => {
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
        jointEvents: 0,
        releaseEvents: 1,
        otherEvents: 1,
        days: 1,
        count: 3,
        soloStages: 0,
        jointStages: 0,
        releaseEventStages: 2,
        otherStages: 1,
      },
    ]);
    expect(history.careerYearly.at(-1)).toEqual({
      year: 5,
      events: 2,
      soloEvents: 0,
      jointEvents: 0,
      releaseEvents: 1,
      otherEvents: 1,
      days: 1,
      count: 3,
      soloStages: 0,
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
    expect(history.monthly).toEqual([
      {
        month: "2023-08",
        events: 3,
        soloEvents: 1,
        jointEvents: 2,
        releaseEvents: 0,
        otherEvents: 0,
        days: 2,
        count: 3,
        soloStages: 1,
        jointStages: 2,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        month: "2023-09",
        events: 1,
        soloEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 1,
        days: 1,
        count: 1,
        soloStages: 0,
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
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 1,
        count: 1,
        soloStages: 1,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        year: 2,
        events: 3,
        soloEvents: 0,
        jointEvents: 2,
        releaseEvents: 0,
        otherEvents: 1,
        days: 2,
        count: 3,
        soloStages: 0,
        jointStages: 2,
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
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 2,
        count: 2,
        soloStages: 2,
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
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 1,
        count: 1,
        soloStages: 1,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
      {
        year: 2,
        events: 0,
        soloEvents: 0,
        jointEvents: 0,
        releaseEvents: 0,
        otherEvents: 0,
        days: 0,
        count: 0,
        soloStages: 0,
        jointStages: 0,
        releaseEventStages: 0,
        otherStages: 0,
      },
    ]);
  });

  it("デビュー前で出演がなければ空の配列を返す", () => {
    expect(aggregateStageHistory([], "2022-08-06")).toEqual({ monthly: [], careerYearly: [] });
  });
});

it("外部主催のワンマンはその他としてイベント数・ステージ数を月別と活動年別に集計する", () => {
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
    jointEvents: 0,
    jointStages: 0,
    releaseEvents: 0,
    releaseEventStages: 0,
    otherEvents: 1,
    otherStages: 2,
  };
  expect(history.monthly[0]).toMatchObject(counts);
  expect(history.careerYearly.at(-1)).toMatchObject(counts);
});

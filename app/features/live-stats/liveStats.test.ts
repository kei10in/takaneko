import { describe, expect, it } from "vitest";
import { validateEventMeta, type EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { aggregateLiveStats } from "./liveStats.ts";

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

describe("aggregateLiveStats", () => {
  it("イベント数・重複を除いた出演日数・各ステージ数を集計する", () => {
    expect(
      aggregateLiveStats(
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
    ).toEqual({ events: 6, days: 5, stages: 7, soloStages: 2, jointStages: 3 });
  });

  it("当日以降・中止・延期・出演辞退と、ライブ出演のないイベントを除外する", () => {
    expect(
      aggregateLiveStats(
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
    expect(aggregateLiveStats([], "2026-11-07")).toEqual({
      events: 0,
      days: 0,
      stages: 0,
      soloStages: 0,
      jointStages: 0,
    });
  });
});

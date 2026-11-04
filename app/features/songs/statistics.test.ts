import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import {
  calculateSongStatistics,
  elapsedSince,
  monthlyPerformanceCounts,
  yearlyPerformanceCounts,
} from "./statistics.ts";
import { LivesForSong, SimpleSongActivity } from "./types.ts";

const activity = (date: string, slug: string, count = 1): SimpleSongActivity => ({
  event: { slug, title: slug, date, liveType: "SOLO" },
  segments: Array.from({ length: count }, (_, index) => ({ index, section: "main" })),
});
const data = (lives: SimpleSongActivity[]): LivesForSong => ({
  slug: "test",
  name: "テスト楽曲",
  count: lives.reduce((sum, live) => sum + live.segments.length, 0),
  costumeStats: [],
  lives,
});

describe("楽曲の統計", () => {
  it("同一公演での複数の披露を数え、公演数はイベント単位で数える", () => {
    const statistics = calculateSongStatistics(
      data([
        activity("2026-01-10", "latest", 2),
        activity("2026-01-01", "first"),
        activity("2026-01-10", "latest"),
      ]),
    );
    expect(statistics.performanceCount).toBe(4);
    expect(statistics.eventCount).toBe(2);
    expect(statistics.first?.date).toBe("2026-01-01");
    expect(statistics.first?.events.map((event) => event.slug)).toEqual(["first"]);
    expect(statistics.latest?.date).toBe("2026-01-10");
    expect(statistics.latest?.events.map((event) => event.slug)).toEqual(["latest"]);
  });

  it("最初の披露日の公演をまとめ、披露がない公演は含めない", () => {
    const statistics = calculateSongStatistics(
      data([
        activity("2025-12-01", "empty", 0),
        activity("2026-01-01", "night"),
        activity("2026-01-01", "day", 2),
        activity("2026-01-01", "day"),
      ]),
    );
    expect(statistics.first).toEqual({
      date: "2026-01-01",
      events: [activity("2026-01-01", "day").event, activity("2026-01-01", "night").event],
    });
    expect(calculateSongStatistics(data([])).first).toBeUndefined();
  });

  it("同日の昼夜・別会場・複数回の披露を1日にまとめて間隔を計算する", () => {
    const statistics = calculateSongStatistics(
      data([
        activity("2026-01-10", "last"),
        activity("2026-01-01", "night", 2),
        activity("2026-01-04", "middle"),
        activity("2026-01-01", "day"),
      ]),
    );
    expect(statistics.intervals).toEqual({ average: 4.5, longest: 6 });
  });

  it.each([
    { lives: [] },
    { lives: [activity("2026-01-01", "day"), activity("2026-01-01", "night")] },
  ])("異なる披露日が2日未満なら間隔を計算しない", ({ lives }) => {
    expect(calculateSongStatistics(data(lives)).intervals).toBeUndefined();
  });

  it("ライブ種別は披露回数で集計し、割合の分母も披露回数にする", () => {
    const joint = activity("2026-01-04", "joint");
    joint.event.liveType = "JOINT";
    const unknown = activity("2026-01-10", "unknown");
    unknown.event.liveType = undefined;
    const statistics = calculateSongStatistics(
      data([activity("2026-01-01", "solo", 2), joint, unknown]),
    );
    expect(statistics.liveTypes).toHaveLength(3);
    expect(statistics.liveTypes).toEqual(
      expect.arrayContaining([
        { name: "ワンマン", count: 2, percentage: 50 },
        { name: "不明", count: 1, percentage: 25 },
        { name: "対バン", count: 1, percentage: 25 },
      ]),
    );
  });

  it("衣装未登録・空配列は Unknown とし、使用回数順に並べる", () => {
    const live = activity("2026-01-01", "costumes", 4);
    live.segments[0].costumeNames = ["衣装 A", "衣装 B"];
    live.segments[1].costumeNames = ["衣装 A"];
    live.segments[2].costumeNames = [];
    expect(calculateSongStatistics(data([live])).costumes).toEqual([
      { costumeName: "Unknown", value: 2 },
      { costumeName: "衣装 A", value: 2 },
      { costumeName: "衣装 B", value: 1 },
    ]);
  });

  it("フェスと対バンの披露回数・割合を合算し、主催対バンは別に集計する", () => {
    const joint = activity("2026-01-01", "joint", 2);
    joint.event.liveType = "JOINT";
    const festival = activity("2026-01-02", "festival", 4);
    festival.event.liveType = "FESTIVAL";
    const hosted = activity("2026-01-03", "hosted", 3);
    hosted.event.liveType = "HOSTED";
    const guest = activity("2026-01-04", "guest");
    guest.event.liveType = "GUEST";

    expect(calculateSongStatistics(data([joint, festival, hosted, guest])).liveTypes).toEqual([
      { name: "対バン", count: 6, percentage: 60 },
      { name: "主催対バン", count: 3, percentage: 30 },
      { name: "ゲスト出演", count: 1, percentage: 10 },
    ]);
  });
});

describe("披露回数の推移", () => {
  const lives = [activity("2024-01-01", "past", 2), activity("2026-02-02", "recent", 3)];
  it("12か月を残し、今月と過去は0埋め、未来の月だけ null にする", () => {
    const today = new NaiveDate(2026, 4, 1);
    expect(monthlyPerformanceCounts(lives, 2026, today)).toEqual([
      { label: "1月", count: 0 },
      { label: "2月", count: 3 },
      { label: "3月", count: 0 },
      { label: "4月", count: 0 },
      { label: "5月", count: null },
      { label: "6月", count: null },
      { label: "7月", count: null },
      { label: "8月", count: null },
      { label: "9月", count: null },
      { label: "10月", count: null },
      { label: "11月", count: null },
      { label: "12月", count: null },
    ]);
    const past = monthlyPerformanceCounts(lives, 2024, today);
    expect(past).toHaveLength(12);
    expect(past[0].count).toBe(2);
    expect(past.slice(1).every((month) => month.count === 0)).toBe(true);
  });
  it("未来の年は12か月すべてをデータなしとして返す", () => {
    const months = monthlyPerformanceCounts([], 2027, new NaiveDate(2026, 4, 1));
    expect(months).toHaveLength(12);
    expect(months.every((month) => month.count === null)).toBe(true);
  });
  it("未来の月の記録が登録されていてもデータなしとする", () => {
    const months = monthlyPerformanceCounts(
      [activity("2026-12-01", "future", 4)],
      2026,
      new NaiveDate(2026, 4, 1),
    );
    expect(months[11].count).toBeNull();
  });
  it("記録のある最初の年から現在年までを年別にゼロ埋めする", () => {
    expect(yearlyPerformanceCounts(lives, new NaiveDate(2026, 4, 1))).toEqual([
      { label: "2024年", count: 2 },
      { label: "2025年", count: 0 },
      { label: "2026年", count: 3 },
    ]);
    expect(yearlyPerformanceCounts([], new NaiveDate(2027, 1, 1))).toEqual([
      { label: "2027年", count: 0 },
    ]);
  });
});

describe("初披露からの経過時間", () => {
  it("ブラウザ側の今日を入力として、年数・残り日数・通算日数を求める", () => {
    expect(elapsedSince("2022-08-07", new NaiveDate(2026, 8, 8))).toEqual({
      years: 4,
      days: 1,
      totalDays: 1462,
    });
  });
  it("うるう日の翌年は2月末を周年日として数える", () => {
    expect(elapsedSince("2024-02-29", new NaiveDate(2025, 2, 28))).toEqual({
      years: 1,
      days: 0,
      totalDays: 365,
    });
  });
});

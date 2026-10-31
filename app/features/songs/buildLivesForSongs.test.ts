import { describe, expect, it } from "vitest";
import { Act } from "~/features/events/act.ts";
import { EventModule } from "~/features/events/eventModule.ts";
import { parseSetlist } from "~/features/events/setlist.ts";
import { makeEventMetaForTest } from "~/features/events/testUtils.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { buildLivesForSongs } from "./buildLivesForSongs.ts";
import { LivesForSong } from "./types.ts";

const liveAct = (songs: string[], overrides: Partial<Act> = {}): Act => ({
  types: ["LIVE"],
  absent: [],
  links: [],
  setlist: parseSetlist(songs),
  ...overrides,
});

const event = (slug: string, date: string, acts: Act[], canceled = false): EventModule => ({
  slug,
  filename: `${slug}.ts`,
  Content: () => null,
  meta: makeEventMetaForTest({
    date,
    acts,
    liveType: "SOLO",
    status: canceled ? "CANCELED" : undefined,
  }),
});

const rateFor = (events: EventModule[]) =>
  buildLivesForSongs(events, new NaiveDate(2026, 2, 1)).find((song) => song.name === "ファンサ")
    ?.recentPerformanceRate;

describe("楽曲別ライブデータの披露率", () => {
  it("全 LIVE 枠に曲があり、ビルド日より前の公演を対象にする", () => {
    const events = [
      event("complete", "2026-01-10", [liveAct(["ファンサ"]), liveAct(["ユメムスビ"])]),
      event("repeated", "2026-01-11", [liveAct(["ファンサ", "ファンサ"])]),
      event("other", "2026-01-12", [liveAct(["ユメムスビ"])]),
      event("partial", "2026-01-13", [liveAct(["ファンサ"]), liveAct([])]),
      event("no-acts", "2026-01-14", []),
      event("no-live", "2026-01-15", [liveAct(["ファンサ"], { types: ["TALK"] })]),
      event("only-talk", "2026-01-16", [liveAct([], { types: ["TALK"] }), liveAct(["ファンサ"])]),
      event("canceled", "2026-01-17", [liveAct(["ファンサ"])], true),
      event("today", "2026-02-01", [liveAct(["ファンサ"])]),
      event("future", "2026-02-02", [liveAct(["ファンサ"])]),
    ];

    expect(rateFor(events)).toEqual({ performedCount: 3, eventCount: 4 });
    const data = buildLivesForSongs(events, new NaiveDate(2026, 2, 1))[0];
    expect(LivesForSong.safeParse(data).success).toBe(true);
  });

  it("対象となる直近20公演に絞り、同じ公演での複数回の披露は1公演として数える", () => {
    const events = Array.from({ length: 25 }, (_, index) =>
      event(`event-${index}`, `2026-01-${String(index + 1).padStart(2, "0")}`, [
        liveAct(index < 6 ? ["ファンサ", "ファンサ"] : ["ユメムスビ"]),
      ]),
    );

    expect(rateFor(events.toReversed())).toEqual({ performedCount: 1, eventCount: 20 });
  });

  it("対象公演がない場合は母数と披露した公演数を0にする", () => {
    expect(rateFor([])).toEqual({ performedCount: 0, eventCount: 0 });
  });

  it("中止された LIVE 枠と LIVE 以外の枠は披露率の対象に含めない", () => {
    const events = [
      event("canceled-song", "2026-01-01", [
        liveAct(["ファンサ"], { status: "CANCELED" }),
        liveAct(["ユメムスビ"]),
      ]),
      event("canceled-empty", "2026-01-02", [
        liveAct([], { status: "CANCELED" }),
        liveAct(["ファンサ"]),
      ]),
      event("withdrawn", "2026-01-03", [liveAct(["ファンサ"], { status: "WITHDRAWN" })]),
      event("talk-song", "2026-01-04", [
        liveAct(["ファンサ"], { types: ["TALK"] }),
        liveAct(["ユメムスビ"]),
      ]),
    ];
    expect(rateFor(events)).toEqual({ performedCount: 1, eventCount: 3 });
  });
});

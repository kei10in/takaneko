import { dedent } from "ts-dedent";
import { describe, expect, it } from "vitest";
import { Events } from "~/features/events/events";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { createAnnouncePost, formatEventForSocialMedia } from "./socialMedia";

describe("formatEventForSocialMedia", () => {
  const importEvent = async (slug: string) => {
    const em = await Events.importEventModuleBySlug(slug);
    if (em == undefined) {
      expect.fail("event module not found");
    }
    return em;
  };

  it("should format fes. with location", async () => {
    const em = await importEvent("2025-08-31_@JAM EXPO 2025");
    const s = formatEventForSocialMedia(em.meta);

    expect(s).toBe(dedent`
      🎤@JAM EXPO 2025
      📍横浜アリーナ
      `);
  });

  it("should format concert with location", async () => {
    const em = await importEvent("2025-08-07_3rd ファンミーティング 〜私たちの宣言式〜");
    const s = formatEventForSocialMedia(em.meta);

    expect(s).toBe(dedent`
        🎤3rd ファンミーティング 〜私たちの宣言式〜
        📍豊洲PIT
        `);
  });

  it("should format TV show with broadcast time", async () => {
    const em = await importEvent("2025-08-01_ぎふチャン テレビ「めっちゃぎふわかるてれび」");
    const s = formatEventForSocialMedia(em.meta);

    expect(s).toBe(dedent`
      📺ぎふチャン テレビ「めっちゃぎふわかるてれび」
      ⏰21:05〜21:54
    `);
  });

  it("should format magazine with broadcast time", async () => {
    const em = await importEvent("2025-09-04_雑誌「日経エンタテインメント！ 2025年10月号」");
    const s = formatEventForSocialMedia(em.meta);

    expect(s).toBe(dedent`
      📰日経エンタテインメント！ 2025年10月号
      🛒本日発売
      `);
  });
});

describe("createAnnouncePost", () => {
  it("should create announcement posts for today's events", async () => {
    const today = new NaiveDate(2025, 8, 7);
    const events = (await Events.importEventModulesByDate(today)).map((e) => e.meta);
    const posts = await createAnnouncePost(events, today);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toBe(dedent`
      🐈‍⬛きょうの #たかねこの予定🌸

      🎤3rd ファンミーティング 〜私たちの宣言式〜
      📍豊洲PIT

      https://takanekofan.app/calendar/2025/08/07
      `);
  });

  it("should create announcement posts for multiple events", async () => {
    const today = new NaiveDate(2025, 8, 8);
    const events = (await Events.importEventModulesByDate(today)).map((e) => e.meta);
    const posts = await createAnnouncePost(events, today);

    expect(posts).toHaveLength(1);

    expect(posts[0]).toBe(dedent`
      🐈‍⬛きょうの #たかねこの予定🌸

      🌸振替日「LARME×高嶺のなでしこ SPECIAL COLLABORATION WEEK」撮影会

      📺テレビ東京「歌のサンセット」
      ⏰17:30〜17:55

      🌸3rd ファンミーティング〜私たちの宣言式〜 開催記念イベント

      https://takanekofan.app/calendar/2025/08/08
      `);
  });
});

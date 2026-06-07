import { describe, expect, it } from "vitest";
import { isMusicEvent, ldJsonMusicEvent } from "./ldJsonMusicEvent";
import { makeEventMetaForTest } from "./testUtils";

describe("isMusicEvent", () => {
  it("returns false when liveType is missing", () => {
    const event = makeEventMetaForTest({ region: "東京", liveType: undefined });

    expect(isMusicEvent(event)).toBe(false);
  });

  it("returns true for events outside Japan when liveType is set", () => {
    const event = makeEventMetaForTest({ region: "ソウル", liveType: "SOLO" });

    expect(isMusicEvent(event)).toBe(true);
  });

  it("returns true when liveType is set", () => {
    const event = makeEventMetaForTest({ region: "東京", liveType: "RELEASE_EVENT" });

    expect(isMusicEvent(event)).toBe(true);
  });
});

describe("ldJsonMusicEvent", () => {
  it("returns undefined when the event is not a MusicEvent", () => {
    const event = makeEventMetaForTest({ region: "東京", liveType: undefined });

    expect(ldJsonMusicEvent(event)).toBeUndefined();
  });

  it("builds MusicEvent JSON-LD for a domestic live event", () => {
    const event = makeEventMetaForTest({
      title: "ワンマンライブ",
      summary: "ライブ",
      description: "出力しない説明",
      category: "LIVE",
      liveType: "SOLO",
      date: "2026-08-07",
      start: "19:00",
      end: "21:00",
      region: "東京",
      location: "豊洲PIT",
      images: [{ path: "/events/live.webp", ref: "https://example.com/live", tags: [] }],
      ticket: "https://example.com/ticket",
    });

    expect(ldJsonMusicEvent(event)).toEqual({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "MusicEvent",
        name: "ワンマンライブ",
        startDate: "2026-08-07T19:00+09:00",
        endDate: "2026-08-07T21:00+09:00",
        image: ["/events/live.webp"],
        location: {
          "@type": "Place",
          name: "豊洲PIT",
          address: {
            "@type": "PostalAddress",
            addressRegion: "東京",
            addressCountry: "JP",
          },
        },
        performer: {
          "@type": "MusicGroup",
          name: "高嶺のなでしこ",
        },
        offers: {
          "@type": "Offer",
          url: "https://example.com/ticket",
        },
      },
    });
  });

  it("returns undefined when the MusicEvent is outside Japan", () => {
    const event = makeEventMetaForTest({
      liveType: "SOLO",
      region: "ソウル",
      location: "YES24 LIVE HALL",
    });

    expect(ldJsonMusicEvent(event)).toBeUndefined();
  });

  it("builds MusicEvent JSON-LD for a release event with liveType", () => {
    const event = makeEventMetaForTest({
      category: "EVENT",
      liveType: "RELEASE_EVENT",
      region: "埼玉",
    });

    const result = ldJsonMusicEvent(event);

    expect(result).toEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "MusicEvent",
        startDate: "2025-08-01",
      }),
    });
  });

  it("normalizes late-night time notation", () => {
    const event = makeEventMetaForTest({
      liveType: "SOLO",
      region: "東京",
      date: "2026-06-09",
      start: "27:00",
      end: "27:30",
    });

    expect(ldJsonMusicEvent(event)).toEqual({
      "script:ld+json": expect.objectContaining({
        startDate: "2026-06-10T03:00+09:00",
        endDate: "2026-06-10T03:30+09:00",
      }),
    });
  });

  it("maps event statuses", () => {
    const canceled = makeEventMetaForTest({
      liveType: "SOLO",
      region: "東京",
      status: "CANCELED",
    });
    const rescheduled = makeEventMetaForTest({
      liveType: "SOLO",
      region: "東京",
      status: "RESCHEDULED",
    });
    const withdrawn = makeEventMetaForTest({
      liveType: "SOLO",
      region: "東京",
      status: "WITHDRAWN",
    });

    expect(ldJsonMusicEvent(canceled)).toEqual({
      "script:ld+json": expect.objectContaining({
        eventStatus: "https://schema.org/EventCancelled",
      }),
    });
    expect(ldJsonMusicEvent(rescheduled)).toEqual({
      "script:ld+json": expect.objectContaining({
        eventStatus: "https://schema.org/EventPostponed",
      }),
    });
    expect(ldJsonMusicEvent(withdrawn)).toEqual({
      "script:ld+json": expect.not.objectContaining({
        eventStatus: expect.anything(),
      }),
    });
  });
});

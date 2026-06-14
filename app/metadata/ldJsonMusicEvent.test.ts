import { MusicEvent } from "schema-dts";
import { assert, describe, expect, expectTypeOf, it } from "vitest";
import type { EventModule } from "~/features/events/eventModule";
import { Events } from "~/features/events/events";
import { makeEventMetaForTest } from "~/features/events/testUtils";
import { LdJsonMusicEvent, musicEventDocument } from "./ldJsonMusicEvent";

expectTypeOf<LdJsonMusicEvent>().toExtend<MusicEvent>();

describe("MusicEvent JSON-LD for Google Event structured data", async () => {
  const allEvents = await Events.importAllEventModules();
  const representativeEvents = [
    {
      caseName: "solo live",
      event: eventByFilename(
        allEvents,
        "2025/02/2025-02-14_ワンマンライブ 2025 〜Cute for life〜.ts",
      ),
    },
    {
      caseName: "release event with mini live",
      event: eventByFilename(
        allEvents,
        "2025/12/2025-12-17_1st アルバム「見上げるたびに、恋をする。」リリースイベント@ダイバーシティ東京.ts",
      ),
    },
    {
      caseName: "hosted live festival",
      event: eventByFilename(
        allEvents,
        "2025/10/2025-10-29_たかねこフェス vol.5 〜ハロウィンSP〜.ts",
      ),
    },
    {
      caseName: "guest festival appearance",
      event: eventByFilename(allEvents, "2025/08/2025-08-31_@JAM EXPO 2025.ts"),
    },
  ];

  describe.each(representativeEvents)("$caseName: $event.filename", ({ event }) => {
    const id = `https://takanekofan.app/events/${event.slug}#music-event`;
    const document = musicEventDocument(event.meta, id);

    it("emits JSON-LD", () => {
      expect(document).toBeDefined();
    });

    assert(document != undefined);

    it("uses an Event subtype supported by Google Event structured data", () => {
      expect(document?.["@type"]).toBe("MusicEvent");
    });

    it("has a stable JSON-LD node id", () => {
      expect(document?.["@id"]).toBe(id);
    });

    it("has a non-empty event name", () => {
      expect(document?.name).toEqual(expect.any(String));
      expect(document?.name).not.toBe("");
    });

    it("has a Google-compatible startDate", () => {
      expect(document?.startDate).toEqual(expect.any(String));
      expect(document?.startDate).toMatch(
        /^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z))$/,
      );
    });

    it("has a Place location", () => {
      assert(document.location != undefined);
      expect(document.location).toEqual(
        expect.objectContaining({
          "@type": "Place",
        }),
      );
    });

    it("has a non-empty venue name", () => {
      assert(document.location != undefined);
      expect(document.location).toMatchObject({
        name: expect.stringMatching(/\S/),
      });
    });

    it("has a PostalAddress", () => {
      expect(document.location).toMatchObject({
        address: expect.objectContaining({
          "@type": "PostalAddress",
        }),
      });
    });

    it("has addressRegion as recognizable address information", () => {
      expect(document.location).toMatchObject({
        address: expect.objectContaining({
          addressRegion: expect.stringMatching(/\S/),
        }),
      });
    });

    it("has addressCountry", () => {
      expect(document.location).toMatchObject({
        address: expect.objectContaining({
          addressCountry: expect.stringMatching(/\S/),
        }),
      });
    });

    it("emits only absolute HTTP image URLs in Google-supported formats", () => {
      assert(typeof document.image === "string");
      expect(document).toMatchObject({
        image: expect.stringMatching(/^https?:\/\/.*\.(jpe?g|png|webp)$/i),
      });
    });

    it("does not emit offers", () => {
      expect(document).not.toHaveProperty("offers");
    });

    it("has a non-empty performer name when performer is present", () => {
      expect(document.performer).toBeDefined();
      expect(document.performer).toMatchObject({
        "@type": "MusicGroup",
        name: expect.stringMatching(/\S/),
      });
    });
  });

  it("does not emit a Place with an empty name", () => {
    const document = musicEventDocument(
      makeEventMetaForTest({
        liveType: "GUEST",
        location: "",
        region: "東京",
      }),
      "https://takanekofan.app/events/2025-08-01_live#music-event",
    );

    expect(document).toBeUndefined();
  });

  it("does not emit MusicEvent JSON-LD for withdrawn appearances", () => {
    const document = musicEventDocument(
      makeEventMetaForTest({
        liveType: "GUEST",
        location: "Spotify O-EAST",
        region: "東京",
        status: "WITHDRAWN",
      }),
      "https://takanekofan.app/events/2025-08-01_live#music-event",
    );

    expect(document).toBeUndefined();
  });
});

const eventByFilename = (events: EventModule[], filename: string): EventModule => {
  const event = events.find((event) => event.filename.endsWith(filename));
  assert(event != undefined, `Event not found: ${filename}`);
  assert(
    event.meta.liveType != undefined,
    `Representative event must be a MusicEvent: ${filename}`,
  );
  return event;
};

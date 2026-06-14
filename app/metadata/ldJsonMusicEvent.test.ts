import { assert, describe, expect, it } from "vitest";
import type { EventModule } from "~/features/events/eventModule";
import { Events } from "~/features/events/events";
import { musicEventDocument } from "./ldJsonMusicEvent";

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
      expect(document.location.name).toEqual(expect.any(String));
      expect(document.location.name).not.toBe("");
    });

    it("does not use the event name as the venue name", () => {
      assert(document.location != undefined);
      expect(document.location.name).not.toBe(document.name);
    });

    it("has a PostalAddress", () => {
      assert(document.location != undefined);
      expect(document.location.address).toEqual(
        expect.objectContaining({
          "@type": "PostalAddress",
        }),
      );
    });

    it("has addressRegion as recognizable address information", () => {
      const location = document.location;
      if (location == undefined) {
        throw new Error("Expected location to be defined");
      }
      expect(location.address.addressRegion).toEqual(expect.any(String));
      expect(location.address.addressRegion).not.toBe("");
    });

    it("has addressCountry", () => {
      const location = document.location;
      if (location == undefined) {
        throw new Error("Expected location to be defined");
      }
      expect(location.address.addressCountry).toEqual(expect.any(String));
      expect(location.address.addressCountry).not.toBe("");
    });

    it("emits only absolute HTTP image URLs in Google-supported formats", () => {
      assert(document.image != undefined);
      expect(document.image.length).toBeGreaterThan(0);
      document.image.forEach((image) => {
        expect(image).toEqual(expect.any(String));
        expect(image).toMatch(/^https?:\/\//);
        expect(new URL(image).pathname).toMatch(/\.(jpe?g|png|webp)$/i);
      });
    });

    it("does not emit offers", () => {
      expect(document).not.toHaveProperty("offers");
    });

    it("has a non-empty performer name when performer is present", () => {
      expect(document.performer["@type"]).toBe("MusicGroup");
      expect(document.performer.name).toEqual(expect.any(String));
      expect(document.performer.name).not.toBe("");
    });
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

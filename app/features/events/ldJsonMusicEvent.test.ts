import { assert, describe, expect, it } from "vitest";
import type { EventModule } from "./eventModule";
import { Events } from "./events";
import { ldJsonMusicEvent } from "./ldJsonMusicEvent";

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
      caseName: "live event with ticket URL",
      event: eventByFilename(allEvents, "2025/12/2025-12-25_たかねこクリスマスパーティー2025.ts"),
    },
  ];

  describe.each(representativeEvents)("$caseName: $event.filename", ({ event }) => {
    const document = ldJsonDocument(ldJsonMusicEvent(event.meta));
    const location = recordField(document, "location");
    const address = recordField(location, "address");
    const performer = recordField(document, "performer");

    it("emits JSON-LD", () => {
      expect(document).toBeDefined();
    });

    it("uses schema.org context", () => {
      expect(document?.["@context"]).toBe("https://schema.org");
    });

    it("uses an Event subtype supported by Google Event structured data", () => {
      expect(document?.["@type"]).toBe("MusicEvent");
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
      expect(location?.["@type"]).toBe("Place");
    });

    it("has a non-empty venue name", () => {
      expect(location?.name).toEqual(expect.any(String));
      expect(location?.name).not.toBe("");
    });

    it("does not use the event name as the venue name", () => {
      expect(location?.name).not.toBe(document?.name);
    });

    it("has a PostalAddress", () => {
      expect(address?.["@type"]).toBe("PostalAddress");
    });

    it("has addressRegion as recognizable address information", () => {
      expect(address?.addressRegion).toEqual(expect.any(String));
      expect(address?.addressRegion).not.toBe("");
    });

    it("has addressCountry", () => {
      expect(address?.addressCountry).toEqual(expect.any(String));
      expect(address?.addressCountry).not.toBe("");
    });

    it("emits only absolute HTTP image URLs in Google-supported formats", () => {
      const images = arrayField(document, "image");

      expect(images.length).toBeGreaterThan(0);
      images.forEach((image) => {
        expect(image).toEqual(expect.any(String));
        expect(image).toMatch(/^https?:\/\//);
        assert(typeof image === "string");
        expect(new URL(image).pathname).toMatch(/\.(jpe?g|png|webp)$/i);
      });
    });

    it("emits a valid Offer when offers are present", () => {
      const offers = arrayField(document, "offers");

      offers.forEach((offer) => {
        expect(offer).toEqual(expect.any(Object));
        assert(isRecord(offer));
        expect(offer["@type"]).toBe("Offer");
        expect(offer.url).toEqual(expect.any(String));
        expect(offer.url).toMatch(/^https?:\/\//);
      });
    });

    it("has a non-empty performer name when performer is present", () => {
      if (performer == undefined) {
        expect(performer).toBeUndefined();
        return;
      }

      expect(performer.name).toEqual(expect.any(String));
      expect(performer.name).not.toBe("");
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

const ldJsonDocument = (
  meta: ReturnType<typeof ldJsonMusicEvent>,
): Record<string, unknown> | undefined => {
  if (meta == undefined) {
    return undefined;
  }

  const document = Object.entries(meta).find(([key]) => key === "script:ld+json")?.[1];
  return isRecord(document) ? document : undefined;
};

const recordField = (
  record: Record<string, unknown> | undefined,
  key: string,
): Record<string, unknown> | undefined => {
  if (record == undefined) {
    return undefined;
  }

  const value = record[key];
  return isRecord(value) ? value : undefined;
};

const arrayField = (record: Record<string, unknown> | undefined, key: string): unknown[] => {
  if (record == undefined) {
    return [];
  }

  const value = record[key];
  if (value == undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value != null && !Array.isArray(value);
};

import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { allAssetFiles } from "~/utils/tests/asset";
import { extractURLsFromComponent } from "~/utils/tests/react";
import { ALL_EVENTS, loadEventModule, loadEvents, loadEventsInDay } from "./events";

describe("loadEvents", () => {
  it("should load events for the given month", () => {
    const month: NaiveMonth = new NaiveMonth(2024, 8);
    const events = loadEvents(month);

    expect(events.length).toBeGreaterThan(0);

    events.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.filename).toBeDefined();
      expect(event.meta).toBeDefined();
    });

    expect(events).toContainEqual(
      expect.objectContaining({
        id: "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会",
        filename:
          "./2024/08/2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会.mdx",
      }),
    );
  });
});

describe("loadEventsInDay", () => {
  it("should load events for the given date", () => {
    const date = new NaiveDate(2024, 8, 15);
    const events = loadEventsInDay(date);

    expect(events.length).toBeGreaterThan(0);

    events.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.filename).toBeDefined();
      expect(event.meta).toBeDefined();
    });

    expect(events[0]).toMatchObject({
      filename: "./2024/08/2024-08-15_NEO KASSEN 2024.mdx",
      id: "2024-08-15_NEO KASSEN 2024",
    });

    expect(events[1]).toMatchObject({
      filename: "./2024/08/2024-08-15_まいにちフェス2024 produced by au.mdx",
      id: "2024-08-15_まいにちフェス2024 produced by au",
    });
  });
});

describe("loadEventModule", () => {
  it("should load event module for the given event id", () => {
    const eventId =
      "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会";
    const event = loadEventModule(eventId);

    expect(event).toMatchObject({
      id: "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会",
      filename:
        "./2024/08/2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会.mdx",
    });
  });
});

describe("event module", () => {
  const AllAssets = allAssetFiles();

  describe.each(Object.entries(ALL_EVENTS))("Event: %s", (filename, event) => {
    it("should contains valid image reference in meta", () => {
      const path = event.meta.image?.path;
      if (path == undefined || path == "") {
        return;
      }
      expect(AllAssets).toContain(path);
    });

    it("should contains valid image reference in content", () => {
      const Content = event.Content;
      const urls = extractURLsFromComponent(<Content />)
        .filter((url) => !isAbsoluteURL(url))
        .map((url) => decodeURIComponent(url));

      urls.forEach((url) => {
        expect(AllAssets).toContain(url);
      });
    });
  });
});

const isAbsoluteURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const a = "〜 〜";
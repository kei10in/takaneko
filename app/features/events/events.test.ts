import { describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { loadEventModule, loadEvents, loadEventsInDay } from "./events";

describe("loadEvents", () => {
  it("should load events for the given month", async () => {
    const month: NaiveMonth = new NaiveMonth(2024, 8);
    const events = await loadEvents(month);

    expect(events.length).toBeGreaterThan(0);

    events.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.filename).toBeDefined();
      expect(event.meta).toBeDefined();
    });

    expect(events[0]).toMatchObject({
      id: "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会",
      filename:
        "./2024/08/2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会.mdx",
    });
  });
});

describe("loadEventsInDay", () => {
  it("should load events for the given date", async () => {
    const date = new NaiveDate(2024, 8, 15);
    const events = await loadEventsInDay(date);

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
  it("should load event module for the given event id", async () => {
    const eventId =
      "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会";
    const event = await loadEventModule(eventId);

    expect(event).toMatchObject({
      id: "2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会",
      filename:
        "./2024/08/2024-08-10_「高嶺のなでしこ 2nd ファンミーティング〜成長発表会〜」開催&2周年記念個別サイン会.mdx",
    });
  });
});

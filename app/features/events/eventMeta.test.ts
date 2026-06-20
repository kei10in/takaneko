import { describe, expect, it } from "vitest";
import { compareEventMeta, compareEventStatus, validateEventMeta } from "./eventMeta";
import { makeEventMetaForTest } from "./testUtils";

describe("compareEventMeta", () => {
  it("should compare by date first", () => {
    const eventA = makeEventMetaForTest({ summary: "Event A", date: "2025-08-01" });
    const eventB = makeEventMetaForTest({ summary: "Event B", date: "2025-08-02" });

    expect(compareEventMeta(eventA, eventB)).toBeLessThan(0);
    expect(compareEventMeta(eventB, eventA)).toBeGreaterThan(0);
  });

  it("should compare by status when dates are equal", () => {
    const normalEvent = makeEventMetaForTest({ summary: "Normal Event", status: undefined });
    const rescheduledEvent = makeEventMetaForTest({
      summary: "Rescheduled Event",
      status: "RESCHEDULED",
    });
    const canceledEvent = makeEventMetaForTest({ summary: "Canceled Event", status: "CANCELED" });
    const withdrawnEvent = makeEventMetaForTest({
      summary: "Withdrawn Event",
      status: "WITHDRAWN",
    });

    expect(compareEventMeta(normalEvent, rescheduledEvent)).toBeLessThan(0);
    expect(compareEventMeta(rescheduledEvent, withdrawnEvent)).toBeLessThan(0);
    expect(compareEventMeta(withdrawnEvent, canceledEvent)).toBeLessThan(0);
  });

  it("should compare by start time when date and status are equal", () => {
    const earlyEvent = makeEventMetaForTest({ start: "18:00" });
    const lateEvent = makeEventMetaForTest({ start: "19:00" });

    expect(compareEventMeta(earlyEvent, lateEvent)).toBeLessThan(0);
    expect(compareEventMeta(lateEvent, earlyEvent)).toBeGreaterThan(0);
  });

  it("should use act start time when event start time is not available", () => {
    const eventWithActStart = makeEventMetaForTest({
      acts: [{ types: [], start: "18:00", absent: [], setlist: [], links: [] }],
    });

    const eventWithEventStart = makeEventMetaForTest({
      start: "19:00",
    });

    expect(compareEventMeta(eventWithActStart, eventWithEventStart)).toBeLessThan(0);
  });

  it("should return 0 for identical events", () => {
    const event = makeEventMetaForTest({});

    expect(compareEventMeta(event, event)).toBe(0);
  });
});

describe("compareEventStatus", () => {
  it("should order statuses correctly", () => {
    expect(compareEventStatus(undefined, "RESCHEDULED")).toBeLessThan(0);
    expect(compareEventStatus("RESCHEDULED", "WITHDRAWN")).toBeLessThan(0);
    expect(compareEventStatus("WITHDRAWN", "CANCELED")).toBeLessThan(0);
    expect(compareEventStatus(undefined, undefined)).toBe(0);
    expect(compareEventStatus("CANCELED", "RESCHEDULED")).toBeGreaterThan(0);
  });
});

describe("validateEventMeta", () => {
  it("defaults keywords to an empty array", () => {
    const meta = validateEventMeta({
      summary: "Test Event",
      category: "LIVE",
      date: "2025-08-01",
    });

    expect(meta?.keywords).toEqual([]);
  });

  it("keeps keywords for search metadata", () => {
    const meta = validateEventMeta({
      summary: "Test Event",
      category: "LIVE",
      date: "2025-08-01",
      keywords: ["別名", "略称"],
    });

    expect(meta?.keywords).toEqual(["別名", "略称"]);
  });
});

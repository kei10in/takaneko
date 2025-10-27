import { describe, expect, it } from "vitest";
import { makeIcs } from "./ical";
import { makeEventMetaForTest } from "./testUtils";

describe("makeIcs", () => {
  it("should return ics object with filename and dataUrl when valid meta is provided", async () => {
    const id = "2025-08-07_test-event";
    const meta = makeEventMetaForTest({ date: "2025-08-07", summary: "Test Event" });

    const result = await makeIcs(id, meta);

    expect(result).toEqual({
      filename: "2025-08-07_Test Event.ics",
      dataUrl: expect.stringContaining("data:text/calendar;charset=utf-8,"),
    });
  });
});

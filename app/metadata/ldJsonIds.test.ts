import { describe, expect, it } from "vitest";
import { LdJsonIds } from "./ldJsonIds";

describe("LdJsonIds", () => {
  it("builds a MusicEvent node id from the canonical event URL", () => {
    expect(LdJsonIds.musicEvent("https://takanekofan.app/events/2025-02-14_live")).toBe(
      "https://takanekofan.app/events/2025-02-14_live#music-event",
    );
  });
});

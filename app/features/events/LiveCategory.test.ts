import { describe, expect, it } from "vitest";
import { LiveTypeEnum, type LiveType } from "~/features/events/EventType.ts";
import { getLiveCategory, type LiveCategory } from "./LiveCategory.ts";

describe("getLiveCategory", () => {
  const expectedCategories = {
    SOLO: "solo",
    HOSTED: "hosted",
    JOINT: "joint",
    FESTIVAL: "joint",
    GUEST: "event-live",
    INVITED_SOLO: "event-live",
    EVENT_LIVE: "event-live",
    RELEASE_EVENT: "release-event",
  } satisfies Record<LiveType, LiveCategory>;

  it.each(LiveTypeEnum.options)("%s に対応するライブカテゴリを返す", (liveType) => {
    expect(getLiveCategory(liveType)).toBe(expectedCategories[liveType]);
  });
});

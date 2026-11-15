import { describe, expect, expectTypeOf, it } from "vitest";
import { LiveTypeEnum, type LiveType } from "~/features/events/EventType.ts";
import { getLiveCategory, liveCategoryColor, type LiveCategory } from "./LiveCategory.ts";

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
    expectTypeOf(getLiveCategory(liveType)).toEqualTypeOf<LiveCategory>();
    expect(getLiveCategory(liveType)).toBe(expectedCategories[liveType]);
  });
});

describe("liveCategoryColor", () => {
  it.each<{ category: LiveCategory; color: string }>([
    { category: "solo", color: "bg-nadeshiko-700" },
    { category: "hosted", color: "bg-blue-300" },
    { category: "joint", color: "bg-amber-300" },
    { category: "event-live", color: "bg-amber-400" },
    { category: "release-event", color: "bg-violet-400" },
  ])("$category の背景色を返す", ({ category, color }) => {
    expect(liveCategoryColor(category)).toBe(color);
  });
});

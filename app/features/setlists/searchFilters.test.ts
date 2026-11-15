import { expect, it } from "vitest";
import { LiveType, LiveTypeEnum } from "~/features/events/EventType.ts";
import { SetlistLiveFilters, type SetlistSelectedLiveFilterType } from "./searchFilters.ts";

// 種類を追加した際は分類の判断を必須にし、実際の条件との一致をテストする。
const expectedFilters = {
  [LiveType.SOLO]: "solo",
  [LiveType.HOSTED]: "hosted",
  [LiveType.JOINT]: "joint",
  [LiveType.GUEST]: "joint",
  [LiveType.FESTIVAL]: "joint",
  [LiveType.INVITED_SOLO]: "event-live",
  [LiveType.EVENT_LIVE]: "event-live",
  [LiveType.RELEASE_EVENT]: "release-event",
} satisfies Record<LiveType, SetlistSelectedLiveFilterType>;

it.each(LiveTypeEnum.options)("%s は「すべて」と対応する種類で検索できる", (liveType) => {
  expect(
    SetlistLiveFilters.filter((item) => item.predicate(liveType)).map((item) => item.name),
  ).toEqual(["all", expectedFilters[liveType]]);
});

it("種類未設定のイベントは「すべて」でのみ検索できる", () => {
  expect(
    SetlistLiveFilters.filter((item) => item.predicate(undefined)).map((item) => item.name),
  ).toEqual(["all"]);
});

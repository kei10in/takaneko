import { z } from "zod/v4";
import { LiveType } from "~/features/events/EventType";

export const SetlistYearFilterStart = 2022;
export const SetlistYearFilterEnd = new Date().getFullYear();

export const SetlistYearFilters = Array.from(
  { length: SetlistYearFilterEnd - SetlistYearFilterStart + 1 },
  (_, i) => (SetlistYearFilterStart + i).toString(),
)
  .toReversed()
  .map((x) => ({ value: x, label: `${x} 年` }));

export const SetlistLiveFilterTypeEnum = z.enum([
  "all",
  "solo",
  "hosted",
  "joint",
  "event-live",
  "release-event",
]);
export const SetlistLiveFilterType = SetlistLiveFilterTypeEnum.enum;
export type SetlistLiveFilterType = z.infer<typeof SetlistLiveFilterTypeEnum>;

export interface SetlistLiveFilter {
  display: string;
  name: SetlistLiveFilterType;
  predicate: (liveType: LiveType | undefined) => boolean;
}

export const SetlistLiveFilters: SetlistLiveFilter[] = [
  {
    display: "すべて",
    name: "all",
    predicate: () => true,
  },
  {
    display: "ワンマン",
    name: "solo",
    predicate: (liveType) => liveType === LiveType.SOLO,
  },
  {
    display: "主催対バン",
    name: "hosted",
    predicate: (liveType) => liveType === LiveType.HOSTED,
  },
  {
    display: "対バン",
    name: "joint",
    predicate: (liveType) =>
      liveType === LiveType.JOINT || liveType === LiveType.GUEST || liveType === LiveType.FESTIVAL,
  },
  {
    display: "イベント出演",
    name: "event-live",
    predicate: (liveType) => liveType === LiveType.EVENT_LIVE,
  },
  {
    display: "リリース イベント",
    name: "release-event",
    predicate: (liveType) => liveType === LiveType.RELEASE_EVENT,
  },
];

export interface SetlistSearchFilters {
  q: string;
  year: string;
  type: SetlistLiveFilterType | "";
  song: string;
  costume: string;
}

export const defaultSetlistSearchFilters = (): SetlistSearchFilters => {
  return {
    q: "",
    year: "",
    type: "",
    song: "",
    costume: "",
  };
};

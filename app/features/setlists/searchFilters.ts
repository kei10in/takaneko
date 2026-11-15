import { z } from "zod/v4";
import {
  liveCategories,
  LiveCategoryEnum,
  type LiveCategory,
} from "~/features/events/LiveCategory.ts";

export const SetlistYearFilterStart = 2022;
export const SetlistYearFilterEnd = new Date().getFullYear();

export const SetlistYearFilters = Array.from(
  { length: SetlistYearFilterEnd - SetlistYearFilterStart + 1 },
  (_, i) => (SetlistYearFilterStart + i).toString(),
)
  .toReversed()
  .map((x) => ({ value: x, label: `${x} 年` }));

export const SetlistLiveFilterTypeEnum = z.enum(["all", ...LiveCategoryEnum.options]);
export const SetlistLiveFilterType = SetlistLiveFilterTypeEnum.enum;
export type SetlistLiveFilterType = z.infer<typeof SetlistLiveFilterTypeEnum>;

export interface SetlistLiveFilter {
  display: string;
  name: SetlistLiveFilterType;
}

export const SetlistLiveFilters: SetlistLiveFilter[] = [
  { display: "すべて", name: "all" },
  { display: liveCategories.solo.name, name: "solo" },
  { display: liveCategories.hosted.name, name: "hosted" },
  { display: liveCategories.joint.name, name: "joint" },
  { display: liveCategories["event-live"].name, name: "event-live" },
  { display: liveCategories["release-event"].name, name: "release-event" },
];

export interface SetlistSearchFilters {
  q: string;
  year: string[];
  type: LiveCategory[];
  song: string;
  costume: string;
  isFirstPerformance: boolean;
  isCover: boolean;
}

export const defaultSetlistSearchFilters = (): SetlistSearchFilters => {
  return {
    q: "",
    year: [],
    type: [],
    song: "",
    costume: "",
    isFirstPerformance: false,
    isCover: false,
  };
};

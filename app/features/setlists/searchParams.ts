import { AllStageCostumes } from "~/features/costumes/costumesStage.ts";
import { PerformedSongs } from "~/features/songs/songsFiltered.ts";
import {
  SetlistLiveFilterTypeEnum,
  SetlistSearchFilters,
  SetlistYearFilters,
} from "./searchFilters.ts";

export const readSetlistSearchParams = (params: URLSearchParams): SetlistSearchFilters => ({
  q: params.get("q") ?? "",
  year: [...new Set(params.getAll("y"))].filter((value) =>
    SetlistYearFilters.some((year) => year.value === value),
  ),
  type: [...new Set(params.getAll("t"))].flatMap((value) => {
    const result = SetlistLiveFilterTypeEnum.safeParse(value);
    return result.success && result.data !== "all" ? [result.data] : [];
  }),
  song: PerformedSongs.find((song) => song.slug === params.get("s"))?.slug ?? "",
  costume: AllStageCostumes.find((costume) => costume.slug === params.get("costume"))?.slug ?? "",
  isFirstPerformance: params.get("first") === "true",
  isCover: params.get("cover") === "true",
});

export const writeSetlistSearchParams = (
  currentParams: URLSearchParams,
  filters: SetlistSearchFilters,
): URLSearchParams => {
  const params = new URLSearchParams(currentParams);
  const values = {
    q: filters.q,
    y: filters.year,
    t: filters.type,
    s: filters.song,
    costume: filters.costume,
    first: filters.isFirstPerformance,
    cover: filters.isCover,
  };
  Object.entries(values).forEach(([key, value]) => {
    params.delete(key);
    if (Array.isArray(value)) {
      [...new Set(value)].forEach((item) => params.append(key, item));
    } else if (value !== "" && value !== false) {
      params.set(key, String(value));
    }
  });
  return params;
};

import { AllStageCostumes } from "../costumes/costumesStage";
import { ALL_SONGS } from "../songs/songs";
import {
  SetlistLiveFilters,
  SetlistSearchFilters,
  SetlistSelectedLiveFilterType,
} from "./searchFilters";
import { containsAllTokens, searchTokens } from "./searchText";
import { SetlistAct, SetlistEvent, SetlistSearchResult } from "./types";

export const filterSetlistEvents = (
  events: SetlistEvent[],
  filters: SetlistSearchFilters,
): SetlistSearchResult[] => {
  const tokens = searchTokens(filters.q);

  return events.flatMap((event): SetlistSearchResult[] => {
    if (
      filters.year.length > 0 &&
      !filters.year.some((year) => event.date.startsWith(`${year}-`))
    ) {
      return [];
    }

    if (
      filters.type.length > 0 &&
      !filters.type.some((filter) => matchesLiveTypeFilter(filter, event))
    ) {
      return [];
    }

    const eventMatchesQuery =
      tokens.length == 0 || containsAllTokens(event.eventSearchText, tokens);
    const matchedActIndexes = event.acts.flatMap((act, index) => {
      if (
        !matchesSongAndCostumeFilters(filters.song, filters.costume, act) ||
        !matchesFirstPerformanceFilter(filters.isFirstPerformance, act)
      ) {
        return [];
      }

      const combinedSearchText = `${event.eventSearchText} ${act.searchText}`;
      const actMatchesQuery = eventMatchesQuery || containsAllTokens(combinedSearchText, tokens);
      if (!actMatchesQuery) {
        return [];
      }

      return [index];
    });

    if (matchedActIndexes.length == 0) {
      return [];
    }

    return [{ event, matchedActIndexes }];
  });
};

const matchesLiveTypeFilter = (
  filter: SetlistSelectedLiveFilterType,
  event: SetlistEvent,
): boolean => {
  const f = SetlistLiveFilters.find((f) => f.name == filter);
  if (f == undefined) {
    return true;
  }

  return f.predicate(event.liveType);
};

const matchesSongAndCostumeFilters = (
  songSlug: string,
  costumeSlug: string,
  act: SetlistAct,
): boolean => {
  const songName = ALL_SONGS.find((x) => x.slug === songSlug)?.name;
  const costumeName = AllStageCostumes.find((costume) => costume.slug === costumeSlug)?.name;

  if (songName == undefined && costumeName == undefined) {
    return true;
  }

  if (songName == undefined) {
    return act.costumeNames.includes(costumeName ?? "");
  }

  if (costumeName == undefined) {
    return act.songTitles.includes(songName);
  }

  return act.setlist.some(
    (segment) =>
      segment.kind == "song" && segment.songTitle == songName && segment.costumeName == costumeName,
  );
};

const matchesFirstPerformanceFilter = (isFirstPerformance: boolean, act: SetlistAct): boolean => {
  if (!isFirstPerformance) {
    return true;
  }

  return act.setlist.some((segment) => segment.kind == "song" && segment.isFirstPerformance);
};

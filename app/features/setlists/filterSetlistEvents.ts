import { AllStageCostumes } from "../costumes/costumesStage";
import { ALL_SONGS } from "../songs/songs";
import { SetlistLiveFilterType, SetlistLiveFilters, SetlistSearchFilters } from "./searchFilters";
import { containsAllTokens, searchTokens } from "./searchText";
import { SetlistAct, SetlistEvent, SetlistSearchResult } from "./types";

export const filterSetlistEvents = (
  events: SetlistEvent[],
  filters: SetlistSearchFilters,
): SetlistSearchResult[] => {
  const tokens = searchTokens(filters.q);

  return events.flatMap((event): SetlistSearchResult[] => {
    if (filters.year != "" && !event.date.startsWith(`${filters.year}-`)) {
      return [];
    }

    if (filters.type != "" && !matchesLiveTypeFilter(filters.type, event)) {
      return [];
    }

    const eventMatchesQuery =
      tokens.length == 0 || containsAllTokens(event.eventSearchText, tokens);
    const matchedActIndexes = event.acts.flatMap((act, index) => {
      const songMatches = matchesSongFilter(filters.song, act);
      if (!songMatches) {
        return [];
      }

      const costumeMatches = matchesCostumeFilter(filters.costume, act);
      if (!costumeMatches) {
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

const matchesLiveTypeFilter = (filter: SetlistLiveFilterType, event: SetlistEvent): boolean => {
  const f = SetlistLiveFilters.find((f) => f.name == filter);
  if (f == undefined) {
    return true;
  }

  return f.predicate(event.liveType);
};

const matchesSongFilter = (songSlug: string, act: SetlistAct): boolean => {
  const songName = ALL_SONGS.find((x) => x.slug === songSlug)?.name;
  if (songName == undefined) {
    return true;
  }

  return act.songTitles.includes(songName);
};

const matchesCostumeFilter = (costumeSlug: string, act: SetlistAct): boolean => {
  if (costumeSlug == "") {
    return true;
  }

  const costumeName = AllStageCostumes.find((costume) => costume.slug === costumeSlug)?.name;
  if (costumeName == undefined) {
    return true;
  }

  return act.costumeNames.includes(costumeName);
};

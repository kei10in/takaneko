import { Act } from "../events/act";
import { EventModule } from "../events/eventModule";
import { SongSegment } from "../events/setlist";
import { ALL_SONGS } from "./songs";
import { LivesForSong, SimpleSongActivity, SongMetaDescriptor } from "./types";

export interface SongActivitySummary {
  name: string;
  count: number;
  song: SongMetaDescriptor;
  events: {
    segments: { act: Act; segment: SongSegment }[];
    event: EventModule;
  }[];
}

export const makeSongToLiveMap = (events: EventModule[], songs: SongMetaDescriptor[]) => {
  const result: Record<string, SongActivitySummary> = {};
  songs.forEach((song) => {
    result[song.name] = { name: song.name, count: 0, song, events: [] };
  });

  events.forEach((event) => {
    const { meta } = event;

    const actMap: Record<string, { act: Act; segment: SongSegment }[]> = {};

    meta.acts.forEach((act) => {
      act.setlist
        .filter((p) => p.kind == "song")
        .forEach((segment) => {
          const { songTitle: song } = segment;
          if (actMap[song] == undefined) {
            actMap[song] = [];
          }
          actMap[song].push({ act, segment });
        });
    });

    Object.entries(actMap).forEach(([song, segments]) => {
      if (!result[song]) {
        return;
      }

      result[song].count += segments.length;
      result[song].events.push({ segments, event });
    });
  });

  return result;
};

export const makeLivesForSongMap = (events: EventModule[]): LivesForSong[] => {
  const songToLiveMap = makeSongToLiveMap(events, ALL_SONGS);

  const result = Object.values(songToLiveMap).map((activitySummary) => {
    const performedLives: SimpleSongActivity[] = activitySummary.events.map((e) => {
      return {
        event: {
          slug: e.event.slug,
          summary: e.event.meta.summary,
          title: e.event.meta.title,
          liveType: e.event.meta.liveType,
          date: e.event.meta.date,
          region: e.event.meta.region,
          location: e.event.meta.location,
        },

        segments: e.segments.map(({ act, segment }) => ({
          actTitle: act.title,
          section: segment.section,
          costumeName: segment.costumeName,
          index: segment.index,
        })),
      };
    });

    const costumeCount: Record<string, number> = {};
    activitySummary.events.forEach(({ segments }) => {
      segments.forEach(({ segment }) => {
        const costume = segment.costumeName ?? "Unknown";
        if (costumeCount[costume] == undefined) {
          costumeCount[costume] = 0;
        }
        costumeCount[costume]++;
      });
    });

    const data = {
      slug: activitySummary.song.slug,
      name: activitySummary.song.name,
      count: activitySummary.count,
      costumeStats: Object.entries(costumeCount)
        .map(([costumeName, count]) => ({
          costumeName,
          count,
        }))
        .toSorted((a, b) => b.count - a.count),
      lives: performedLives,
    };

    return data;
  });

  return result;
};

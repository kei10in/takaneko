import { Act } from "../events/act";
import { EventModule } from "../events/eventModule";
import { SongSegment } from "../events/setlist";
import { SongMetaDescriptor } from "./types";

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
    meta.acts.flatMap((act) => {
      act.setlist
        .filter((p) => p.kind == "song")
        .forEach((segment) => {
          const { songTitle: song } = segment;
          if (actMap[song] == undefined) {
            actMap[song] = [];
          }

          actMap[song].push({ act, segment });

          if (result[song] != undefined) {
            // ひとつの公演で同じ曲が複数回披露された場合は、披露された回数を
            // カウントします。
            result[song].count += 1;
          }
        });
    });

    Object.entries(actMap).forEach(([song, segments]) => {
      if (!result[song]) {
        return;
      }

      result[song].events.push({ segments, event });
    });
  });

  return result;
};

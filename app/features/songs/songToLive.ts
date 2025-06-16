import { EventModule } from "../events/eventModule";
import { EventRecap } from "../events/eventRecap";
import { ALL_EVENTS } from "../events/events";
import { ALL_SONGS } from "./songs";

export interface SongActivitySummary {
  name: string;
  count: number;
  events: {
    recaps: EventRecap[];
    event: EventModule;
  }[];
}

export const makeSongToLiveMapFromAllEvents = () => {
  const events = Object.values(ALL_EVENTS);
  const songs = ALL_SONGS;

  const result: Record<string, SongActivitySummary> = {};
  songs.forEach((song) => {
    result[song.name] = { name: song.name, count: 0, events: [] };
  });

  events.forEach((event) => {
    const { meta } = event;

    const recapMap: Record<string, EventRecap[]> = {};
    meta.recaps.flatMap((recap) => {
      recap.setlist
        .flatMap((x) => x.songs)
        .forEach((song) => {
          if (recapMap[song] == undefined) {
            recapMap[song] = [];
          }

          // ひとつの公演で同じ曲が 2 回以上披露された場合が考慮されています。
          // recap をそのまま push しているので参照の比較 (include) で十分です。
          if (!recapMap[song].includes(recap)) {
            recapMap[song].push(recap);
          }

          if (result[song] != undefined) {
            // ひとつの公演で同じ曲が複数回披露された場合は、披露された回数を
            // カウントします。
            result[song].count += 1;
          }
        });
    });

    Object.entries(recapMap).forEach(([song, recaps]) => {
      if (!result[song]) {
        return;
      }

      result[song].events.push({ recaps, event });
    });
  });

  return result;
};

export const SongToLiveMap = makeSongToLiveMapFromAllEvents();

import { Act } from "../events/act";
import { EventModule } from "../events/eventModule";
import { SongMetaDescriptor } from "./types";

export interface SongActivitySummary {
  name: string;
  count: number;
  events: {
    acts: Act[];
    event: EventModule;
  }[];
}

export const makeSongToLiveMap = (events: EventModule[], songs: SongMetaDescriptor[]) => {
  const result: Record<string, SongActivitySummary> = {};
  songs.forEach((song) => {
    result[song.name] = { name: song.name, count: 0, events: [] };
  });

  events.forEach((event) => {
    const { meta } = event;

    const actMap: Record<string, Act[]> = {};
    meta.acts.flatMap((act) => {
      act.setlist
        .filter((p) => p.kind == "song")
        .map((p) => p.songTitle)
        .forEach((song) => {
          if (actMap[song] == undefined) {
            actMap[song] = [];
          }

          // ひとつの公演で同じ曲が 2 回以上披露された場合が考慮されています。
          // act をそのまま push しているので参照の比較 (include) で十分です。
          if (!actMap[song].includes(act)) {
            actMap[song].push(act);
          }

          if (result[song] != undefined) {
            // ひとつの公演で同じ曲が複数回披露された場合は、披露された回数を
            // カウントします。
            result[song].count += 1;
          }
        });
    });

    Object.entries(actMap).forEach(([song, acts]) => {
      if (!result[song]) {
        return;
      }

      result[song].events.push({ acts: acts, event });
    });
  });

  return result;
};

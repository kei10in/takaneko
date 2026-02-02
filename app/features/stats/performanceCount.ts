import { EventModule } from "../events/eventModule";
import { SongMetaDescriptor } from "../songs/types";

interface SongPerformed {
  title: string;
  slug: string;
  coverArt?: string;
  lives: string[];
}

export const makeSongPerformedList = (
  events: EventModule[],
  songs: SongMetaDescriptor[],
): SongPerformed[] => {
  const result: Record<string, SongPerformed> = {};
  songs.forEach((song) => {
    result[song.name] = {
      title: song.name,
      slug: song.slug,
      coverArt: song.coverArt,
      lives: [],
    };
  });

  events.forEach((event) => {
    const { meta } = event;
    const date = meta.date;

    meta.acts.forEach((act) => {
      act.setlist
        .filter((p) => p.kind == "song")
        .forEach((segment) => {
          if (result[segment.songTitle] == undefined) {
            return;
          }

          result[segment.songTitle].lives.push(date);
        });
    });
  });

  return Object.values(result);
};

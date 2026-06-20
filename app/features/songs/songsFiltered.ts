import { ALL_SONGS } from "./songs";
import { Limited, Repertoire } from "./tags";

export const PerformedSongs = ALL_SONGS.filter((song) =>
  song.tags?.some((tag) => tag.key == Repertoire.key || tag.key == Limited.key),
);

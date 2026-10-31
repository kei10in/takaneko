import useSWR from "swr";
import { LivesForSong } from "./types.ts";

export const useSongLives = (songSlug: string) => {
  return useSWR(`songs/${songSlug}/lives.json`, async () => {
    const response = await fetch(`/data/songs/${songSlug}/lives.json`);
    if (!response.ok) {
      return undefined;
    }

    const json = await response.json();
    const result = LivesForSong.safeParse(json);
    if (result.error) {
      return undefined;
    }
    return result.data;
  });
};

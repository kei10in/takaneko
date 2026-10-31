import { useOutletContext } from "react-router";
import { LivesForSong, SongMetaDescriptor } from "~/features/songs/types.ts";

export interface SongOutletContext {
  track: SongMetaDescriptor;
  performances: LivesForSong | undefined;
  isLoading: boolean;
}

export const useSongOutletContext = () => useOutletContext<SongOutletContext>();

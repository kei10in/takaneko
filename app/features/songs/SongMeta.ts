import { extractYouTubeVideoId, youtubeEmbedUrl } from "~/utils/youtube/videoId";
import { YouTubeImage, youtubeImage } from "~/utils/youtubeImage";
import { SongMetaDescriptor } from "./types";

export const SongMeta = {
  youtubeImage: (track: SongMetaDescriptor): YouTubeImage | undefined => {
    const videoId = extractYouTubeVideoId(track.youtube?.[0]?.videoId);
    if (videoId == undefined) {
      return undefined;
    }

    return youtubeImage(videoId);
  },

  youtubeEmbedUrl: (track: SongMetaDescriptor): string | undefined => {
    const videoId = extractYouTubeVideoId(track.youtube?.[0]?.videoId);
    if (videoId == undefined) {
      return undefined;
    }

    return youtubeEmbedUrl(videoId);
  },
} as const;

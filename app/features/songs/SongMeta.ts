import { extractYouTubeVideoId, youtubeEmbedUrl } from "~/utils/youtube/videoId";
import { YouTubeImage, youtubeImage } from "~/utils/youtube/youtubeImage";
import { SongMetaDescriptor } from "./types";

export type AppearanceType = "video" | "streaming" | "live";

export const SongMeta = {
  firstAppearance: (
    track: SongMetaDescriptor,
  ): { type: AppearanceType; date: string } | undefined => {
    const candidates: { type: AppearanceType; date: string | undefined }[] = [
      { type: "video", date: track.videoRelease },
      { type: "streaming", date: track.digitalRelease },
      { type: "live", date: track.liveDebut },
    ];

    const filtered = candidates.sort((a, b) => {
      if (b.date == undefined) {
        return -1;
      }
      if (a.date == undefined) {
        return 1;
      }
      if (a.date == b.date) {
        if (a.type === "streaming") {
          return -1;
        } else if (b.type === "streaming") {
          return 1;
        } else if (a.type === "video") {
          return -1;
        } else if (b.type === "video") {
          return 1;
        }
        return 0;
      }
      return a.date.localeCompare(b.date);
    });

    const first = filtered[0];
    if (first.date == undefined) {
      return undefined;
    }

    return { type: first.type, date: first.date };
  },

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

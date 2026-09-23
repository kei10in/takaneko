import { YouTubeVideoMetadata } from "./types.ts";
import { verifyYouTubeThumbnails } from "./youtubeImage.ts";
import { fetchYouTubeOEmbed } from "./youtubeOEmbed.ts";

export const fetchYouTubeVideoMetadata = async (
  videoId: string,
): Promise<YouTubeVideoMetadata | undefined> => {
  const oEmbed = await fetchYouTubeOEmbed(videoId);
  if (oEmbed == undefined) {
    return undefined;
  }

  const thumbnails = await verifyYouTubeThumbnails(videoId);

  return {
    videoId,
    title: oEmbed.title,
    authorName: oEmbed.author_name,
    authorUrl: oEmbed.author_url,
    thumbnails,
  };
};

import { YouTubeVideoMetadata } from "./types";
import { verifyYouTubeThumbnails } from "./youtubeImage";
import { fetchYouTubeOEmbed } from "./youtubeOEmbed";

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
    thumbnailHeight: oEmbed.thumbnail_height,
    thumbnailWidth: oEmbed.thumbnail_width,
    thumbnailUrl: oEmbed.thumbnail_url,
    thumbnails,
  };
};

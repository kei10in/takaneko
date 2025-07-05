import fs from "node:fs";
import path from "path";
import { ALL_SONGS } from "~/features/songs/songs";
import { extractYouTubeVideoId } from "~/utils/youtube/videoId";
import { fetchYouTubeVideoMetadata } from "~/utils/youtube/youtubeVideoMetadata";

const OUTPUT_FILE = path.resolve(import.meta.dirname, "../app/features/songs/videoMetadata.json");

/**
 * 高嶺のなでしこの全楽曲に関連する YouTube 動画のメタデータをキャッシュします。
 */
const main = async () => {
  const allVideos = ALL_SONGS.flatMap((song) => {
    return (
      song.youtube?.flatMap((video) => {
        const videoId = extractYouTubeVideoId(video.videoId);
        if (videoId == undefined) {
          console.warn(`Invalid YouTube video ID for song "${song.name}": ${video.videoId}`);
          return [];
        }
        return [videoId];
      }) ?? []
    );
  }).toSorted();

  const promises = allVideos.map(async (videoId) => {
    const result = await fetchYouTubeVideoMetadata(videoId);
    if (result == undefined) {
      console.warn(`Failed to fetch metadata for YouTube video ID: ${videoId}`);
      return undefined;
    }
    return result;
  });

  const results = await Promise.all(promises);
  const map = Object.fromEntries(
    results.flatMap((video) => (video == undefined ? [] : [[video.videoId, video]])),
  );

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(map, null, 2));
};

main();

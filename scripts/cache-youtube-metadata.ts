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
          return [];
        }
        return [videoId];
      }) ?? []
    );
  });

  const promises = allVideos.map(async (videoId) => {
    return await fetchYouTubeVideoMetadata(videoId);
  });

  const results = await Promise.all(promises);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
};

main();

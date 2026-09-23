import { YouTubeVideoMetadata } from "~/utils/youtube/types.ts";
import json from "./youtubeVideoMetadata.json";

export const AllYouTubeVideoMetadata = json as Record<string, YouTubeVideoMetadata>;

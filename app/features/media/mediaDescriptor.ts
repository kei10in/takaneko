import { MediaDescriptor } from "./types.ts";

export const mediaKey = (media: MediaDescriptor): string => {
  if (media.kind === "youtube") {
    return media.videoId;
  } else if (media.kind === "ogp") {
    return media.mediaUrl;
  } else {
    return media.mediaUrl;
  }
};

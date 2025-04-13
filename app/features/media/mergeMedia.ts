import {
  MediaDescriptor,
  OgpMediaDescriptor,
  StaticMediaDescriptor,
  YouTubeVideoDescriptor,
} from "~/features/media/types";

export const mergeMedia = (
  youtube: YouTubeVideoDescriptor[],
  ogp: OgpMediaDescriptor[],
  staticMedia: StaticMediaDescriptor[],
): MediaDescriptor[] => {
  const xs: MediaDescriptor[] = [
    ...youtube.map((v) => ({ kind: "youtube", ...v }) satisfies MediaDescriptor),
    ...ogp.map((v) => ({ kind: "ogp", ...v }) satisfies MediaDescriptor),
    ...staticMedia.map((v) => ({ kind: "static", ...v }) satisfies MediaDescriptor),
  ];
  xs.toSorted((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return -1;
    } else if (a.publishedAt > b.publishedAt) {
      return 1;
    } else {
      return 0;
    }
  });
  return xs;
};

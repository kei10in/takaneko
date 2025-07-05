export interface ImageUrlWithSize {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeImage {
  default: ImageUrlWithSize;
  mqDefault: ImageUrlWithSize;
  hqDefault: ImageUrlWithSize;
  sdDefault: ImageUrlWithSize;
  maxResDefault: ImageUrlWithSize;
}

export const youtubeImage = (videoId: string): YouTubeImage => {
  return {
    default: {
      url: `https://i.ytimg.com/vi_webp/${videoId}/default.webp`,
      width: 120,
      height: 90,
    },
    mqDefault: {
      url: `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`,
      width: 320,
      height: 180,
    },
    hqDefault: {
      url: `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
      width: 480,
      height: 360,
    },
    sdDefault: {
      url: `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`,
      width: 640,
      height: 480,
    },
    maxResDefault: {
      url: `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
      width: 1280,
      height: 720,
    },
  };
};

export const verifyYouTubeThumbnails = async (videoId: string): Promise<Partial<YouTubeImage>> => {
  const images = youtubeImage(videoId);

  return {
    default: await verifyYouTubeThumbnail(images.default),
    mqDefault: await verifyYouTubeThumbnail(images.mqDefault),
    hqDefault: await verifyYouTubeThumbnail(images.hqDefault),
    sdDefault: await verifyYouTubeThumbnail(images.sdDefault),
    maxResDefault: await verifyYouTubeThumbnail(images.maxResDefault),
  };
};

const verifyYouTubeThumbnail = async (
  img: ImageUrlWithSize,
): Promise<ImageUrlWithSize | undefined> => {
  try {
    const response = await fetch(img.url, { method: "HEAD" });
    if (!response.ok) {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }

  return img;
};

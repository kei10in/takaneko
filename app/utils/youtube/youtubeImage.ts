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

  defaultJpeg: ImageUrlWithSize;
  mqDefaultJpeg: ImageUrlWithSize;
  hqDefaultJpeg: ImageUrlWithSize;
  sdDefaultJpeg: ImageUrlWithSize;
  maxResDefaultJpeg: ImageUrlWithSize;
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
    defaultJpeg: {
      url: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
      width: 120,
      height: 90,
    },
    mqDefaultJpeg: {
      url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      width: 320,
      height: 180,
    },
    hqDefaultJpeg: {
      url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      width: 480,
      height: 360,
    },
    sdDefaultJpeg: {
      url: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      width: 640,
      height: 480,
    },
    maxResDefaultJpeg: {
      url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      width: 1280,
      height: 720,
    },
  };
};

export const verifyYouTubeThumbnails = async (videoId: string): Promise<string[]> => {
  const images = youtubeImage(videoId);

  const verified = {
    default: await verifyYouTubeThumbnail(images.default),
    mqDefault: await verifyYouTubeThumbnail(images.mqDefault),
    hqDefault: await verifyYouTubeThumbnail(images.hqDefault),
    sdDefault: await verifyYouTubeThumbnail(images.sdDefault),
    maxResDefault: await verifyYouTubeThumbnail(images.maxResDefault),
    defaultJpeg: await verifyYouTubeThumbnail(images.defaultJpeg),
    mqDefaultJpeg: await verifyYouTubeThumbnail(images.mqDefaultJpeg),
    hqDefaultJpeg: await verifyYouTubeThumbnail(images.hqDefaultJpeg),
    sdDefaultJpeg: await verifyYouTubeThumbnail(images.sdDefaultJpeg),
    maxResDefaultJpeg: await verifyYouTubeThumbnail(images.maxResDefaultJpeg),
  };

  return Object.keys(verified);
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

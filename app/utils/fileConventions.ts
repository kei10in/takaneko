export const thumbnailSrcSet = (filepath: string): { src: string; srcset: string } => {
  const thumbs = thumbnails(filepath);

  return {
    src: thumbs[0],
    srcset: `${encodeURI(thumbs[0])} 1x, ${encodeURI(thumbs[1])} 2x, ${encodeURI(thumbs[2])} 3x`,
  };
};

export const thumbnails = (filepath: string): [string, string, string] => {
  const i = filepath.lastIndexOf(".");
  const prefix = filepath.substring(0, i);

  return [
    `/thumbnails${prefix}@1x.webp`,
    `/thumbnails${prefix}@2x.webp`,
    `/thumbnails${prefix}@3x.webp`,
  ];
};

export const isThumbnail = (filepath: string): boolean => {
  return filepath.includes("thumbnails");
};

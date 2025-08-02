export const thumbnailSrcSet = (filepath: string): { src: string; srcset: string } => {
  const thumbs = thumbnails(filepath);

  return {
    src: thumbs[0],
    srcset: `${encodeURI(thumbs[0])} 1x, ${encodeURI(thumbs[1])} 2x, ${encodeURI(thumbs[2])} 3x`,
  };
};

export const thumbnailDir = (filepath: string): string => {
  const [p, category] = filepath.split("/");
  return `${p}/${category}/thumbnails`;
};

export const thumbnails = (filepath: string): [string, string, string] => {
  const i = filepath.lastIndexOf(".");
  const prefix = filepath.substring(0, i);
  const [_, category, ...rest] = prefix.split("/");

  return [
    `/${category}/thumbnails/${rest.join("/")}@1x.webp`,
    `/${category}/thumbnails/${rest.join("/")}@2x.webp`,
    `/${category}/thumbnails/${rest.join("/")}@3x.webp`,
  ];
};

export const isThumbnail = (filepath: string): boolean => {
  return filepath.includes("thumbnails");
};

import { stem } from "~/utils/string";

/**
 * 生写真の画像サイズです。
 * 実寸: 89mm x 127mm
 */
export const CROPPED_PHOTO_SIZE = {
  width: 267,
  height: 381,
};

/**
 * ミニフォトカードの画像サイズです。
 * 実寸: 54mm x 86mm
 */
export const CROPPED_MINI_PHOTO_CARD_SIZE = {
  width: 216,
  height: 344,
};

export const croppedImagePath = (imagePath: string, id: number) => {
  const basename = stem(imagePath);
  const suffix = id.toString().padStart(3, "0");
  const ext = ".webp";
  const filename = `${basename}_${suffix}${ext}`;

  return `/takaneko/cropped/${filename}`;
};

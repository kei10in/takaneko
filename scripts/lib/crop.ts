import { CompressionType, FilterType, Transformer } from "@napi-rs/image";
import { createCanvas, loadImage, type Image } from "canvas";
import fs from "node:fs";
import path from "node:path";
import {
  CROPPED_MINI_PHOTO_CARD_SIZE,
  CROPPED_PHOTO_SIZE,
  croppedImagePath,
} from "~/features/products/croppedProductImage";
import { ImagePosition, RandomGoods } from "~/features/products/product";
import {
  isRegularTakanekoMiniPhotoCard,
  isRegularTakanekoPhoto,
} from "~/features/products/productImages";
import { Xywh } from "~/features/trade/stampPosition";
import { Size } from "~/utils/types/Size";

const webpQuality = 80;

/**
 * 切り抜いた画像のサイズを取得します。
 * レギュラーの生写真・ミニフォトカードは規定のサイズで切り抜きます。
 * それ以外のランダムグッズは切りぬたサイズそのままです。
 */
export const getOutputImageSize = (photo: RandomGoods, pos: ImagePosition): Size => {
  if (isRegularTakanekoPhoto(photo)) {
    return CROPPED_PHOTO_SIZE;
  } else if (isRegularTakanekoMiniPhotoCard(photo)) {
    return CROPPED_MINI_PHOTO_CARD_SIZE;
  } else {
    const targetWidth = 214;
    if (pos.width < targetWidth) {
      return { width: pos.width, height: pos.height };
    }
    const targetHeight = Math.floor(pos.height * (targetWidth / pos.width));
    return { width: targetWidth, height: targetHeight };
  }
};

/**
 * ランダムグッズの商品紹介画像をひとつずつの画像に切り抜きます。
 */
export const crop = async (photo: RandomGoods): Promise<void> => {
  const filepath = `public${photo.url}`;
  const source = await fs.promises.readFile(filepath);
  const decodedPng = await new Transformer(source).rotate().png({
    compressionType: CompressionType.Fast,
    filterType: FilterType.NoFilter,
  });
  const sourceImage = await loadImage(decodedPng);

  const tasks = photo.positions.map(async (pos) => {
    const size = getOutputImageSize(photo, pos);
    const dest = `public${croppedImagePath(photo.url, pos.id)}`;
    await cropImage(sourceImage, pos, dest, size);
  });

  await Promise.all(tasks);
};

/**
 * 指定した画像の指定領域を、指定サイズに切り抜きます。
 * 指定サイズへの変換には object-fit: cover 相当の計算を行います。
 *
 * @param src 切り抜く画像のパス
 * @param rect 切り抜く領域の座標とサイズ
 * @param dst 切り抜いた画像の保存先
 * @param size 切り抜いた画像のサイズ
 */
const cropImage = async (
  sourceImage: Image,
  rect: Xywh,
  dst: string,
  size: Size,
): Promise<void> => {
  fs.mkdirSync(path.dirname(dst), { recursive: true });

  const sourceRect = {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };

  const extractedCanvas = createCanvas(sourceRect.width, sourceRect.height);
  const extractedContext = extractedCanvas.getContext("2d");
  extractedContext.drawImage(
    sourceImage,
    sourceRect.x,
    sourceRect.y,
    sourceRect.width,
    sourceRect.height,
    0,
    0,
    sourceRect.width,
    sourceRect.height,
  );

  const scale = Math.max(size.width / sourceRect.width, size.height / sourceRect.height);
  const coverWidth = Math.max(size.width, Math.ceil(sourceRect.width * scale));
  const coverHeight = Math.max(size.height, Math.ceil(sourceRect.height * scale));

  const coverCanvas = createCanvas(coverWidth, coverHeight);
  const coverContext = coverCanvas.getContext("2d");
  coverContext.imageSmoothingEnabled = true;
  coverContext.drawImage(extractedCanvas, 0, 0, coverWidth, coverHeight);

  const cropX = Math.floor((coverWidth - size.width) / 2);
  const cropY = Math.floor((coverHeight - size.height) / 2);
  const outputCanvas = createCanvas(size.width, size.height);
  const outputContext = outputCanvas.getContext("2d");
  outputContext.drawImage(
    coverCanvas,
    cropX,
    cropY,
    size.width,
    size.height,
    0,
    0,
    size.width,
    size.height,
  );

  const png = outputCanvas.toBuffer("image/png");
  const webp = await new Transformer(png).webp(webpQuality);
  await fs.promises.writeFile(dst, webp);
};

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
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

/**
 * 切り抜いた画像のサイズを取得します。
 * レギュラーの生写真・ミニフォトカードは規定のサイズで切り抜きます。
 * それ以外のランダムグッズは切りぬたサイズそのままです。
 */
export const getOutputImageSize = (photo: RandomGoods, pos: ImagePosition) => {
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
export const crop = async (photo: RandomGoods) => {
  const src = `public${photo.url}`;

  const tasks = photo.positions.map(async (pos) => {
    const size = getOutputImageSize(photo, pos);
    const dest = `public${croppedImagePath(photo.url, pos.id)}`;
    await cropImage(src, pos, dest, size);
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
  src: string,
  rect: Xywh,
  dst: string,
  size: { width: number; height: number },
) => {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
  }

  // Windows で toFile をすると Segmentation fault になるので、toBuffer と
  // writeFile を使う
  const buf = await sharp(src)
    .extract({ left: rect.x, top: rect.y, width: rect.width, height: rect.height })
    .resize(size.width, size.height, { fit: "cover" })
    .toFormat("webp")
    .toBuffer();
  await fs.promises.writeFile(dst, buf);
};

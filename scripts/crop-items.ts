import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  CROPPED_MINI_PHOTO_CARD_SIZE,
  CROPPED_PHOTO_SIZE,
  croppedImagePath,
} from "~/features/products/croppedProductImage";
import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages";
import { Xywh } from "~/features/trade/stampPosition";

const main = async () => {
  await cropPhotos();
  await cropMiniPhotoCards();
  await cropOtherRandomGoods();
};

/**
 * 生写真の画像をひとつずつの画像に切り抜きます。
 */
const cropPhotos = async () => {
  const tasks = regularTakanekoPhotos().map(async (photo) => {
    const src = `public${photo.url}`;

    const tasks = photo.positions.map(async (pos) => {
      const dest = `public${croppedImagePath(photo.url, pos.id)}`;
      await cropImage(src, pos, dest, CROPPED_PHOTO_SIZE);
    });

    await Promise.all(tasks);
  });

  await Promise.all(tasks);
};

/**
 * ミニフォトカードの画像をひとつずつの画像に切り抜きます。
 */
const cropMiniPhotoCards = async () => {
  const tasks = regularTakanekoMiniPhotoCards().map(async (photo) => {
    const src = `public${photo.url}`;

    const tasks = photo.positions.map(async (pos) => {
      const dest = `public${croppedImagePath(photo.url, pos.id)}`;
      await cropImage(src, pos, dest, CROPPED_MINI_PHOTO_CARD_SIZE);
    });

    await Promise.all(tasks);
  });

  await Promise.all(tasks);
};

/**
 * その他のランダムグッズの画像をひとつずつの画像に切り抜きます。
 */
const cropOtherRandomGoods = async () => {
  const tasks = otherTakanekoRandomGoods().map(async (photo) => {
    const src = `public${photo.url}`;

    const tasks = photo.positions.map(async (pos) => {
      const dest = `public${croppedImagePath(photo.url, pos.id)}`;
      await cropImage(src, pos, dest, { width: pos.width, height: pos.height });
    });

    await Promise.all(tasks);
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

  await sharp(src)
    .extract({ left: rect.x, top: rect.y, width: rect.width, height: rect.height })
    .resize(size.width, size.height, { fit: "cover" })
    .toFormat("webp")
    .toFile(dst);
};

main();

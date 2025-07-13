import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages";
import { crop } from "./lib/crop";

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
    await crop(photo);
  });

  await Promise.all(tasks);
};

/**
 * ミニフォトカードの画像をひとつずつの画像に切り抜きます。
 */
const cropMiniPhotoCards = async () => {
  const tasks = regularTakanekoMiniPhotoCards().map(async (photo) => {
    await crop(photo);
  });

  await Promise.all(tasks);
};

/**
 * その他のランダムグッズの画像をひとつずつの画像に切り抜きます。
 */
const cropOtherRandomGoods = async () => {
  const tasks = otherTakanekoRandomGoods().map(async (photo) => {
    await crop(photo);
  });

  await Promise.all(tasks);
};

main();

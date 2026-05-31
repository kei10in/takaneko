import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages";
import { crop, CroppingOptions } from "./lib/crop";

const main = async () => {
  const rebuild = process.argv.includes("--rebuild");

  await cropPhotos({ rebuild });
  await cropMiniPhotoCards({ rebuild });
  await cropOtherRandomGoods({ rebuild });
};

/**
 * 生写真の画像をひとつずつの画像に切り抜きます。
 */
const cropPhotos = async (options: CroppingOptions) => {
  const tasks = regularTakanekoPhotos().map(async (photo) => {
    await crop(photo, options);
  });

  await Promise.all(tasks);
};

/**
 * ミニフォトカードの画像をひとつずつの画像に切り抜きます。
 */
const cropMiniPhotoCards = async (options: CroppingOptions) => {
  const tasks = regularTakanekoMiniPhotoCards().map(async (photo) => {
    await crop(photo, options);
  });

  await Promise.all(tasks);
};

/**
 * その他のランダムグッズの画像をひとつずつの画像に切り抜きます。
 */
const cropOtherRandomGoods = async (options: CroppingOptions) => {
  const tasks = otherTakanekoRandomGoods().map(async (photo) => {
    await crop(photo, options);
  });

  await Promise.all(tasks);
};

main();

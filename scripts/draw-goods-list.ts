import { globSync } from "glob";
import * as fs from "node:fs";
import { RandomGoodsItemList } from "./lib/RandomGoodsItemList";

/**
 * 3 枚の場合:
 * | 50 | 450 | 25 | 450 | 25 | 450 | 50 |
 */

const main = async () => {
  const files = globSync("public/takaneko/goods/work/*.{jpg,jpeg,png,webp}").toSorted();

  const outputImage = "public/takaneko/goods/generated.webp";
  const outputJson = "public/takaneko/goods/positions.json";

  const randomGoods = new RandomGoodsItemList(files);
  const { buffer, positions } = await randomGoods.draw();

  fs.writeFileSync(outputImage, buffer);
  fs.writeFileSync(outputJson, JSON.stringify(positions, null, 2));
};

main();

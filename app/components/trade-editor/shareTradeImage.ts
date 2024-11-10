import { RandomGoods } from "~/features/products/product";
import { TradeDescription } from "~/features/TradeStatus";
import { canvasToFile } from "~/utils/html/canvasToFile";
import { drawTradeImage } from "./drawTradeImage";

export const shareTradeImage = async (
  productImage: RandomGoods,
  tradeDescriptions: Record<number, TradeDescription>,
) => {
  if (window?.navigator?.share == undefined) {
    return;
  }

  const canvas = document.createElement("canvas");
  await drawTradeImage(canvas, productImage, tradeDescriptions);

  const date = Date.now();

  // Safari では WebP がサポートされていないため、PNG に変換されます。
  const file = await canvasToFile(canvas, `TradeImage-${date}.webp`, "image/webp", 0.95);

  await window.navigator.share({
    title: productImage.name,
    text: `${productImage.name} のトレード画像`,
    files: [file],
  });
};

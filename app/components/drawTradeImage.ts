import { ProductImage } from "~/features/productImages";
import { TradeDescription, tradeStateToImageSrc } from "~/features/TradeStatus";
import { loadImage } from "~/utils/loadImage";

export const drawTradeImage = async (
  canvas: HTMLCanvasElement,
  productImage: ProductImage,
  tradeDescriptions: Record<number, TradeDescription>,
): Promise<void> => {
  const ctx = canvas.getContext("2d");
  if (ctx == undefined) {
    return;
  }

  // Fit the image to the canvas
  const scale = canvas.width / productImage.width;
  ctx.scale(scale, scale);

  const img = new Image();
  await loadImage(img, productImage.url);

  ctx.drawImage(img, 0, 0);

  const positions = productImage.positions;
  const promises = positions.map(async (pos) => {
    const trade = tradeDescriptions[pos.id];
    if (trade == undefined) {
      return;
    }

    const src = tradeStateToImageSrc(trade.status);
    if (src == undefined) {
      return;
    }

    const width = pos.width / 1.5;
    const height = width;
    const x = pos.x + pos.width / 2 - width / 2;
    const y = pos.y + pos.height - height;

    const icon = new Image();
    await loadImage(icon, src);
    ctx.drawImage(icon, x, y, width, height);
  });

  await Promise.all(promises);
};

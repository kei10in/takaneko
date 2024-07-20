import { ProductImage } from "~/features/productImages";
import { TradeState, tradeStateToImageSrc } from "~/features/TradeState";
import { loadImage } from "~/utils/loadImage";

export const drawTradeImage = async (
  canvas: HTMLCanvasElement,
  productImage: ProductImage,
  tradeDescriptions: { id: number; state: TradeState }[],
): Promise<void> => {
  const ctx = canvas.getContext("2d");
  if (ctx == undefined) {
    return;
  }

  const img = new Image();
  await loadImage(img, productImage.url);

  ctx.drawImage(img, 0, 0);

  const promises = tradeDescriptions.map(async (trade) => {
    const pos = productImage.positions.find((pos) => pos.id == trade.id);
    if (pos == undefined) {
      return;
    }

    const src = tradeStateToImageSrc(trade.state);
    if (src == undefined) {
      return;
    }

    const width = pos.width / 1.5;
    const height = width;
    const x = pos.x + pos.width / 2 - width / 2;
    const y = pos.y + pos.height - height - 5;

    const icon = new Image();
    await loadImage(icon, src);
    ctx.drawImage(icon, x, y, width, height);
  });

  await Promise.all(promises);
};

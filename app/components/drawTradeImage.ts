import { ProductImage } from "~/features/products/product";
import { stampPositions } from "~/features/trade/stampPosition";
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
  const stamps = stampPositions(positions);
  const promises = stamps.map(async (pos) => {
    const trade = tradeDescriptions[pos.id];
    if (trade == undefined) {
      return;
    }

    const { x, y, width, height } = pos;

    const src = tradeStateToImageSrc(trade.status);
    if (src != undefined) {
      const icon = new Image();
      await loadImage(icon, src);
      ctx.drawImage(icon, x, y, width, height);
    } else if (trade.status.tag === "emoji") {
      ctx.font = `${height * 0.9}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.strokeText(trade.status.emoji, x + width / 2, y);
    }
  });

  await Promise.all(promises);
};

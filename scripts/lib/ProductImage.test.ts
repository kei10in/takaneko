import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ProductImage } from "./ProductImage";

describe("ProductImage", () => {
  it("renders an image and positions without writing files", async () => {
    const files = [
      "public/takaneko/live-goods/2025-08-24_LIVE 2025 SUMMER in SEOUL_JP.jpg",
      "public/takaneko/live-goods/2025-08-24_LIVE 2025 SUMMER in SEOUL_JP.jpg",
    ];
    const productImage = new ProductImage(files, { size: { width: 154, height: 220 } });

    const rendered = await productImage.render();
    const metadata = await sharp(rendered.buffer).metadata();

    expect(rendered.positions).toEqual([
      { id: 1, x: 33, y: 33, width: 154, height: 220 },
      { id: 2, x: 205, y: 33, width: 154, height: 220 },
    ]);
    expect(metadata).toMatchObject({ width: 1080, height: 1238, format: "webp" });
  });
});

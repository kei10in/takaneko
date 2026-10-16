import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ProductImage } from "./ProductImage.ts";

describe("ProductImage", () => {
  it.each([
    { count: 8, photosPerMember: 4, width: 1424, height: 286 },
    { count: 9, photosPerMember: 4, width: 1424, height: 524 },
    { count: 35, photosPerMember: 4, width: 1424, height: 1238 },
    { count: 36, photosPerMember: 4, width: 1424, height: 1238 },
    { count: 7, photosPerMember: 3, width: 1080, height: 524 },
  ])(
    "lays out $count images with $photosPerMember photos per member",
    ({ count, photosPerMember, width, height }) => {
      const image = new ProductImage(
        Array.from({ length: count }, () => "unused.png"),
        {
          photosPerMember,
        },
      );
      const positions = image.photoRects();
      expect(image.size).toEqual({ width, height });
      expect(positions).toHaveLength(count);
      expect(positions.map(({ id }) => id)).toEqual(Array.from({ length: count }, (_, i) => i + 1));
      const columns = photosPerMember * 2;
      if (count > columns) {
        expect(positions[columns]).toEqual({
          id: columns + 1,
          x: 33,
          y: 271,
          width: 154,
          height: 220,
        });
      }
    },
  );

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

import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { generateTradeProductImage } from "./image";
import { buildProductDescriptor } from "./productDefinition";

describe("generateTradeProductImage", { timeout: 15_000 }, () => {
  it("renders detected mini photos into the shared WebP grid", async () => {
    const descriptor = buildProductDescriptor({
      inputPath: path.resolve(
        "public/takaneko/goods/2026/2026-03-05_ミニフォトカード「セーラー服2026」.jpg",
      ),
      type: "mini-photo-grid",
      date: "2026-07-20",
      series: "再構成テスト",
      lineup: "regular-27",
    });
    if (descriptor.err) throw new Error(descriptor.error.message);

    const result = await generateTradeProductImage(descriptor.value);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.extension).toBe(".webp");
    expect(result.value.positions).toHaveLength(27);
    expect(result.value.positions[0]).toEqual({
      id: 1,
      x: 41,
      y: 33,
      width: 138,
      height: 220,
    });
    expect(await sharp(result.value.buffer).metadata()).toMatchObject({
      format: "webp",
      width: 1080,
      height: 1238,
    });
  });
});

import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  extractMiniPhotoPositions,
  extractMiniPhotoPositionsFromPixels,
  type PixelImage,
} from "./extractMiniPhotoPositions";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (width: number, height: number, cards: Rect[]): PixelImage => {
  const channels = 3;
  const data = new Uint8Array(width * height * channels);

  Array.from({ length: width * height }).forEach((_, index) => {
    data[index * channels] = 58;
    data[index * channels + 1] = 91;
    data[index * channels + 2] = 73;
  });

  cards.forEach((card, cardIndex) => {
    Array.from({ length: card.height }).forEach((_, offsetY) => {
      Array.from({ length: card.width }).forEach((__, offsetX) => {
        const x = card.x + offsetX;
        const y = card.y + offsetY;
        const index = (y * width + x) * channels;
        const border =
          offsetX < 2 || offsetY < 2 || offsetX >= card.width - 2 || offsetY >= card.height - 2;

        data[index] = border ? 218 : 115 + cardIndex * 7;
        data[index + 1] = border ? 222 : 138 + cardIndex * 5;
        data[index + 2] = border ? 226 : 176 - cardIndex * 4;
      });
    });
  });

  return { width, height, channels, data };
};

const expectPositionsCloseTo = (actual: Rect[], expected: Rect[], tolerance = 2) => {
  expect(actual).toHaveLength(expected.length);
  expected.forEach((position, index) => {
    expect(Math.abs((actual[index]?.x ?? 0) - position.x)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs((actual[index]?.y ?? 0) - position.y)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs((actual[index]?.width ?? 0) - position.width)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs((actual[index]?.height ?? 0) - position.height)).toBeLessThanOrEqual(tolerance);
  });
};

describe("extractMiniPhotoPositionsFromPixels", () => {
  it("extracts a grid from a non-white background while retaining small position offsets", () => {
    const cards = [
      { x: 12, y: 11, width: 54, height: 86 },
      { x: 72, y: 12, width: 54, height: 86 },
      { x: 132, y: 10, width: 54, height: 86 },
      { x: 11, y: 104, width: 54, height: 86 },
      { x: 73, y: 105, width: 54, height: 86 },
      { x: 131, y: 103, width: 54, height: 86 },
    ];
    const image = createImage(200, 202, cards);

    const result = extractMiniPhotoPositionsFromPixels(image);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expectPositionsCloseTo(result.value.positions, cards);
    expect(result.value.diagnostics.rows).toBe(2);
    expect(result.value.diagnostics.columns).toBe(3);
  });

  it("allows an incomplete final row", () => {
    const cards = [
      { x: 10, y: 9, width: 52, height: 88 },
      { x: 68, y: 9, width: 52, height: 88 },
      { x: 126, y: 9, width: 52, height: 88 },
      { x: 10, y: 103, width: 52, height: 88 },
      { x: 68, y: 103, width: 52, height: 88 },
    ];
    const image = createImage(190, 202, cards);

    const result = extractMiniPhotoPositionsFromPixels(image);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expectPositionsCloseTo(result.value.positions, cards);
    expect(result.value.diagnostics.rows).toBe(2);
    expect(result.value.diagnostics.columns).toBe(3);
  });

  it("aligns positions by row and column in grid mode", () => {
    const cards = [
      { x: 12, y: 11, width: 54, height: 86 },
      { x: 72, y: 12, width: 54, height: 86 },
      { x: 11, y: 104, width: 54, height: 86 },
      { x: 73, y: 105, width: 54, height: 86 },
    ];
    const image = createImage(145, 202, cards);

    const result = extractMiniPhotoPositionsFromPixels(image, { normalizeMode: "grid" });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions[0]?.x).toBe(result.value.positions[2]?.x);
    expect(result.value.positions[1]?.x).toBe(result.value.positions[3]?.x);
    expect(result.value.positions[0]?.y).toBe(result.value.positions[1]?.y);
    expect(result.value.positions[2]?.y).toBe(result.value.positions[3]?.y);
  });

  it("decodes an encoded image at the public API boundary", async () => {
    const cards = [
      { x: 12, y: 11, width: 54, height: 86 },
      { x: 72, y: 11, width: 54, height: 86 },
      { x: 12, y: 103, width: 54, height: 86 },
      { x: 72, y: 103, width: 54, height: 86 },
    ];
    const image = createImage(145, 202, cards);
    const encoded = await sharp(image.data, {
      raw: { width: image.width, height: image.height, channels: image.channels },
    })
      .png()
      .toBuffer();

    const result = await extractMiniPhotoPositions(encoded);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expectPositionsCloseTo(result.value.positions, cards);
  });

  it("returns an error when no card layout can be identified", () => {
    const image = createImage(200, 200, []);

    const result = extractMiniPhotoPositionsFromPixels(image);

    expect(result.err).toBe(true);
    if (result.ok) return;
    expect(result.error.kind).toBe("layout-not-found");
  });
});

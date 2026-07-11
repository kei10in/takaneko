import { readFile } from "node:fs/promises";
import path from "node:path";
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

describe("extractMiniPhotoPositions", () => {
  it("extracts every card position from real mini-photo sample 1", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.1.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 38, y: 26, width: 87, height: 137 },
      { id: 2, x: 130, y: 26, width: 87, height: 137 },
      { id: 3, x: 221, y: 26, width: 87, height: 137 },
      { id: 4, x: 312, y: 26, width: 87, height: 137 },
      { id: 5, x: 404, y: 26, width: 87, height: 137 },
      { id: 6, x: 491, y: 26, width: 87, height: 137 },
      { id: 7, x: 587, y: 26, width: 87, height: 137 },
      { id: 8, x: 678, y: 26, width: 87, height: 137 },
      { id: 9, x: 770, y: 26, width: 87, height: 137 },
      { id: 10, x: 38, y: 167, width: 87, height: 137 },
      { id: 11, x: 130, y: 167, width: 87, height: 137 },
      { id: 12, x: 221, y: 167, width: 87, height: 137 },
      { id: 13, x: 312, y: 167, width: 87, height: 137 },
      { id: 14, x: 404, y: 167, width: 87, height: 137 },
      { id: 15, x: 491, y: 167, width: 87, height: 137 },
      { id: 16, x: 587, y: 167, width: 87, height: 137 },
      { id: 17, x: 678, y: 167, width: 87, height: 137 },
      { id: 18, x: 770, y: 167, width: 87, height: 137 },
      { id: 19, x: 38, y: 309, width: 87, height: 137 },
      { id: 20, x: 130, y: 309, width: 87, height: 137 },
      { id: 21, x: 221, y: 309, width: 87, height: 137 },
      { id: 22, x: 312, y: 309, width: 87, height: 137 },
      { id: 23, x: 404, y: 309, width: 87, height: 137 },
      { id: 24, x: 491, y: 309, width: 87, height: 137 },
      { id: 25, x: 587, y: 309, width: 87, height: 137 },
      { id: 26, x: 678, y: 309, width: 87, height: 137 },
      { id: 27, x: 770, y: 309, width: 87, height: 137 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every card position from real mini-photo sample 2", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.2.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 37, y: 57, width: 81, height: 128 },
      { id: 2, x: 123, y: 57, width: 81, height: 128 },
      { id: 3, x: 210, y: 57, width: 81, height: 128 },
      { id: 4, x: 297, y: 57, width: 81, height: 128 },
      { id: 5, x: 383, y: 57, width: 81, height: 128 },
      { id: 6, x: 470, y: 57, width: 81, height: 128 },
      { id: 7, x: 557, y: 57, width: 81, height: 128 },
      { id: 8, x: 643, y: 57, width: 81, height: 128 },
      { id: 9, x: 729, y: 57, width: 81, height: 128 },
      { id: 10, x: 37, y: 190, width: 81, height: 128 },
      { id: 11, x: 123, y: 190, width: 81, height: 128 },
      { id: 12, x: 210, y: 190, width: 81, height: 128 },
      { id: 13, x: 297, y: 190, width: 81, height: 128 },
      { id: 14, x: 383, y: 190, width: 81, height: 128 },
      { id: 15, x: 470, y: 190, width: 81, height: 128 },
      { id: 16, x: 557, y: 190, width: 81, height: 128 },
      { id: 17, x: 643, y: 190, width: 81, height: 128 },
      { id: 18, x: 729, y: 190, width: 81, height: 128 },
      { id: 19, x: 37, y: 323, width: 81, height: 128 },
      { id: 20, x: 123, y: 323, width: 81, height: 128 },
      { id: 21, x: 210, y: 323, width: 81, height: 128 },
      { id: 22, x: 297, y: 323, width: 81, height: 128 },
      { id: 23, x: 383, y: 323, width: 81, height: 128 },
      { id: 24, x: 470, y: 323, width: 81, height: 128 },
      { id: 25, x: 557, y: 323, width: 81, height: 128 },
      { id: 26, x: 643, y: 323, width: 81, height: 128 },
      { id: 27, x: 729, y: 323, width: 81, height: 128 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every card position from real mini-photo sample 3", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.3.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 166, y: 14, width: 79, height: 125 },
      { id: 2, x: 256, y: 14, width: 79, height: 125 },
      { id: 3, x: 346, y: 14, width: 79, height: 125 },
      { id: 4, x: 437, y: 14, width: 79, height: 125 },
      { id: 5, x: 527, y: 14, width: 79, height: 125 },
      { id: 6, x: 617, y: 14, width: 79, height: 125 },
      { id: 7, x: 31, y: 148, width: 79, height: 125 },
      { id: 8, x: 121, y: 148, width: 79, height: 125 },
      { id: 9, x: 211, y: 148, width: 79, height: 125 },
      { id: 10, x: 301, y: 148, width: 79, height: 125 },
      { id: 11, x: 392, y: 148, width: 79, height: 125 },
      { id: 12, x: 482, y: 148, width: 79, height: 125 },
      { id: 13, x: 572, y: 148, width: 79, height: 125 },
      { id: 14, x: 663, y: 148, width: 79, height: 125 },
      { id: 15, x: 753, y: 148, width: 79, height: 125 },
      { id: 16, x: 166, y: 281, width: 79, height: 125 },
      { id: 17, x: 256, y: 281, width: 79, height: 125 },
      { id: 18, x: 346, y: 281, width: 79, height: 125 },
      { id: 19, x: 437, y: 281, width: 79, height: 125 },
      { id: 20, x: 527, y: 281, width: 79, height: 125 },
      { id: 21, x: 617, y: 281, width: 79, height: 125 },
      { id: 22, x: 31, y: 412, width: 79, height: 125 },
      { id: 23, x: 121, y: 412, width: 79, height: 125 },
      { id: 24, x: 211, y: 412, width: 79, height: 125 },
      { id: 25, x: 301, y: 412, width: 79, height: 125 },
      { id: 26, x: 392, y: 412, width: 79, height: 125 },
      { id: 27, x: 482, y: 412, width: 79, height: 125 },
      { id: 28, x: 572, y: 412, width: 79, height: 125 },
      { id: 29, x: 663, y: 412, width: 79, height: 125 },
      { id: 30, x: 753, y: 412, width: 79, height: 125 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(4);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every card position from real mini-photo sample 4", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.4.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 18, y: 13, width: 28, height: 44 },
      { id: 2, x: 49, y: 13, width: 28, height: 44 },
      { id: 3, x: 79, y: 13, width: 28, height: 44 },
      { id: 4, x: 110, y: 13, width: 28, height: 44 },
      { id: 5, x: 140, y: 13, width: 28, height: 44 },
      { id: 6, x: 171, y: 13, width: 28, height: 44 },
      { id: 7, x: 201, y: 13, width: 28, height: 44 },
      { id: 8, x: 232, y: 13, width: 28, height: 44 },
      { id: 9, x: 262, y: 13, width: 28, height: 44 },
      { id: 10, x: 18, y: 63, width: 28, height: 44 },
      { id: 11, x: 49, y: 63, width: 28, height: 44 },
      { id: 12, x: 79, y: 63, width: 28, height: 44 },
      { id: 13, x: 110, y: 63, width: 28, height: 44 },
      { id: 14, x: 140, y: 63, width: 28, height: 44 },
      { id: 15, x: 171, y: 63, width: 28, height: 44 },
      { id: 16, x: 201, y: 63, width: 28, height: 44 },
      { id: 17, x: 232, y: 63, width: 28, height: 44 },
      { id: 18, x: 262, y: 63, width: 28, height: 44 },
      { id: 19, x: 18, y: 114, width: 28, height: 44 },
      { id: 20, x: 49, y: 114, width: 28, height: 44 },
      { id: 21, x: 79, y: 114, width: 28, height: 44 },
      { id: 22, x: 110, y: 114, width: 28, height: 44 },
      { id: 23, x: 140, y: 114, width: 28, height: 44 },
      { id: 24, x: 171, y: 114, width: 28, height: 44 },
      { id: 25, x: 201, y: 114, width: 28, height: 44 },
      { id: 26, x: 232, y: 114, width: 28, height: 44 },
      { id: 27, x: 262, y: 114, width: 28, height: 44 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every card position from real mini-photo sample 5", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.5.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 130, y: 40, width: 61, height: 96 },
      { id: 2, x: 209, y: 40, width: 61, height: 96 },
      { id: 3, x: 286, y: 40, width: 61, height: 96 },
      { id: 4, x: 364, y: 40, width: 61, height: 96 },
      { id: 5, x: 441, y: 40, width: 61, height: 96 },
      { id: 6, x: 518, y: 40, width: 61, height: 96 },
      { id: 7, x: 596, y: 40, width: 61, height: 96 },
      { id: 8, x: 674, y: 40, width: 61, height: 96 },
      { id: 9, x: 752, y: 40, width: 61, height: 96 },
      { id: 10, x: 247, y: 158, width: 61, height: 96 },
      { id: 11, x: 325, y: 158, width: 61, height: 96 },
      { id: 12, x: 402, y: 158, width: 61, height: 96 },
      { id: 13, x: 480, y: 158, width: 61, height: 96 },
      { id: 14, x: 557, y: 158, width: 61, height: 96 },
      { id: 15, x: 635, y: 158, width: 61, height: 96 },
      { id: 16, x: 247, y: 281, width: 61, height: 96 },
      { id: 17, x: 325, y: 281, width: 61, height: 96 },
      { id: 18, x: 402, y: 281, width: 61, height: 96 },
      { id: 19, x: 480, y: 281, width: 61, height: 96 },
      { id: 20, x: 557, y: 281, width: 61, height: 96 },
      { id: 21, x: 635, y: 281, width: 61, height: 96 },
      { id: 22, x: 123, y: 406, width: 61, height: 96 },
      { id: 23, x: 200, y: 406, width: 61, height: 96 },
      { id: 24, x: 278, y: 406, width: 61, height: 96 },
      { id: 25, x: 355, y: 406, width: 61, height: 96 },
      { id: 26, x: 433, y: 406, width: 61, height: 96 },
      { id: 27, x: 510, y: 406, width: 61, height: 96 },
      { id: 28, x: 588, y: 406, width: 61, height: 96 },
      { id: 29, x: 664, y: 406, width: 61, height: 96 },
      { id: 30, x: 743, y: 406, width: 61, height: 96 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(4);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every card position from real mini-photo sample 6", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.6.webp"));

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 9, y: 7, width: 26, height: 41 },
      { id: 2, x: 39, y: 7, width: 26, height: 41 },
      { id: 3, x: 69, y: 7, width: 26, height: 41 },
      { id: 4, x: 99, y: 7, width: 26, height: 41 },
      { id: 5, x: 129, y: 7, width: 26, height: 41 },
      { id: 6, x: 159, y: 7, width: 26, height: 41 },
      { id: 7, x: 189, y: 7, width: 26, height: 41 },
      { id: 8, x: 219, y: 7, width: 26, height: 41 },
      { id: 9, x: 250, y: 7, width: 26, height: 41 },
      { id: 10, x: 9, y: 52, width: 26, height: 41 },
      { id: 11, x: 39, y: 52, width: 26, height: 41 },
      { id: 12, x: 69, y: 52, width: 26, height: 41 },
      { id: 13, x: 99, y: 52, width: 26, height: 41 },
      { id: 14, x: 129, y: 52, width: 26, height: 41 },
      { id: 15, x: 159, y: 52, width: 26, height: 41 },
      { id: 16, x: 189, y: 52, width: 26, height: 41 },
      { id: 17, x: 219, y: 52, width: 26, height: 41 },
      { id: 18, x: 249, y: 52, width: 26, height: 41 },
      { id: 19, x: 8, y: 97, width: 26, height: 41 },
      { id: 20, x: 38, y: 97, width: 26, height: 41 },
      { id: 21, x: 68, y: 97, width: 26, height: 41 },
      { id: 22, x: 98, y: 97, width: 26, height: 41 },
      { id: 23, x: 128, y: 97, width: 26, height: 41 },
      { id: 24, x: 158, y: 97, width: 26, height: 41 },
      { id: 25, x: 189, y: 97, width: 26, height: 41 },
      { id: 26, x: 219, y: 97, width: 26, height: 41 },
      { id: 27, x: 249, y: 97, width: 26, height: 41 },
      { id: 28, x: 99, y: 143, width: 26, height: 41 },
      { id: 29, x: 128, y: 143, width: 26, height: 41 },
      { id: 30, x: 159, y: 143, width: 26, height: 41 },
    ]);
    expect(result.value.confidence).toBeGreaterThan(0.6);
    expect(result.value.diagnostics.rows).toBe(4);
    expect(result.value.diagnostics.columns).toBe(9);
  });
});

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

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractPhotoPositions, extractPhotoPositionsFromPixels } from "./extractPhotoPositions";
import type { PixelImage } from "./imageRegionExtraction/types";

describe("extractPhotoPositions", () => {
  it("extracts every photo position from real sample 1", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/photo-sample.1.webp"));

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 58, y: 32, width: 96, height: 137 },
      { id: 2, x: 157, y: 32, width: 96, height: 137 },
      { id: 3, x: 256, y: 32, width: 96, height: 137 },
      { id: 4, x: 355, y: 32, width: 96, height: 137 },
      { id: 5, x: 455, y: 32, width: 96, height: 137 },
      { id: 6, x: 553, y: 32, width: 96, height: 137 },
      { id: 7, x: 653, y: 32, width: 96, height: 137 },
      { id: 8, x: 752, y: 32, width: 96, height: 137 },
      { id: 9, x: 851, y: 32, width: 96, height: 137 },
      { id: 10, x: 58, y: 172, width: 96, height: 137 },
      { id: 11, x: 157, y: 172, width: 96, height: 137 },
      { id: 12, x: 256, y: 172, width: 96, height: 137 },
      { id: 13, x: 355, y: 172, width: 96, height: 137 },
      { id: 14, x: 454, y: 172, width: 96, height: 137 },
      { id: 15, x: 554, y: 172, width: 96, height: 137 },
      { id: 16, x: 653, y: 172, width: 96, height: 137 },
      { id: 17, x: 752, y: 172, width: 96, height: 137 },
      { id: 18, x: 851, y: 172, width: 96, height: 137 },
      { id: 19, x: 58, y: 312, width: 96, height: 137 },
      { id: 20, x: 157, y: 312, width: 96, height: 137 },
      { id: 21, x: 256, y: 312, width: 96, height: 137 },
      { id: 22, x: 355, y: 312, width: 96, height: 137 },
      { id: 23, x: 454, y: 312, width: 96, height: 137 },
      { id: 24, x: 553, y: 312, width: 96, height: 137 },
      { id: 25, x: 653, y: 312, width: 96, height: 137 },
      { id: 26, x: 752, y: 312, width: 96, height: 137 },
      { id: 27, x: 851, y: 312, width: 96, height: 137 },
    ]);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every photo position from real sample 2", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/photo-sample.2.webp"));

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 29, y: 24, width: 82, height: 116 },
      { id: 2, x: 115, y: 24, width: 82, height: 116 },
      { id: 3, x: 202, y: 24, width: 82, height: 116 },
      { id: 4, x: 289, y: 24, width: 82, height: 116 },
      { id: 5, x: 376, y: 24, width: 82, height: 116 },
      { id: 6, x: 463, y: 24, width: 82, height: 116 },
      { id: 7, x: 549, y: 24, width: 82, height: 116 },
      { id: 8, x: 636, y: 24, width: 82, height: 116 },
      { id: 9, x: 723, y: 24, width: 82, height: 116 },
      { id: 10, x: 29, y: 145, width: 82, height: 116 },
      { id: 11, x: 116, y: 145, width: 82, height: 116 },
      { id: 12, x: 202, y: 145, width: 82, height: 116 },
      { id: 13, x: 288, y: 145, width: 82, height: 116 },
      { id: 14, x: 375, y: 145, width: 82, height: 116 },
      { id: 15, x: 463, y: 145, width: 82, height: 116 },
      { id: 16, x: 549, y: 145, width: 82, height: 116 },
      { id: 17, x: 636, y: 145, width: 82, height: 116 },
      { id: 18, x: 723, y: 145, width: 82, height: 116 },
      { id: 19, x: 29, y: 266, width: 82, height: 116 },
      { id: 20, x: 116, y: 266, width: 82, height: 116 },
      { id: 21, x: 202, y: 266, width: 82, height: 116 },
      { id: 22, x: 289, y: 266, width: 82, height: 116 },
      { id: 23, x: 376, y: 266, width: 82, height: 116 },
      { id: 24, x: 463, y: 266, width: 82, height: 116 },
      { id: 25, x: 549, y: 266, width: 82, height: 116 },
      { id: 26, x: 636, y: 266, width: 82, height: 116 },
      { id: 27, x: 723, y: 266, width: 82, height: 116 },
    ]);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every photo position from real sample 3", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/photo-sample.3.webp"));

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 48, y: 26, width: 83, height: 118 },
      { id: 2, x: 137, y: 26, width: 83, height: 118 },
      { id: 3, x: 225, y: 26, width: 83, height: 118 },
      { id: 4, x: 314, y: 26, width: 83, height: 118 },
      { id: 5, x: 403, y: 26, width: 83, height: 118 },
      { id: 6, x: 492, y: 26, width: 83, height: 118 },
      { id: 7, x: 581, y: 26, width: 83, height: 118 },
      { id: 8, x: 670, y: 26, width: 83, height: 118 },
      { id: 9, x: 759, y: 26, width: 83, height: 118 },
      { id: 10, x: 48, y: 150, width: 83, height: 118 },
      { id: 11, x: 137, y: 150, width: 83, height: 118 },
      { id: 12, x: 225, y: 150, width: 83, height: 118 },
      { id: 13, x: 314, y: 150, width: 83, height: 118 },
      { id: 14, x: 403, y: 150, width: 83, height: 118 },
      { id: 15, x: 492, y: 150, width: 83, height: 118 },
      { id: 16, x: 581, y: 150, width: 83, height: 118 },
      { id: 17, x: 670, y: 150, width: 83, height: 118 },
      { id: 18, x: 759, y: 150, width: 83, height: 118 },
      { id: 19, x: 48, y: 274, width: 83, height: 118 },
      { id: 20, x: 137, y: 274, width: 83, height: 118 },
      { id: 21, x: 225, y: 274, width: 83, height: 118 },
      { id: 22, x: 314, y: 274, width: 83, height: 118 },
      { id: 23, x: 403, y: 274, width: 83, height: 118 },
      { id: 24, x: 492, y: 274, width: 83, height: 118 },
      { id: 25, x: 581, y: 274, width: 83, height: 118 },
      { id: 26, x: 670, y: 274, width: 83, height: 118 },
      { id: 27, x: 759, y: 274, width: 83, height: 118 },
    ]);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });

  it("extracts every photo position from low-resolution sample 4", async () => {
    const input = await readFile(path.resolve("scripts/lib/test-fixture/photo-sample.4.webp"));

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 7, y: 8, width: 34, height: 48 },
      { id: 2, x: 41, y: 8, width: 34, height: 48 },
      { id: 3, x: 76, y: 8, width: 34, height: 48 },
      { id: 4, x: 110, y: 8, width: 34, height: 48 },
      { id: 5, x: 145, y: 8, width: 34, height: 48 },
      { id: 6, x: 179, y: 8, width: 34, height: 48 },
      { id: 7, x: 214, y: 8, width: 34, height: 48 },
      { id: 8, x: 249, y: 8, width: 34, height: 48 },
      { id: 9, x: 283, y: 8, width: 34, height: 48 },
      { id: 10, x: 7, y: 57, width: 34, height: 48 },
      { id: 11, x: 41, y: 57, width: 34, height: 48 },
      { id: 12, x: 76, y: 57, width: 34, height: 48 },
      { id: 13, x: 110, y: 57, width: 34, height: 48 },
      { id: 14, x: 145, y: 57, width: 34, height: 48 },
      { id: 15, x: 179, y: 57, width: 34, height: 48 },
      { id: 16, x: 214, y: 57, width: 34, height: 48 },
      { id: 17, x: 249, y: 57, width: 34, height: 48 },
      { id: 18, x: 283, y: 57, width: 34, height: 48 },
      { id: 19, x: 7, y: 106, width: 34, height: 48 },
      { id: 20, x: 41, y: 106, width: 34, height: 48 },
      { id: 21, x: 77, y: 106, width: 34, height: 48 },
      { id: 22, x: 110, y: 106, width: 34, height: 48 },
      { id: 23, x: 145, y: 106, width: 34, height: 48 },
      { id: 24, x: 179, y: 106, width: 34, height: 48 },
      { id: 25, x: 214, y: 106, width: 34, height: 48 },
      { id: 26, x: 249, y: 106, width: 34, height: 48 },
      { id: 27, x: 283, y: 106, width: 34, height: 48 },
    ]);
    expect(result.value.diagnostics.rows).toBe(3);
    expect(result.value.diagnostics.columns).toBe(9);
  });
});

describe("extractPhotoPositionsFromPixels", () => {
  it("splits connected low-contrast photos without assuming a fixed grid size", () => {
    const width = 50;
    const height = 52;
    const channels = 3;
    const data = new Uint8Array(width * height * channels).fill(255);
    const image: PixelImage = { width, height, channels, data };
    [3, 28].forEach((y) => {
      for (let offsetY = 0; offsetY < 20; offsetY += 1) {
        for (let x = 4; x < 46; x += 1) {
          const index = ((y + offsetY) * width + x) * channels;
          data[index] = 220;
          data[index + 1] = 220;
          data[index + 2] = 220;
        }
      }
    });

    const result = extractPhotoPositionsFromPixels(image, { normalizeMode: "none" });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 4, y: 3, width: 14, height: 20 },
      { id: 2, x: 18, y: 3, width: 14, height: 20 },
      { id: 3, x: 32, y: 3, width: 14, height: 20 },
      { id: 4, x: 4, y: 28, width: 14, height: 20 },
      { id: 5, x: 18, y: 28, width: 14, height: 20 },
      { id: 6, x: 32, y: 28, width: 14, height: 20 },
    ]);
  });
});

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractPhotoPositions } from "./extractPhotoPositions";

describe("extractPhotoPositions for catalog images", () => {
  it("extracts 晴れ着2026", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2026/2026-01-01_生写真「晴れ着2026」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 98, y: 292, width: 192, height: 274 },
      { id: 2, x: 316, y: 290, width: 192, height: 274 },
      { id: 3, x: 527, y: 292, width: 192, height: 274 },
      { id: 4, x: 755, y: 287, width: 192, height: 274 },
      { id: 5, x: 981, y: 292, width: 192, height: 274 },
      { id: 6, x: 1206, y: 297, width: 192, height: 274 },
      { id: 7, x: 91, y: 596, width: 192, height: 274 },
      { id: 8, x: 316, y: 595, width: 192, height: 274 },
      { id: 9, x: 533, y: 595, width: 192, height: 274 },
      { id: 10, x: 757, y: 592, width: 192, height: 274 },
      { id: 11, x: 981, y: 596, width: 192, height: 274 },
      { id: 12, x: 1206, y: 596, width: 192, height: 274 },
      { id: 13, x: 88, y: 898, width: 192, height: 274 },
      { id: 14, x: 316, y: 898, width: 192, height: 274 },
      { id: 15, x: 532, y: 898, width: 192, height: 274 },
      { id: 16, x: 759, y: 898, width: 192, height: 274 },
      { id: 17, x: 981, y: 898, width: 192, height: 274 },
      { id: 18, x: 1202, y: 898, width: 192, height: 274 },
      { id: 19, x: 88, y: 1201, width: 192, height: 274 },
      { id: 20, x: 312, y: 1201, width: 192, height: 274 },
      { id: 21, x: 533, y: 1201, width: 192, height: 274 },
      { id: 22, x: 759, y: 1201, width: 192, height: 274 },
      { id: 23, x: 980, y: 1201, width: 192, height: 274 },
      { id: 24, x: 1202, y: 1201, width: 192, height: 274 },
      { id: 25, x: 91, y: 1501, width: 192, height: 274 },
      { id: 26, x: 312, y: 1501, width: 192, height: 274 },
      { id: 27, x: 533, y: 1501, width: 192, height: 274 },
    ]);
  });

  it("extracts 見上げるたびに、恋をする。衣装", async () => {
    const input = await readFile(
      path.resolve(
        "public/takaneko/goods/2026/2026-01-01_生写真「見上げるたびに、恋をする。衣装」.webp",
      ),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 81, y: 288, width: 188, height: 268 },
      { id: 2, x: 312, y: 288, width: 188, height: 268 },
      { id: 3, x: 540, y: 288, width: 188, height: 268 },
      { id: 4, x: 771, y: 288, width: 188, height: 268 },
      { id: 5, x: 1004, y: 288, width: 188, height: 268 },
      { id: 6, x: 1232, y: 288, width: 188, height: 268 },
      { id: 7, x: 81, y: 601, width: 188, height: 268 },
      { id: 8, x: 312, y: 601, width: 188, height: 268 },
      { id: 9, x: 539, y: 601, width: 188, height: 268 },
      { id: 10, x: 771, y: 601, width: 188, height: 268 },
      { id: 11, x: 1004, y: 601, width: 188, height: 268 },
      { id: 12, x: 1232, y: 601, width: 188, height: 268 },
      { id: 13, x: 81, y: 908, width: 188, height: 268 },
      { id: 14, x: 312, y: 908, width: 188, height: 268 },
      { id: 15, x: 540, y: 908, width: 188, height: 268 },
      { id: 16, x: 771, y: 908, width: 188, height: 268 },
      { id: 17, x: 1004, y: 908, width: 188, height: 268 },
      { id: 18, x: 1232, y: 908, width: 188, height: 268 },
      { id: 19, x: 81, y: 1221, width: 188, height: 268 },
      { id: 20, x: 312, y: 1221, width: 188, height: 268 },
      { id: 21, x: 540, y: 1221, width: 188, height: 268 },
      { id: 22, x: 771, y: 1221, width: 188, height: 268 },
      { id: 23, x: 1004, y: 1221, width: 188, height: 268 },
      { id: 24, x: 1231, y: 1221, width: 188, height: 268 },
      { id: 25, x: 81, y: 1536, width: 188, height: 268 },
      { id: 26, x: 311, y: 1536, width: 188, height: 268 },
      { id: 27, x: 540, y: 1536, width: 188, height: 268 },
    ]);
  });

  it("extracts たかねこハロウィン2025", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-10-29_生写真「たかねこハロウィン2025」.jpg"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 45, y: 238, width: 176, height: 251 },
      { id: 2, x: 232, y: 238, width: 176, height: 251 },
      { id: 3, x: 419, y: 238, width: 176, height: 251 },
      { id: 4, x: 606, y: 238, width: 176, height: 251 },
      { id: 5, x: 793, y: 238, width: 176, height: 251 },
      { id: 6, x: 980, y: 238, width: 176, height: 251 },
      { id: 7, x: 45, y: 519, width: 176, height: 251 },
      { id: 8, x: 232, y: 519, width: 176, height: 251 },
      { id: 9, x: 419, y: 519, width: 176, height: 251 },
      { id: 10, x: 606, y: 519, width: 176, height: 251 },
      { id: 11, x: 793, y: 519, width: 176, height: 251 },
      { id: 12, x: 980, y: 519, width: 176, height: 251 },
      { id: 13, x: 45, y: 799, width: 176, height: 251 },
      { id: 14, x: 232, y: 799, width: 176, height: 251 },
      { id: 15, x: 419, y: 799, width: 176, height: 251 },
      { id: 16, x: 606, y: 799, width: 176, height: 251 },
      { id: 17, x: 793, y: 799, width: 176, height: 251 },
      { id: 18, x: 980, y: 799, width: 176, height: 251 },
      { id: 19, x: 45, y: 1080, width: 176, height: 251 },
      { id: 20, x: 232, y: 1080, width: 176, height: 251 },
      { id: 21, x: 419, y: 1080, width: 176, height: 251 },
      { id: 22, x: 606, y: 1080, width: 176, height: 251 },
      { id: 23, x: 793, y: 1080, width: 176, height: 251 },
      { id: 24, x: 980, y: 1080, width: 176, height: 251 },
      { id: 25, x: 45, y: 1361, width: 176, height: 251 },
      { id: 26, x: 232, y: 1361, width: 176, height: 251 },
      { id: 27, x: 419, y: 1361, width: 176, height: 251 },
    ]);
  });

  it("extracts クリスマス2024", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2024/2024-12-25_生写真「クリスマス2024」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 44, y: 239, width: 235, height: 335 },
      { id: 2, x: 315, y: 239, width: 235, height: 335 },
      { id: 3, x: 587, y: 239, width: 235, height: 335 },
      { id: 4, x: 859, y: 239, width: 235, height: 335 },
      { id: 5, x: 1130, y: 239, width: 235, height: 335 },
      { id: 6, x: 1402, y: 239, width: 234, height: 335 },
      { id: 7, x: 44, y: 602, width: 235, height: 335 },
      { id: 8, x: 315, y: 602, width: 235, height: 335 },
      { id: 9, x: 587, y: 602, width: 235, height: 335 },
      { id: 10, x: 1130, y: 602, width: 235, height: 335 },
      { id: 11, x: 1402, y: 602, width: 234, height: 335 },
      { id: 12, x: 315, y: 970, width: 235, height: 335 },
      { id: 13, x: 587, y: 970, width: 235, height: 335 },
      { id: 14, x: 1130, y: 970, width: 235, height: 335 },
      { id: 15, x: 1402, y: 970, width: 234, height: 335 },
      { id: 16, x: 315, y: 1327, width: 235, height: 335 },
      { id: 17, x: 587, y: 1327, width: 235, height: 335 },
      { id: 18, x: 1130, y: 1327, width: 235, height: 335 },
      { id: 19, x: 1402, y: 1327, width: 234, height: 335 },
      { id: 20, x: 44, y: 1695, width: 235, height: 335 },
      { id: 21, x: 315, y: 1695, width: 235, height: 335 },
      { id: 22, x: 587, y: 1695, width: 235, height: 335 },
      { id: 23, x: 859, y: 1695, width: 235, height: 335 },
      { id: 24, x: 1130, y: 1695, width: 235, height: 335 },
      { id: 25, x: 1402, y: 1695, width: 234, height: 335 },
    ]);
  });
});

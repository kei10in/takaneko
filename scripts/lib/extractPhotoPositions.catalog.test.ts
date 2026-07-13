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
      { id: 1, x: 45, y: 1, width: 192, height: 288 },
      { id: 2, x: 263, y: 1, width: 192, height: 288 },
      { id: 3, x: 480, y: 1, width: 192, height: 288 },
      { id: 4, x: 642, y: 1, width: 192, height: 288 },
      { id: 5, x: 857, y: 1, width: 192, height: 288 },
      { id: 6, x: 1071, y: 1, width: 192, height: 288 },
      { id: 7, x: 1246, y: 1, width: 192, height: 288 },
      { id: 8, x: 45, y: 286, width: 192, height: 288 },
      { id: 9, x: 263, y: 286, width: 192, height: 288 },
      { id: 10, x: 480, y: 286, width: 192, height: 288 },
      { id: 11, x: 642, y: 286, width: 192, height: 288 },
      { id: 12, x: 857, y: 286, width: 192, height: 288 },
      { id: 13, x: 1071, y: 286, width: 192, height: 288 },
      { id: 14, x: 45, y: 571, width: 192, height: 288 },
      { id: 15, x: 263, y: 571, width: 192, height: 288 },
      { id: 16, x: 480, y: 571, width: 192, height: 288 },
      { id: 17, x: 642, y: 571, width: 192, height: 288 },
      { id: 18, x: 857, y: 571, width: 192, height: 288 },
      { id: 19, x: 1071, y: 571, width: 192, height: 288 },
      { id: 20, x: 1246, y: 571, width: 192, height: 288 },
      { id: 21, x: 45, y: 898, width: 192, height: 288 },
      { id: 22, x: 263, y: 898, width: 192, height: 288 },
      { id: 23, x: 480, y: 898, width: 192, height: 288 },
      { id: 24, x: 642, y: 898, width: 192, height: 288 },
      { id: 25, x: 857, y: 898, width: 192, height: 288 },
      { id: 26, x: 1071, y: 898, width: 192, height: 288 },
      { id: 27, x: 45, y: 1202, width: 192, height: 288 },
      { id: 28, x: 263, y: 1202, width: 192, height: 288 },
      { id: 29, x: 480, y: 1202, width: 192, height: 288 },
      { id: 30, x: 642, y: 1202, width: 192, height: 288 },
      { id: 31, x: 857, y: 1202, width: 192, height: 288 },
      { id: 32, x: 1071, y: 1202, width: 192, height: 288 },
      { id: 33, x: 45, y: 1502, width: 192, height: 288 },
      { id: 34, x: 263, y: 1502, width: 192, height: 288 },
      { id: 35, x: 480, y: 1502, width: 192, height: 288 },
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

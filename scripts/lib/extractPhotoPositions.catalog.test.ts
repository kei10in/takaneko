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

  it("extracts 2024年バレンタイン", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2024/2024-02-14_生写真「2024年バレンタイン」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 20, y: 154, width: 161, height: 230 },
      { id: 2, x: 215, y: 154, width: 161, height: 230 },
      { id: 3, x: 410, y: 154, width: 161, height: 230 },
      { id: 4, x: 605, y: 154, width: 161, height: 230 },
      { id: 5, x: 800, y: 154, width: 161, height: 230 },
      { id: 6, x: 995, y: 154, width: 161, height: 230 },
      { id: 7, x: 20, y: 392, width: 161, height: 230 },
      { id: 8, x: 215, y: 392, width: 161, height: 230 },
      { id: 9, x: 410, y: 392, width: 161, height: 230 },
      { id: 10, x: 605, y: 392, width: 161, height: 230 },
      { id: 11, x: 800, y: 392, width: 161, height: 230 },
      { id: 12, x: 995, y: 392, width: 161, height: 230 },
      { id: 13, x: 20, y: 629, width: 161, height: 230 },
      { id: 14, x: 215, y: 629, width: 161, height: 230 },
      { id: 15, x: 410, y: 629, width: 161, height: 230 },
      { id: 16, x: 605, y: 629, width: 161, height: 230 },
      { id: 17, x: 800, y: 629, width: 161, height: 230 },
      { id: 18, x: 995, y: 629, width: 161, height: 230 },
      { id: 19, x: 20, y: 867, width: 161, height: 230 },
      { id: 20, x: 215, y: 867, width: 161, height: 230 },
      { id: 21, x: 410, y: 867, width: 161, height: 230 },
      { id: 22, x: 605, y: 867, width: 161, height: 230 },
      { id: 23, x: 800, y: 867, width: 161, height: 230 },
      { id: 24, x: 995, y: 867, width: 161, height: 230 },
      { id: 25, x: 20, y: 1104, width: 161, height: 230 },
      { id: 26, x: 215, y: 1104, width: 161, height: 230 },
      { id: 27, x: 410, y: 1104, width: 161, height: 230 },
      { id: 28, x: 605, y: 1104, width: 161, height: 231 },
      { id: 29, x: 800, y: 1104, width: 161, height: 231 },
      { id: 30, x: 995, y: 1104, width: 161, height: 230 },
    ]);
  });

  it("extracts 白ワンピース", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2024/2024-08-07_生写真「白ワンピース」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 44, y: 240, width: 235, height: 335 },
      { id: 2, x: 316, y: 240, width: 235, height: 335 },
      { id: 3, x: 587, y: 240, width: 235, height: 335 },
      { id: 4, x: 859, y: 240, width: 235, height: 335 },
      { id: 5, x: 1131, y: 240, width: 235, height: 335 },
      { id: 6, x: 1402, y: 240, width: 235, height: 335 },
      { id: 7, x: 44, y: 593, width: 235, height: 335 },
      { id: 8, x: 316, y: 593, width: 235, height: 335 },
      { id: 9, x: 587, y: 593, width: 235, height: 335 },
      { id: 10, x: 859, y: 593, width: 235, height: 335 },
      { id: 11, x: 1131, y: 593, width: 235, height: 335 },
      { id: 12, x: 1402, y: 593, width: 235, height: 335 },
      { id: 13, x: 44, y: 960, width: 235, height: 335 },
      { id: 14, x: 316, y: 960, width: 235, height: 335 },
      { id: 15, x: 587, y: 960, width: 235, height: 335 },
      { id: 16, x: 859, y: 960, width: 235, height: 335 },
      { id: 17, x: 1131, y: 960, width: 235, height: 335 },
      { id: 18, x: 1402, y: 960, width: 235, height: 335 },
      { id: 19, x: 44, y: 1329, width: 235, height: 335 },
      { id: 20, x: 316, y: 1329, width: 235, height: 335 },
      { id: 21, x: 587, y: 1329, width: 235, height: 335 },
      { id: 22, x: 859, y: 1329, width: 235, height: 335 },
      { id: 23, x: 1131, y: 1329, width: 235, height: 335 },
      { id: 24, x: 1402, y: 1329, width: 235, height: 335 },
      { id: 25, x: 44, y: 1696, width: 235, height: 335 },
      { id: 26, x: 316, y: 1696, width: 235, height: 335 },
      { id: 27, x: 587, y: 1696, width: 235, height: 335 },
      { id: 28, x: 859, y: 1696, width: 235, height: 335 },
      { id: 29, x: 1131, y: 1696, width: 235, height: 335 },
      { id: 30, x: 1402, y: 1696, width: 235, height: 335 },
    ]);
  });

  it("extracts ワンピース", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2024/2024-05-27_生写真「ワンピース」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 42, y: 226, width: 220, height: 315 },
      { id: 2, x: 297, y: 226, width: 220, height: 315 },
      { id: 3, x: 552, y: 226, width: 220, height: 315 },
      { id: 4, x: 808, y: 226, width: 220, height: 315 },
      { id: 5, x: 1063, y: 226, width: 220, height: 315 },
      { id: 6, x: 1318, y: 226, width: 220, height: 315 },
      { id: 7, x: 42, y: 557, width: 220, height: 315 },
      { id: 8, x: 297, y: 557, width: 220, height: 315 },
      { id: 9, x: 552, y: 557, width: 220, height: 315 },
      { id: 10, x: 808, y: 557, width: 220, height: 315 },
      { id: 11, x: 1063, y: 557, width: 220, height: 315 },
      { id: 12, x: 1318, y: 557, width: 220, height: 315 },
      { id: 13, x: 42, y: 903, width: 220, height: 315 },
      { id: 14, x: 297, y: 903, width: 220, height: 315 },
      { id: 15, x: 552, y: 903, width: 220, height: 315 },
      { id: 16, x: 808, y: 903, width: 220, height: 315 },
      { id: 17, x: 1063, y: 903, width: 220, height: 315 },
      { id: 18, x: 1318, y: 903, width: 220, height: 315 },
      { id: 19, x: 42, y: 1249, width: 220, height: 315 },
      { id: 20, x: 297, y: 1249, width: 220, height: 315 },
      { id: 21, x: 552, y: 1249, width: 220, height: 315 },
      { id: 22, x: 808, y: 1249, width: 220, height: 315 },
      { id: 23, x: 1063, y: 1249, width: 220, height: 315 },
      { id: 24, x: 1318, y: 1249, width: 220, height: 315 },
      { id: 25, x: 42, y: 1595, width: 220, height: 315 },
      { id: 26, x: 297, y: 1595, width: 220, height: 315 },
      { id: 27, x: 552, y: 1595, width: 220, height: 315 },
      { id: 28, x: 808, y: 1595, width: 220, height: 315 },
      { id: 29, x: 1063, y: 1595, width: 220, height: 315 },
      { id: 30, x: 1318, y: 1595, width: 220, height: 315 },
    ]);
  });

  it("extracts ライブ女子", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2024/2024-10-30_生写真「ライブ女子」.webp"),
    );

    const result = await extractPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 44, y: 240, width: 233, height: 332 },
      { id: 2, x: 316, y: 240, width: 233, height: 332 },
      { id: 3, x: 587, y: 240, width: 233, height: 332 },
      { id: 4, x: 859, y: 240, width: 233, height: 332 },
      { id: 5, x: 1131, y: 240, width: 233, height: 332 },
      { id: 6, x: 1403, y: 240, width: 233, height: 332 },
      { id: 7, x: 44, y: 593, width: 233, height: 332 },
      { id: 8, x: 316, y: 593, width: 233, height: 332 },
      { id: 9, x: 587, y: 593, width: 233, height: 332 },
      { id: 10, x: 859, y: 593, width: 233, height: 332 },
      { id: 11, x: 1131, y: 593, width: 233, height: 332 },
      { id: 12, x: 1403, y: 593, width: 233, height: 332 },
      { id: 13, x: 44, y: 960, width: 233, height: 332 },
      { id: 14, x: 316, y: 960, width: 233, height: 332 },
      { id: 15, x: 587, y: 960, width: 233, height: 332 },
      { id: 16, x: 859, y: 960, width: 233, height: 332 },
      { id: 17, x: 1131, y: 960, width: 233, height: 332 },
      { id: 18, x: 1403, y: 960, width: 233, height: 332 },
      { id: 19, x: 44, y: 1329, width: 233, height: 332 },
      { id: 20, x: 316, y: 1329, width: 233, height: 332 },
      { id: 21, x: 587, y: 1329, width: 233, height: 332 },
      { id: 22, x: 859, y: 1329, width: 233, height: 332 },
      { id: 23, x: 1131, y: 1329, width: 233, height: 332 },
      { id: 24, x: 1403, y: 1329, width: 233, height: 332 },
      { id: 25, x: 44, y: 1697, width: 233, height: 332 },
      { id: 26, x: 316, y: 1697, width: 233, height: 332 },
      { id: 27, x: 587, y: 1697, width: 233, height: 332 },
      { id: 28, x: 859, y: 1697, width: 233, height: 332 },
      { id: 29, x: 1131, y: 1697, width: 233, height: 332 },
      { id: 30, x: 1403, y: 1697, width: 233, height: 332 },
    ]);
  });
});

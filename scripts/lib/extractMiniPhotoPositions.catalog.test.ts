import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractMiniPhotoPositions } from "./extractMiniPhotoPositions";

describe("extractMiniPhotoPositions for catalog images", { timeout: 15_000 }, () => {
  it("extracts 晴れ着2025", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-01-02_ミニフォトカード「晴れ着2025」.webp"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 54, y: 165, width: 154, height: 250 },
      { id: 2, x: 222, y: 165, width: 154, height: 250 },
      { id: 3, x: 390, y: 165, width: 154, height: 250 },
      { id: 4, x: 558, y: 165, width: 154, height: 250 },
      { id: 5, x: 726, y: 165, width: 154, height: 250 },
      { id: 6, x: 894, y: 165, width: 154, height: 250 },
      { id: 7, x: 54, y: 427, width: 154, height: 250 },
      { id: 8, x: 222, y: 427, width: 154, height: 250 },
      { id: 9, x: 390, y: 427, width: 154, height: 250 },
      { id: 10, x: 558, y: 427, width: 154, height: 250 },
      { id: 11, x: 726, y: 427, width: 154, height: 250 },
      { id: 12, x: 894, y: 427, width: 154, height: 250 },
      { id: 13, x: 54, y: 689, width: 154, height: 250 },
      { id: 14, x: 222, y: 689, width: 154, height: 250 },
      { id: 15, x: 390, y: 689, width: 154, height: 250 },
      { id: 16, x: 558, y: 689, width: 154, height: 250 },
      { id: 17, x: 726, y: 689, width: 154, height: 250 },
      { id: 18, x: 894, y: 689, width: 154, height: 250 },
      { id: 19, x: 54, y: 951, width: 154, height: 250 },
      { id: 20, x: 222, y: 951, width: 154, height: 250 },
      { id: 21, x: 390, y: 951, width: 154, height: 250 },
      { id: 22, x: 558, y: 951, width: 154, height: 250 },
      { id: 23, x: 726, y: 951, width: 154, height: 250 },
      { id: 24, x: 894, y: 951, width: 154, height: 250 },
      { id: 25, x: 54, y: 1213, width: 154, height: 250 },
      { id: 26, x: 222, y: 1213, width: 154, height: 250 },
      { id: 27, x: 390, y: 1213, width: 154, height: 250 },
      { id: 28, x: 558, y: 1213, width: 154, height: 250 },
      { id: 29, x: 726, y: 1213, width: 154, height: 250 },
      { id: 30, x: 894, y: 1213, width: 154, height: 250 },
    ]);
  });

  it("extracts ピンク衣装", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-03-05_ミニフォトカード「ピンク衣装」.webp"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 43, y: 228, width: 189, height: 298 },
      { id: 2, x: 289, y: 228, width: 189, height: 298 },
      { id: 3, x: 535, y: 228, width: 189, height: 298 },
      { id: 4, x: 782, y: 228, width: 189, height: 298 },
      { id: 5, x: 1028, y: 228, width: 189, height: 298 },
      { id: 6, x: 1274, y: 228, width: 189, height: 298 },
      { id: 7, x: 43, y: 543, width: 189, height: 298 },
      { id: 8, x: 289, y: 543, width: 189, height: 298 },
      { id: 9, x: 535, y: 543, width: 189, height: 298 },
      { id: 10, x: 782, y: 543, width: 189, height: 298 },
      { id: 11, x: 1028, y: 543, width: 189, height: 298 },
      { id: 12, x: 1274, y: 543, width: 189, height: 298 },
      { id: 13, x: 43, y: 859, width: 189, height: 298 },
      { id: 14, x: 289, y: 859, width: 189, height: 298 },
      { id: 15, x: 535, y: 859, width: 189, height: 298 },
      { id: 16, x: 782, y: 859, width: 189, height: 298 },
      { id: 17, x: 1028, y: 859, width: 189, height: 298 },
      { id: 18, x: 1274, y: 859, width: 189, height: 298 },
      { id: 19, x: 43, y: 1174, width: 189, height: 298 },
      { id: 20, x: 289, y: 1174, width: 189, height: 298 },
      { id: 21, x: 535, y: 1174, width: 189, height: 298 },
      { id: 22, x: 782, y: 1174, width: 189, height: 298 },
      { id: 23, x: 1028, y: 1174, width: 189, height: 298 },
      { id: 24, x: 1274, y: 1174, width: 189, height: 298 },
      { id: 25, x: 43, y: 1490, width: 189, height: 298 },
      { id: 26, x: 289, y: 1490, width: 189, height: 298 },
      { id: 27, x: 535, y: 1490, width: 189, height: 298 },
      { id: 28, x: 782, y: 1490, width: 189, height: 298 },
      { id: 29, x: 1028, y: 1490, width: 189, height: 298 },
      { id: 30, x: 1274, y: 1490, width: 189, height: 298 },
    ]);
  });

  it("extracts アイドル衣装", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-06-17_ミニフォトカード「アイドル衣装」.webp"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 33, y: 192, width: 159, height: 250 },
      { id: 2, x: 241, y: 192, width: 159, height: 250 },
      { id: 3, x: 450, y: 192, width: 159, height: 250 },
      { id: 4, x: 653, y: 192, width: 159, height: 250 },
      { id: 5, x: 861, y: 192, width: 159, height: 250 },
      { id: 6, x: 1068, y: 192, width: 159, height: 250 },
      { id: 7, x: 33, y: 457, width: 159, height: 250 },
      { id: 8, x: 241, y: 457, width: 159, height: 250 },
      { id: 9, x: 450, y: 457, width: 159, height: 250 },
      { id: 10, x: 653, y: 457, width: 159, height: 250 },
      { id: 11, x: 861, y: 457, width: 159, height: 250 },
      { id: 12, x: 1068, y: 457, width: 159, height: 250 },
      { id: 13, x: 33, y: 722, width: 159, height: 250 },
      { id: 14, x: 241, y: 722, width: 159, height: 250 },
      { id: 15, x: 450, y: 722, width: 159, height: 250 },
      { id: 16, x: 653, y: 722, width: 159, height: 250 },
      { id: 17, x: 861, y: 722, width: 159, height: 250 },
      { id: 18, x: 1068, y: 722, width: 159, height: 250 },
      { id: 19, x: 33, y: 987, width: 159, height: 250 },
      { id: 20, x: 241, y: 987, width: 159, height: 250 },
      { id: 21, x: 450, y: 987, width: 159, height: 250 },
      { id: 22, x: 653, y: 987, width: 159, height: 250 },
      { id: 23, x: 861, y: 987, width: 159, height: 250 },
      { id: 24, x: 1068, y: 987, width: 159, height: 250 },
      { id: 25, x: 33, y: 1252, width: 159, height: 250 },
      { id: 26, x: 241, y: 1252, width: 159, height: 250 },
      { id: 27, x: 450, y: 1252, width: 159, height: 250 },
      { id: 28, x: 653, y: 1252, width: 159, height: 250 },
      { id: 29, x: 861, y: 1252, width: 159, height: 250 },
      { id: 30, x: 1068, y: 1252, width: 159, height: 250 },
    ]);
  });

  it("extracts 2025 浴衣", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-08-07_ミニフォトカード「2025 浴衣」.webp"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 82, y: 422, width: 223, height: 341 },
      { id: 2, x: 323, y: 422, width: 223, height: 341 },
      { id: 3, x: 564, y: 422, width: 223, height: 341 },
      { id: 4, x: 805, y: 422, width: 223, height: 341 },
      { id: 5, x: 1046, y: 422, width: 223, height: 341 },
      { id: 6, x: 1287, y: 422, width: 223, height: 341 },
      { id: 7, x: 82, y: 781, width: 223, height: 341 },
      { id: 8, x: 323, y: 781, width: 223, height: 341 },
      { id: 9, x: 564, y: 781, width: 223, height: 341 },
      { id: 10, x: 805, y: 781, width: 223, height: 341 },
      { id: 11, x: 1046, y: 781, width: 223, height: 341 },
      { id: 12, x: 1287, y: 781, width: 223, height: 341 },
      { id: 13, x: 82, y: 1140, width: 223, height: 341 },
      { id: 14, x: 323, y: 1140, width: 223, height: 341 },
      { id: 15, x: 564, y: 1140, width: 223, height: 341 },
      { id: 16, x: 805, y: 1140, width: 223, height: 341 },
      { id: 17, x: 1046, y: 1140, width: 223, height: 341 },
      { id: 18, x: 1287, y: 1140, width: 223, height: 341 },
      { id: 19, x: 82, y: 1499, width: 223, height: 341 },
      { id: 20, x: 323, y: 1499, width: 223, height: 341 },
      { id: 21, x: 564, y: 1499, width: 223, height: 341 },
      { id: 22, x: 805, y: 1499, width: 223, height: 341 },
      { id: 23, x: 1046, y: 1499, width: 223, height: 341 },
      { id: 24, x: 1287, y: 1499, width: 223, height: 341 },
      { id: 25, x: 80, y: 1858, width: 223, height: 341 },
      { id: 26, x: 320, y: 1858, width: 223, height: 341 },
      { id: 27, x: 560, y: 1858, width: 223, height: 341 },
    ]);
  });

  it("extracts たかねこハロウィン2025", async () => {
    const input = await readFile(
      path.resolve(
        "public/takaneko/goods/2025/2025-10-28_ミニフォトカード「たかねこハロウィン2025」.jpg",
      ),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 51, y: 234, width: 164, height: 259 },
      { id: 2, x: 238, y: 234, width: 164, height: 259 },
      { id: 3, x: 425, y: 234, width: 164, height: 259 },
      { id: 4, x: 612, y: 234, width: 164, height: 259 },
      { id: 5, x: 799, y: 234, width: 164, height: 259 },
      { id: 6, x: 986, y: 234, width: 164, height: 259 },
      { id: 7, x: 51, y: 515, width: 164, height: 259 },
      { id: 8, x: 238, y: 515, width: 164, height: 259 },
      { id: 9, x: 425, y: 515, width: 164, height: 259 },
      { id: 10, x: 612, y: 515, width: 164, height: 259 },
      { id: 11, x: 799, y: 515, width: 164, height: 259 },
      { id: 12, x: 986, y: 515, width: 164, height: 259 },
      { id: 13, x: 51, y: 796, width: 164, height: 259 },
      { id: 14, x: 238, y: 796, width: 164, height: 259 },
      { id: 15, x: 425, y: 796, width: 164, height: 259 },
      { id: 16, x: 612, y: 796, width: 164, height: 259 },
      { id: 17, x: 799, y: 796, width: 164, height: 259 },
      { id: 18, x: 986, y: 796, width: 164, height: 259 },
      { id: 19, x: 51, y: 1077, width: 164, height: 259 },
      { id: 20, x: 238, y: 1077, width: 164, height: 259 },
      { id: 21, x: 425, y: 1077, width: 164, height: 259 },
      { id: 22, x: 612, y: 1077, width: 164, height: 259 },
      { id: 23, x: 799, y: 1077, width: 164, height: 259 },
      { id: 24, x: 986, y: 1077, width: 164, height: 259 },
      { id: 25, x: 326, y: 1358, width: 164, height: 259 },
      { id: 26, x: 513, y: 1358, width: 164, height: 259 },
      { id: 27, x: 700, y: 1358, width: 164, height: 259 },
    ]);
  });

  it("extracts 見上げるたびに、恋をする。", async () => {
    const input = await readFile(
      path.resolve(
        "public/takaneko/goods/2025/2025-12-04_ミニフォトカード「見上げるたびに、恋をする。」.jpg",
      ),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 51, y: 248, width: 164, height: 260 },
      { id: 2, x: 238, y: 248, width: 164, height: 260 },
      { id: 3, x: 425, y: 248, width: 164, height: 260 },
      { id: 4, x: 612, y: 248, width: 164, height: 260 },
      { id: 5, x: 799, y: 248, width: 164, height: 260 },
      { id: 6, x: 986, y: 248, width: 164, height: 260 },
      { id: 7, x: 51, y: 531, width: 164, height: 260 },
      { id: 8, x: 238, y: 531, width: 164, height: 260 },
      { id: 9, x: 425, y: 531, width: 164, height: 260 },
      { id: 10, x: 612, y: 531, width: 164, height: 260 },
      { id: 11, x: 799, y: 531, width: 164, height: 260 },
      { id: 12, x: 986, y: 531, width: 164, height: 260 },
      { id: 13, x: 51, y: 810, width: 164, height: 260 },
      { id: 14, x: 238, y: 810, width: 164, height: 260 },
      { id: 15, x: 425, y: 810, width: 164, height: 260 },
      { id: 16, x: 612, y: 810, width: 164, height: 260 },
      { id: 17, x: 799, y: 810, width: 164, height: 260 },
      { id: 18, x: 986, y: 810, width: 164, height: 260 },
      { id: 19, x: 51, y: 1091, width: 164, height: 260 },
      { id: 20, x: 238, y: 1091, width: 164, height: 260 },
      { id: 21, x: 425, y: 1091, width: 164, height: 260 },
      { id: 22, x: 612, y: 1091, width: 164, height: 260 },
      { id: 23, x: 799, y: 1091, width: 164, height: 260 },
      { id: 24, x: 986, y: 1091, width: 164, height: 260 },
      { id: 25, x: 326, y: 1371, width: 164, height: 260 },
      { id: 26, x: 513, y: 1371, width: 164, height: 260 },
      { id: 27, x: 700, y: 1371, width: 164, height: 260 },
    ]);
  });

  it("extracts クリスマス2025", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2025/2025-12-24_ミニフォトカード「クリスマス2025」.jpg"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 61, y: 305, width: 200, height: 316 },
      { id: 2, x: 289, y: 305, width: 200, height: 316 },
      { id: 3, x: 517, y: 305, width: 200, height: 316 },
      { id: 4, x: 745, y: 305, width: 200, height: 316 },
      { id: 5, x: 972, y: 305, width: 200, height: 316 },
      { id: 6, x: 1200, y: 305, width: 200, height: 316 },
      { id: 7, x: 61, y: 646, width: 200, height: 316 },
      { id: 8, x: 289, y: 646, width: 200, height: 316 },
      { id: 9, x: 517, y: 646, width: 200, height: 316 },
      { id: 10, x: 745, y: 646, width: 200, height: 316 },
      { id: 11, x: 972, y: 646, width: 200, height: 316 },
      { id: 12, x: 1200, y: 646, width: 200, height: 316 },
      { id: 13, x: 61, y: 988, width: 200, height: 316 },
      { id: 14, x: 289, y: 988, width: 200, height: 316 },
      { id: 15, x: 517, y: 988, width: 200, height: 316 },
      { id: 16, x: 745, y: 988, width: 200, height: 316 },
      { id: 17, x: 972, y: 988, width: 200, height: 316 },
      { id: 18, x: 1200, y: 988, width: 200, height: 316 },
      { id: 19, x: 61, y: 1329, width: 200, height: 316 },
      { id: 20, x: 289, y: 1329, width: 200, height: 316 },
      { id: 21, x: 517, y: 1329, width: 200, height: 316 },
      { id: 22, x: 745, y: 1329, width: 200, height: 316 },
      { id: 23, x: 972, y: 1329, width: 200, height: 316 },
      { id: 24, x: 1200, y: 1329, width: 200, height: 316 },
      { id: 25, x: 396, y: 1670, width: 200, height: 316 },
      { id: 26, x: 624, y: 1670, width: 200, height: 316 },
      { id: 27, x: 851, y: 1670, width: 200, height: 316 },
    ]);
  });

  it("extracts 私は、わたしの事が好き。", async () => {
    const input = await readFile(
      path.resolve(
        "public/takaneko/goods/2026/2026-05-03_ミニフォトカード「私は、わたしの事が好き。」.jpg",
      ),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 70, y: 379, width: 203, height: 319 },
      { id: 2, x: 291, y: 379, width: 203, height: 319 },
      { id: 3, x: 512, y: 379, width: 203, height: 319 },
      { id: 4, x: 733, y: 379, width: 203, height: 319 },
      { id: 5, x: 954, y: 379, width: 203, height: 319 },
      { id: 6, x: 1175, y: 379, width: 203, height: 319 },
      { id: 7, x: 70, y: 705, width: 203, height: 319 },
      { id: 8, x: 291, y: 705, width: 203, height: 319 },
      { id: 9, x: 512, y: 705, width: 203, height: 319 },
      { id: 10, x: 733, y: 705, width: 203, height: 319 },
      { id: 11, x: 954, y: 705, width: 203, height: 319 },
      { id: 12, x: 1175, y: 705, width: 203, height: 319 },
      { id: 13, x: 70, y: 1031, width: 203, height: 319 },
      { id: 14, x: 291, y: 1031, width: 203, height: 319 },
      { id: 15, x: 512, y: 1031, width: 203, height: 319 },
      { id: 16, x: 733, y: 1031, width: 203, height: 319 },
      { id: 17, x: 954, y: 1031, width: 203, height: 319 },
      { id: 18, x: 1175, y: 1031, width: 203, height: 319 },
      { id: 19, x: 70, y: 1357, width: 203, height: 319 },
      { id: 20, x: 291, y: 1357, width: 203, height: 319 },
      { id: 21, x: 512, y: 1357, width: 203, height: 319 },
      { id: 22, x: 733, y: 1357, width: 203, height: 319 },
      { id: 23, x: 954, y: 1357, width: 203, height: 319 },
      { id: 24, x: 1175, y: 1357, width: 203, height: 319 },
      { id: 25, x: 70, y: 1683, width: 203, height: 319 },
      { id: 26, x: 291, y: 1683, width: 203, height: 319 },
      { id: 27, x: 512, y: 1683, width: 203, height: 319 },
    ]);
  });

  it("extracts 花柄ワンピース", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2026/2026-06-03_ミニフォトカード「花柄ワンピース」.jpg"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 70, y: 380, width: 202, height: 318 },
      { id: 2, x: 291, y: 380, width: 202, height: 318 },
      { id: 3, x: 512, y: 380, width: 202, height: 318 },
      { id: 4, x: 733, y: 380, width: 202, height: 318 },
      { id: 5, x: 954, y: 380, width: 202, height: 318 },
      { id: 6, x: 1175, y: 380, width: 202, height: 318 },
      { id: 7, x: 70, y: 706, width: 202, height: 318 },
      { id: 8, x: 291, y: 706, width: 202, height: 318 },
      { id: 9, x: 512, y: 706, width: 202, height: 318 },
      { id: 10, x: 733, y: 706, width: 202, height: 318 },
      { id: 11, x: 954, y: 706, width: 202, height: 318 },
      { id: 12, x: 1175, y: 706, width: 202, height: 318 },
      { id: 13, x: 70, y: 1032, width: 202, height: 318 },
      { id: 14, x: 291, y: 1032, width: 202, height: 318 },
      { id: 15, x: 512, y: 1032, width: 202, height: 318 },
      { id: 16, x: 733, y: 1032, width: 202, height: 318 },
      { id: 17, x: 954, y: 1032, width: 202, height: 318 },
      { id: 18, x: 1175, y: 1032, width: 202, height: 318 },
      { id: 19, x: 70, y: 1358, width: 202, height: 318 },
      { id: 20, x: 291, y: 1358, width: 202, height: 318 },
      { id: 21, x: 512, y: 1358, width: 202, height: 318 },
      { id: 22, x: 733, y: 1358, width: 202, height: 318 },
      { id: 23, x: 954, y: 1358, width: 202, height: 318 },
      { id: 24, x: 1175, y: 1358, width: 202, height: 318 },
      { id: 25, x: 70, y: 1684, width: 202, height: 318 },
      { id: 26, x: 292, y: 1684, width: 202, height: 318 },
      { id: 27, x: 513, y: 1684, width: 202, height: 318 },
    ]);
  });

  it("extracts セーラー服2026", async () => {
    const input = await readFile(
      path.resolve("public/takaneko/goods/2026/2026-03-05_ミニフォトカード「セーラー服2026」.jpg"),
    );

    const result = await extractMiniPhotoPositions(input);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.positions).toEqual([
      { id: 1, x: 51, y: 249, width: 164, height: 260 },
      { id: 2, x: 238, y: 249, width: 164, height: 260 },
      { id: 3, x: 425, y: 249, width: 164, height: 260 },
      { id: 4, x: 612, y: 249, width: 164, height: 260 },
      { id: 5, x: 799, y: 249, width: 164, height: 260 },
      { id: 6, x: 986, y: 249, width: 164, height: 260 },
      { id: 7, x: 51, y: 530, width: 164, height: 260 },
      { id: 8, x: 238, y: 530, width: 164, height: 260 },
      { id: 9, x: 425, y: 530, width: 164, height: 260 },
      { id: 10, x: 612, y: 530, width: 164, height: 260 },
      { id: 11, x: 799, y: 530, width: 164, height: 260 },
      { id: 12, x: 986, y: 530, width: 164, height: 260 },
      { id: 13, x: 51, y: 811, width: 164, height: 260 },
      { id: 14, x: 238, y: 811, width: 164, height: 260 },
      { id: 15, x: 425, y: 811, width: 164, height: 260 },
      { id: 16, x: 612, y: 811, width: 164, height: 260 },
      { id: 17, x: 799, y: 811, width: 164, height: 260 },
      { id: 18, x: 986, y: 811, width: 164, height: 260 },
      { id: 19, x: 51, y: 1092, width: 164, height: 260 },
      { id: 20, x: 238, y: 1092, width: 164, height: 260 },
      { id: 21, x: 425, y: 1092, width: 164, height: 260 },
      { id: 22, x: 612, y: 1092, width: 164, height: 260 },
      { id: 23, x: 799, y: 1092, width: 164, height: 260 },
      { id: 24, x: 986, y: 1092, width: 164, height: 260 },
      { id: 25, x: 326, y: 1373, width: 164, height: 260 },
      { id: 26, x: 513, y: 1373, width: 164, height: 260 },
      { id: 27, x: 700, y: 1373, width: 164, height: 260 },
    ]);
  });
});

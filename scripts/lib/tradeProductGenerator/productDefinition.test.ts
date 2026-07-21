import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  buildProductDescriptor,
  renderProductDefinition,
  updateProductImagesSource,
  updateReleaseNotes,
} from "./productDefinition";

describe("buildProductDescriptor", () => {
  it("builds a current mini-photo descriptor", () => {
    const result = buildProductDescriptor({
      inputPath: "/tmp/catalog.jpg",
      type: "mini-photo-original",
      date: "2026-07-20",
      series: "たかねこフェス vol.7",
      lineup: "regular-27",
    });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value).toMatchObject({
      year: 2026,
      itemCount: 27,
      exportName: "たかねこフェスvol7_ミニフォト",
      stem: "2026-07-20_ミニフォトカード「たかねこフェス vol.7」",
      lineupConstant: "REGULAR_MINI_PHOTO_SET2",
      productLine: "MiniPhotoCard",
    });
  });

  it("maps a legacy photo lineup to the 30-item constant", () => {
    const result = buildProductDescriptor({
      inputPath: "/tmp/catalog.webp",
      type: "photo-grid",
      date: "2024-01-03",
      series: "2024年振袖",
      lineup: "regular-30",
    });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.exportName).toBe("_2024年振袖_生写真");
    expect(result.value.lineupConstant).toBe("REGULAR_PHOTO_SET");
    expect(result.value.itemCount).toBe(30);
  });

  it("rejects invalid calendar dates", () => {
    const result = buildProductDescriptor({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-original",
      date: "2026-02-30",
      series: "invalid",
      lineup: "regular-27",
    });

    expect(result.err).toBe(true);
    if (result.ok) return;
    expect(result.error.kind).toBe("invalid-date");
  });

  it("rejects path separators in series names", () => {
    const result = buildProductDescriptor({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-original",
      date: "2026-07-20",
      series: "../invalid",
      lineup: "regular-27",
    });

    expect(result.err).toBe(true);
    if (result.ok) return;
    expect(result.error.kind).toBe("invalid-series");
  });
});

describe("renderProductDefinition", () => {
  it("renders a serializable RandomGoods definition", async () => {
    const descriptor = buildProductDescriptor({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-original",
      date: "2026-07-20",
      series: "テスト衣装",
      lineup: "regular-27",
    });
    if (descriptor.err) throw new Error(descriptor.error.message);

    const source = await renderProductDefinition(descriptor.value, {
      extension: ".jpg",
      width: 1200,
      height: 1600,
      positions: [{ id: 1, x: 10, y: 20, width: 100, height: 140 }],
      buffer: Buffer.from("image"),
    });

    expect(source).toContain("export const テスト衣装_生写真: RandomGoods");
    expect(source).toContain('url: "/takaneko/goods/2026/2026-07-20_生写真「テスト衣装」.jpg"');
    expect(source).toContain("variants: REGULAR_PHOTO_SET2");
    expect(source).toContain("{ id: 1, x: 10, y: 20, width: 100, height: 140 }");
  });
});

describe("repository source updates", () => {
  it("registers an import and product once", async () => {
    const original = [
      'import { Existing } from "./2026/existing";',
      'import { RandomGoods } from "./product";',
      "",
      "export const TAKANEKO_PHOTOS_FEATURED: RandomGoods[] = [Existing];",
      "export const TAKANEKO_PHOTOS: RandomGoods[] = [Existing];",
      "",
    ].join("\n");

    const first = await updateProductImagesSource(original, {
      exportName: "テスト衣装_生写真",
      importPath: "./2026/2026-07-20_生写真「テスト衣装」",
    });
    const second = await updateProductImagesSource(first, {
      exportName: "テスト衣装_生写真",
      importPath: "./2026/2026-07-20_生写真「テスト衣装」",
    });

    expect(second.match(/import \{ テスト衣装_生写真 \}/g)).toHaveLength(1);
    expect(second.match(/テスト衣装_生写真/g)).toHaveLength(2);
    const photos = second.slice(second.indexOf("export const TAKANEKO_PHOTOS:"));
    expect(photos.indexOf("テスト衣装_生写真")).toBeLessThan(photos.indexOf("Existing"));
  });

  it("updates the current productImages source shape", async () => {
    const original = await readFile("app/features/products/productImages.ts", "utf8");

    const updated = await updateProductImagesSource(original, {
      exportName: "生成テスト_生写真",
      importPath: "./2026/2026-07-20_生写真「生成テスト」",
    });

    expect(updated).toContain(
      'import { 生成テスト_生写真 } from "./2026/2026-07-20_生写真「生成テスト」";',
    );
    const photos = updated.slice(updated.indexOf("export const TAKANEKO_PHOTOS:"));
    expect(photos).toContain("生成テスト_生写真,");
  });

  it("adds a release note to an existing date without duplication", () => {
    const original = "# リリース ノート\n\n## 2026-07-20\n\n- 既存の変更です。\n";
    const first = updateReleaseNotes(original, "2026-07-20", "生写真「テスト衣装」");
    const second = updateReleaseNotes(first, "2026-07-20", "生写真「テスト衣装」");

    expect(second.match(/生写真「テスト衣装」を追加しました。/g)).toHaveLength(1);
    expect(second).toContain(
      "## 2026-07-20\n\n- トレード画像をつくるやつに、生写真「テスト衣装」を追加しました。\n- 既存の変更です。",
    );
  });
});

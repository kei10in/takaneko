import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateTradeProduct } from "./generator";

describe("generateTradeProduct", { timeout: 15_000 }, () => {
  const temporaryDirectories: string[] = [];

  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  it("places a kept image, definition, registration, and release note", async () => {
    const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), "takaneko-generator-test-"));
    temporaryDirectories.push(repositoryRoot);
    await mkdir(path.join(repositoryRoot, "app/features/products"), { recursive: true });
    await writeFile(
      path.join(repositoryRoot, "app/features/products/productImages.ts"),
      [
        'import { RandomGoods } from "./product";',
        "export const TAKANEKO_PHOTOS_FEATURED: RandomGoods[] = [];",
        "export const TAKANEKO_PHOTOS: RandomGoods[] = [];",
      ].join("\n"),
    );
    await writeFile(path.join(repositoryRoot, "RELEASES.md"), "# リリース ノート\n");
    const inputPath = path.resolve(
      "public/takaneko/goods/2026/2026-03-05_ミニフォトカード「セーラー服2026」.jpg",
    );
    const confirmOverwrite = vi.fn(async () => false);

    const result = await generateTradeProduct({
      repositoryRoot,
      releaseDate: "2026-07-20",
      input: {
        inputPath,
        type: "mini-photo-original",
        date: "2026-07-20",
        series: "生成テスト",
        lineup: "regular-27",
      },
      confirmOverwrite,
    });

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(confirmOverwrite).not.toHaveBeenCalled();
    const definition = await readFile(result.value.definitionPath, "utf8");
    const registration = await readFile(result.value.productImagesPath, "utf8");
    const releases = await readFile(result.value.releaseNotesPath, "utf8");
    expect(definition).toContain("export const 生成テスト_ミニフォト: RandomGoods");
    expect(definition).toContain("positions: [");
    expect(registration).toContain("生成テスト_ミニフォト");
    expect(releases).toContain("## 2026-07-20");
    expect(await readFile(result.value.imagePath)).toEqual(await readFile(inputPath));
  });

  it("does not change files when overwrite is declined", async () => {
    const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), "takaneko-generator-test-"));
    temporaryDirectories.push(repositoryRoot);
    const definitionPath = path.join(
      repositoryRoot,
      "app/features/products/2026/2026-07-20_生写真「既存商品」.ts",
    );
    await mkdir(path.dirname(definitionPath), { recursive: true });
    await writeFile(definitionPath, "existing");
    const confirmOverwrite = vi.fn(async () => false);

    const result = await generateTradeProduct({
      repositoryRoot,
      releaseDate: "2026-07-20",
      input: {
        inputPath: "/tmp/入力を読む前に終了する.jpg",
        type: "photo-original",
        date: "2026-07-20",
        series: "既存商品",
        lineup: "regular-27",
      },
      confirmOverwrite,
    });

    expect(result.err).toBe(true);
    if (result.ok) return;
    expect(result.error.kind).toBe("overwrite-declined");
    expect(confirmOverwrite).toHaveBeenCalledOnce();
    expect(await readFile(definitionPath, "utf8")).toBe("existing");
  });
});

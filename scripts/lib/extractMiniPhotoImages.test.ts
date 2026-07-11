import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { extractMiniPhotoImages } from "./extractMiniPhotoImages";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("extractMiniPhotoImages", () => {
  it("writes detected rectangles as numbered WebP files under an extensionless directory", async () => {
    const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "takaneko-mini-photo-"));
    temporaryDirectories.push(temporaryDirectory);
    const inputPath = path.join(temporaryDirectory, "sample.input.webp");
    await copyFile(path.resolve("scripts/lib/test-fixture/miniphoto-sample.4.webp"), inputPath);

    const result = await extractMiniPhotoImages(inputPath);

    expect(result.ok).toBe(true);
    if (result.err) return;
    expect(result.value.outputDirectory).toBe(path.join(temporaryDirectory, "sample.input"));
    expect(result.value.outputPaths).toEqual([
      path.join(temporaryDirectory, "sample.input/001.webp"),
      path.join(temporaryDirectory, "sample.input/002.webp"),
      path.join(temporaryDirectory, "sample.input/003.webp"),
      path.join(temporaryDirectory, "sample.input/004.webp"),
      path.join(temporaryDirectory, "sample.input/005.webp"),
      path.join(temporaryDirectory, "sample.input/006.webp"),
      path.join(temporaryDirectory, "sample.input/007.webp"),
      path.join(temporaryDirectory, "sample.input/008.webp"),
      path.join(temporaryDirectory, "sample.input/009.webp"),
      path.join(temporaryDirectory, "sample.input/010.webp"),
      path.join(temporaryDirectory, "sample.input/011.webp"),
      path.join(temporaryDirectory, "sample.input/012.webp"),
      path.join(temporaryDirectory, "sample.input/013.webp"),
      path.join(temporaryDirectory, "sample.input/014.webp"),
      path.join(temporaryDirectory, "sample.input/015.webp"),
      path.join(temporaryDirectory, "sample.input/016.webp"),
      path.join(temporaryDirectory, "sample.input/017.webp"),
      path.join(temporaryDirectory, "sample.input/018.webp"),
      path.join(temporaryDirectory, "sample.input/019.webp"),
      path.join(temporaryDirectory, "sample.input/020.webp"),
      path.join(temporaryDirectory, "sample.input/021.webp"),
      path.join(temporaryDirectory, "sample.input/022.webp"),
      path.join(temporaryDirectory, "sample.input/023.webp"),
      path.join(temporaryDirectory, "sample.input/024.webp"),
      path.join(temporaryDirectory, "sample.input/025.webp"),
      path.join(temporaryDirectory, "sample.input/026.webp"),
      path.join(temporaryDirectory, "sample.input/027.webp"),
    ]);

    const firstImage = await sharp(await readFile(result.value.outputPaths[0])).metadata();
    expect(firstImage).toMatchObject({ format: "webp", width: 28, height: 44 });
  });
});

import { CompressionType, FilterType, Transformer } from "@napi-rs/image";
import { createCanvas, Image, loadImage } from "canvas";
import { globSync } from "glob";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isThumbnail, thumbnailDir, thumbnails } from "~/utils/fileConventions";

const webpQuality = 80;
const concurrency = Math.max(1, Math.min(os.cpus().length, 8));

const readImageSource = async (filepath: string): Promise<Buffer | undefined> => {
  const source = await fs.promises.readFile(filepath);
  try {
    const metadata = await new Transformer(source).metadata();
    if (metadata.width <= 0 || metadata.height <= 0) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  return source;
};

const fitInside = (
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): { width: number; height: number } => {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
};

const resizeImage = async (
  sourceImage: Image,
  thumbnail: string,
  width: number,
  height: number,
): Promise<void> => {
  const target = fitInside(sourceImage.naturalWidth, sourceImage.naturalHeight, width, height);
  try {
    const canvas = createCanvas(target.width, target.height);
    const context = canvas.getContext("2d");
    context.drawImage(sourceImage, 0, 0, target.width, target.height);
    const resizedPng = canvas.toBuffer("image/png");
    const webp = await new Transformer(resizedPng).webp(webpQuality);
    await fs.promises.writeFile(thumbnail, webp);
  } catch (err) {
    console.error(`Error processing file ${thumbnail}:`, err);
  }
};

const processFile = async (filepath: string) => {
  // サムネイルの配置場所は Web のパスで計算する
  filepath = filepath.replace(/\\/g, "/");
  const imagePath = filepath.replace("public", "");

  const thumbnailPaths = thumbnails(imagePath);

  // 画像処理はリポジトリ上のパスでやる
  const outputFilePaths = thumbnailPaths.map((x) => `public/${x}`);
  const targets = outputFilePaths.filter((thumbnailPath) => !fs.existsSync(thumbnailPath));
  if (targets.length === 0) {
    return;
  }

  try {
    const source = await readImageSource(filepath);
    if (source === undefined) {
      return;
    }

    fs.mkdirSync(path.dirname(outputFilePaths[0]), { recursive: true });

    const decodedPng = await new Transformer(source).rotate().png({
      compressionType: CompressionType.Fast,
      filterType: FilterType.NoFilter,
    });
    const sourceImage = await loadImage(decodedPng);

    if (targets.includes(outputFilePaths[0])) {
      await resizeImage(sourceImage, outputFilePaths[0], 240, 240);
    }
    if (targets.includes(outputFilePaths[1])) {
      await resizeImage(sourceImage, outputFilePaths[1], 480, 480);
    }
    if (targets.includes(outputFilePaths[2])) {
      await resizeImage(sourceImage, outputFilePaths[2], 720, 720);
    }
  } catch (err) {
    console.error(`[gen-thumbnails] failed to process source image: ${filepath}`);
  }
};

const processWithConcurrency = async (
  filepaths: string[],
  limit: number,
  fn: (filepath: string) => Promise<void>,
) => {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, filepaths.length) }, async () => {
    while (true) {
      const i = index;
      index += 1;
      if (i >= filepaths.length) {
        return;
      }
      await fn(filepaths[i]);
    }
  });

  await Promise.all(workers);
};

const main = async () => {
  const rebuild = process.argv.includes("--rebuild");
  const targetGlobs = [
    "./public/publications/**/*",
    "./public/takaneko/birthday-goods/**/*",
    "./public/takaneko/goods/**/*",
    "./public/takaneko/live-goods/**/*",
    "./public/takaneko/media/**/*",
  ];
  const matchFiles = globSync(targetGlobs, { nodir: true }).filter(
    // Filter しないと無限に増えていく。
    (filepath) => !isThumbnail(filepath),
  );

  if (rebuild) {
    const thumbnailDirs = new Set(
      matchFiles.map((filepath) => {
        return thumbnailDir(filepath.replace(/\\/g, "/"));
      }),
    );
    thumbnailDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        return;
      }
      fs.rmSync(dir, { recursive: true });
    });
  }

  await processWithConcurrency(matchFiles, concurrency, processFile);
};

main();

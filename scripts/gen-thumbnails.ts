import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { isThumbnail, thumbnails } from "~/utils/fileConventions";

const isImage = async (filepath: string): Promise<boolean> => {
  try {
    await sharp(filepath).metadata();
    return true;
  } catch (err) {
    return false;
  }
};

const resizeImage = async (baseFile: string, thumbnail: string, width: number, height: number) => {
  try {
    const buf = await sharp(baseFile)
      .resize({ width, height, fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();
    await fs.promises.writeFile(thumbnail, buf);
  } catch (err) {
    console.error(`Error processing file ${baseFile}:`, err);
  }
};

const processFile = async (filepath: string) => {
  if (!(await isImage(filepath))) {
    return;
  }

  // サムネイルの配置場所は Web のパスで計算する
  filepath = filepath.replace(/\\/g, "/");
  const imagePath = filepath.replace("public", "");

  const thumbnailPaths = thumbnails(imagePath);

  // 画像処理はリポジトリ上のパスでやる
  const outputFilePaths = thumbnailPaths.map((x) => `public/${x}`);

  fs.mkdirSync(path.dirname(outputFilePaths[0]), { recursive: true });

  await resizeImage(filepath, outputFilePaths[0], 240, 240);
  await resizeImage(filepath, outputFilePaths[1], 480, 480);
  await resizeImage(filepath, outputFilePaths[2], 720, 720);
};

const main = async () => {
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

  const promises = matchFiles.map(async (filepath) => await processFile(filepath));

  await Promise.all(promises);
};

main();

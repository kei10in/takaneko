import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const main = async () => {
  if (process.argv.length < 2) {
    console.error("Usage: pnpm tsx fit-id-photo.ts <image>");
    return;
  }

  process.argv.slice(2).forEach(async (src) => {
    const dest = path.join(path.dirname(src), path.basename(src, ".jpg") + ".webp");
    const imageBuffer = await fs.readFile(src);

    await genProfileImage(imageBuffer, dest);
  });
};

const genProfileImage = async (src: Buffer, dest: string) => {
  await sharp(src).resize({ width: 384, height: 512 }).toFile(dest);
};

main();

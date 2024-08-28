import iconGen from "icon-gen";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = "public/icon.svg";
const dest = "public";

// <link rel="icon" href="/favicon.ico" sizes="32x32">
// <link rel="icon" href="/icon.svg" type="image/svg+xml">
// <link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180×180 -->
// <link rel="manifest" href="/manifest.webmanifest">
// { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
// { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }

const main = async () => {
  const imageBuffer = await fs.readFile(src);

  await genFavicon(src, dest);
  await genAppleTouchIcon(imageBuffer, dest);
  await genPwa192(imageBuffer, dest);
  await genPwa512(imageBuffer, dest);
};

const genFavicon = async (src: string, dest: string) => {
  iconGen(src, dest, {
    report: false,
    ico: { name: "favicon", sizes: [16, 32] },
  });
};

const genAppleTouchIcon = async (src: Buffer, dest: string) => {
  await sharp(src)
    // リサイズだけだと余白が大きい。
    .resize(200, 200)
    .extract({ left: 10, top: 10, width: 180, height: 180 })
    // 透過の部分がグレーで埋められる。白背景の方が望ましい。
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toFile(path.join(dest, "apple-touch-icon.png"));
};

const genPwa192 = async (src: Buffer, dest: string) => {
  await sharp(src).resize(192, 192).toFile(path.join(dest, "icon-192.png"));
};

const genPwa512 = async (src: Buffer, dest: string) => {
  await sharp(src).resize(512, 512).toFile(path.join(dest, "icon-512.png"));
};

main();

import iconGen from "icon-gen";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const src = "public/icon.svg";
const dest = "public";

// <link rel="icon" href="/favicon.ico" />
// <link rel="icon" href="/icon.svg" sizes="any" type="image/svg+xml" />
// <link rel="icon" href="/icon-48.png" sizes="48x48" type="image/png" />
// <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
// <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
// <link rel="apple-touch-icon" href="/apple-touch-icon.png" /><!-- 180×180 -->
// <link rel="manifest" href="/manifest.webmanifest" />
// { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
// { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }

const main = async () => {
  const imageBuffer = await fs.readFile(src);

  await genFavicon(src, dest);
  await genFaviconPng(imageBuffer, dest);
  await genAppleTouchIcon(imageBuffer, dest);
};

const genFavicon = async (src: string, dest: string) => {
  iconGen(src, dest, {
    report: false,
    ico: { name: "favicon", sizes: [16, 32, 48] },
  });
};

const genFaviconPng = async (src: Buffer, dest: string) => {
  const sizes = [48, 192, 512];

  for (const size of sizes) {
    await sharp(src)
      .resize(size, size)
      .toFile(path.join(dest, `icon-${size}.png`));
  }
};

const genAppleTouchIcon = async (src: Buffer, dest: string) => {
  await sharp(src)
    .resize(180, 180)
    // 透過の部分がグレーで埋められる。白背景の方が望ましい。
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toFile(path.join(dest, "apple-touch-icon.png"));
};

main();

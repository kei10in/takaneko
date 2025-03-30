import fs, { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "readline";
import { croppedImagePath } from "~/features/products/croppedProductImage";
import { RandomGoods } from "~/features/products/product";
import { crop } from "./lib/crop";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", async (line) => {
  let request: { file: string; [key: string]: unknown };
  try {
    request = JSON.parse(line);
  } catch (e) {
    console.error("Invalid JSON input:", line);
    return;
  }

  const { file } = request;
  try {
    const result = await handleFile(file);
    const response = { ok: true, file, result };
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch (err) {
    const response = {
      ok: false,
      file,
      error: err instanceof Error ? err.message : String(err),
    };
    process.stdout.write(JSON.stringify(response) + "\n");
  }
});

async function handleFile(filePath: string): Promise<Record<string, unknown>> {
  try {
    const moduleUrl = pathToFileURL(filePath).href;
    const module = await import(moduleUrl);

    // ランダムグッズを定義するファイルは唯一の export を持つことを期待します。
    const keys = Object.keys(module);
    if (keys.length != 1) {
      throw new Error("Module must have only one export.");
    }

    const photo = Object.values(module)[0] as RandomGoods;
    if (!shouldCropImages(filePath, photo)) {
      return { msg: "No need to crop images." };
    }

    await crop(photo);

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw Error("Unknown error occurred.");
  }
}

/**
 * 画像の切り抜きが必要かどうかを判定します。
 *
 * 生成する画像ファイルの存在有無・更新日時をもとに切り抜きをするかどうかを判断します。
 * 生成する画像ファイルは、元の画像とモジュールに依存しています。
 * Makefile 同様にファイルの更新日時を使って判定していきます。
 */
const shouldCropImages = (modulePath: string, photo: RandomGoods) => {
  // 生成する画像のファイルパスを取得します。
  const outputFiles = photo.positions.map((pos) =>
    path.resolve(import.meta.dirname, "..", `public${croppedImagePath(photo.url, pos.id)}`),
  );

  // 欠損しているファイルがあれば、切り抜きが必要です。
  if (outputFiles.some((file) => !existsSync(file))) {
    return true;
  }

  // タイムスタンプでの判定の有無を切り替えます。
  // タイムスタンプでの判定は思いがけず画像生成が頻発する可能性があります。
  // 画像生成が頻発しすぎていると感じる場合は無効にしてください。
  const enableTimestampComparing = true;

  if (enableTimestampComparing) {
    const outputFilesMtime = outputFiles.map((file) => fs.statSync(file).mtimeMs);

    // モジュールよりも古いファイルがあれば、切り抜きが必要です。
    const moduleFile = path.resolve(modulePath);
    const moduleStat = fs.statSync(moduleFile);
    if (outputFilesMtime.some((mtime) => mtime < moduleStat.mtimeMs)) {
      return true;
    }
  }

  return false;
};

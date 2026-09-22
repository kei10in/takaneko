import { ResizeFilterType, ResizeFit, Transformer } from "@napi-rs/image";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
// Vite 設定の読み込み時はアプリ用の ~ エイリアスがまだ使えない。
import { Err, Ok, type Result } from "../utils/result";

type ThumbnailError = "invalid-path" | "not-found" | "conversion-failed";

const isInside = (directory: string, filepath: string): boolean => {
  const relative = path.relative(directory, filepath);
  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
};

export const loadDevThumbnail = async (
  publicDir: string,
  src: string,
  size: 240 | 480 | 720,
): Promise<Result<Buffer, ThumbnailError>> => {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("\0") || src.includes("\\")) {
    return Err("invalid-path");
  }

  try {
    const root = await realpath(publicDir);
    const filepath = path.resolve(root, `.${src}`);
    if (!isInside(root, filepath)) {
      return Err("invalid-path");
    }

    // public 内のリンクから外部ファイルを読み出すことも防ぐ。
    const sourcePath = await realpath(filepath);
    if (!isInside(root, sourcePath)) {
      return Err("invalid-path");
    }

    const source = await readFile(sourcePath);
    const image = await new Transformer(source)
      .rotate()
      .resize({
        width: size,
        height: size,
        fit: ResizeFit.Inside,
        filter: ResizeFilterType.Lanczos3,
      })
      .webp(80);
    return Ok(image);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error.code === "ENOENT" || error.code === "ENOTDIR")
    ) {
      return Err("not-found");
    }
    return Err("conversion-failed");
  }
};

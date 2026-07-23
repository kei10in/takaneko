import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { Err, Ok, type Result } from "~/utils/result";
import type { ExtractedPositions, ExtractPositionsError } from "./types";

export interface ExtractedImages {
  outputDirectory: string;
  outputPaths: string[];
}

export type ExtractImagesError =
  | { kind: "invalid-input-path"; message: string }
  | { kind: "input-read-failed"; message: string }
  | { kind: "position-detection-failed"; message: string }
  | { kind: "output-write-failed"; message: string };

type DetectPositions = (
  input: Uint8Array,
) => Promise<Result<ExtractedPositions, ExtractPositionsError>>;

const webpQuality = 90;

export const extractImages = async (
  inputPath: string,
  detectPositions: DetectPositions,
): Promise<Result<ExtractedImages, ExtractImagesError>> => {
  const extension = path.extname(inputPath);
  if (extension === "") {
    return Err({
      kind: "invalid-input-path",
      message: `入力画像に拡張子がありません: ${inputPath}`,
    });
  }

  let input: Buffer;
  try {
    input = await readFile(inputPath);
  } catch (error: unknown) {
    return Err({
      kind: "input-read-failed",
      message: error instanceof Error ? error.message : `画像を読み込めませんでした: ${inputPath}`,
    });
  }

  const detected = await detectPositions(input);
  if (detected.err) {
    return Err({
      kind: "position-detection-failed",
      message: detected.error.message,
    });
  }

  const outputDirectory = path.join(path.dirname(inputPath), path.basename(inputPath, extension));
  const outputPaths = detected.value.positions.map((position) =>
    path.join(outputDirectory, `${position.id.toString().padStart(3, "0")}.webp`),
  );

  try {
    await mkdir(outputDirectory, { recursive: true });
    await Promise.all(
      detected.value.positions.map(async (position, index) => {
        await sharp(input)
          .rotate()
          .extract({
            left: position.x,
            top: position.y,
            width: position.width,
            height: position.height,
          })
          .webp({ quality: webpQuality })
          .toFile(outputPaths[index]);
      }),
    );
  } catch (error: unknown) {
    return Err({
      kind: "output-write-failed",
      message: error instanceof Error ? error.message : "WebP画像を書き込めませんでした。",
    });
  }

  return Ok({ outputDirectory, outputPaths });
};

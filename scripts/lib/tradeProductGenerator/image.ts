import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { Err, Ok, type Result } from "~/utils/result";
import { extractMiniPhotoPositions } from "../extractMiniPhotoPositions";
import { extractPhotoPositions } from "../extractPhotoPositions";
import { ProductImage } from "../ProductImage";
import {
  productTypeIsPhoto,
  productTypeUsesOriginalImage,
  type GeneratedTradeProductImage,
  type TradeProductDescriptor,
} from "./productDefinition";

export type GenerateTradeProductImageError =
  | { kind: "unsupported-image-format"; message: string }
  | { kind: "input-read-failed"; message: string }
  | { kind: "position-detection-failed"; message: string }
  | { kind: "item-count-mismatch"; message: string }
  | { kind: "invalid-position"; message: string }
  | { kind: "image-generation-failed"; message: string };

const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const generateTradeProductImage = async (
  descriptor: TradeProductDescriptor,
): Promise<Result<GeneratedTradeProductImage, GenerateTradeProductImageError>> => {
  const extension = path.extname(descriptor.inputPath).toLowerCase();
  if (!isSupportedExtension(extension)) {
    return Err({
      kind: "unsupported-image-format",
      message: `対応していない画像形式です: ${extension || "拡張子なし"}`,
    });
  }

  let input: Buffer;
  try {
    input = await readFile(descriptor.inputPath);
  } catch (error: unknown) {
    return Err({ kind: "input-read-failed", message: errorMessage(error) });
  }

  const detected = productTypeIsPhoto(descriptor.type)
    ? await extractPhotoPositions(input)
    : await extractMiniPhotoPositions(input);
  if (detected.err) {
    return Err({ kind: "position-detection-failed", message: detected.error.message });
  }
  if (detected.value.positions.length !== descriptor.itemCount) {
    return Err({
      kind: "item-count-mismatch",
      message: `画像から${detected.value.positions.length}枚を検出しましたが、${descriptor.itemCount}枚のラインナップが選択されています。`,
    });
  }

  let dimensions: { width: number; height: number };
  try {
    const metadata = await sharp(input).metadata();
    const width = metadata.width;
    const height = metadata.height;
    if (width == undefined || height == undefined) {
      return Err({ kind: "image-generation-failed", message: "画像サイズを取得できません。" });
    }
    dimensions = orientedDimensions(width, height, metadata.orientation);
  } catch (error: unknown) {
    return Err({ kind: "image-generation-failed", message: errorMessage(error) });
  }

  const invalidPosition = detected.value.positions.find(
    ({ x, y, width, height }) =>
      x < 0 ||
      y < 0 ||
      width <= 0 ||
      height <= 0 ||
      x + width > dimensions.width ||
      y + height > dimensions.height,
  );
  if (invalidPosition != undefined) {
    return Err({
      kind: "invalid-position",
      message: `画像範囲外の座標が検出されました: id=${invalidPosition.id}`,
    });
  }

  if (productTypeUsesOriginalImage(descriptor.type)) {
    return Ok({
      extension,
      ...dimensions,
      positions: detected.value.positions,
      buffer: input,
    });
  }

  return renderGridProductImage(input, descriptor, detected.value.positions);
};

const renderGridProductImage = async (
  input: Buffer,
  descriptor: TradeProductDescriptor,
  sourcePositions: GeneratedTradeProductImage["positions"],
): Promise<Result<GeneratedTradeProductImage, GenerateTradeProductImageError>> => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "takaneko-product-"));
  try {
    const itemPaths = sourcePositions.map((position) =>
      path.join(temporaryDirectory, `${position.id.toString().padStart(3, "0")}.png`),
    );
    await Promise.all(
      sourcePositions.map((position, index) =>
        sharp(input)
          .rotate()
          .extract({
            left: position.x,
            top: position.y,
            width: position.width,
            height: position.height,
          })
          .png()
          .toFile(itemPaths[index]),
      ),
    );

    const imageSize = productTypeIsPhoto(descriptor.type)
      ? { width: 154, height: 220 }
      : { width: 138, height: 220 };
    const rendered = await new ProductImage(itemPaths, { size: imageSize }).render();
    return Ok({
      extension: ".webp",
      width: rendered.size.width,
      height: rendered.size.height,
      positions: rendered.positions,
      buffer: rendered.buffer,
    });
  } catch (error: unknown) {
    return Err({ kind: "image-generation-failed", message: errorMessage(error) });
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

const isSupportedExtension = (
  extension: string,
): extension is GeneratedTradeProductImage["extension"] =>
  supportedExtensions.some((supported) => supported === extension);

const orientedDimensions = (
  width: number,
  height: number,
  orientation: number | undefined,
): { width: number; height: number } =>
  orientation != undefined && orientation >= 5 && orientation <= 8
    ? { width: height, height: width }
    : { width, height };

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "画像処理に失敗しました。";

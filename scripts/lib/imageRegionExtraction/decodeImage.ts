import sharp from "sharp";
import { Err, Ok, type Result } from "~/utils/result";
import type { ExtractPositionsError, PixelImage } from "./types";

export const decodePixelImage = async (
  input: Uint8Array,
): Promise<Result<PixelImage, ExtractPositionsError>> => {
  try {
    const { data, info } = await sharp(input)
      .rotate()
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return Ok({
      width: info.width,
      height: info.height,
      channels: 3,
      data,
    });
  } catch (error: unknown) {
    return Err({
      kind: "decode-failed",
      message: error instanceof Error ? error.message : "画像をデコードできませんでした。",
    });
  }
};

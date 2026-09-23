import type { Result } from "~/utils/result.ts";
import { decodePixelImage } from "./imageRegionExtraction/decodeImage.ts";
import { extractPositionsFromPixels } from "./imageRegionExtraction/extractPositionsFromPixels.ts";
import type {
  ExtractedPositions,
  ExtractPositionsError,
  ExtractPositionsOptions,
  PixelImage,
} from "./imageRegionExtraction/types.ts";
import { correctCatalogLayout } from "./photoExtraction/catalogCorrection.ts";
import { recoverPhotoOuterFrames } from "./photoExtraction/catalogOuterFrame.ts";
import { photoExtractionProfile } from "./photoExtraction/profile.ts";

export type { NormalizeMode, PixelImage } from "./imageRegionExtraction/types.ts";

export type ExtractPhotoPositionsOptions = ExtractPositionsOptions;
export type ExtractedPhotoPositions = ExtractedPositions;
export type ExtractPhotoPositionsError = ExtractPositionsError;

export const extractPhotoPositions = async (
  input: Uint8Array,
  options: ExtractPhotoPositionsOptions = {},
): Promise<Result<ExtractedPhotoPositions, ExtractPhotoPositionsError>> => {
  const decoded = await decodePixelImage(input);
  return decoded.err ? decoded : extractPhotoPositionsFromPixels(decoded.value, options);
};

export const extractPhotoPositionsFromPixels = (
  image: PixelImage,
  options: ExtractPhotoPositionsOptions = {},
): Result<ExtractedPhotoPositions, ExtractPhotoPositionsError> =>
  extractPositionsFromPixels(
    image,
    photoExtractionProfile,
    (rects, edges, source, context) =>
      recoverPhotoOuterFrames(correctCatalogLayout(rects, edges, source, context), edges, source),
    options,
  );

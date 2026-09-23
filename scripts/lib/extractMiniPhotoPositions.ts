import type { Result } from "~/utils/result.ts";
import { decodePixelImage } from "./imageRegionExtraction/decodeImage.ts";
import { extractPositionsFromPixels } from "./imageRegionExtraction/extractPositionsFromPixels.ts";
import type {
  ExtractedPositions,
  ExtractPositionsError,
  ExtractPositionsOptions,
  PixelImage,
} from "./imageRegionExtraction/types.ts";
import { completeCatalogLayout } from "./miniPhotoExtraction/catalogCorrection.ts";
import { miniPhotoExtractionProfile } from "./miniPhotoExtraction/profile.ts";

export type { NormalizeMode, PixelImage } from "./imageRegionExtraction/types.ts";

export type ExtractMiniPhotoPositionsOptions = ExtractPositionsOptions;
export type ExtractedMiniPhotoPositions = ExtractedPositions;
export type ExtractMiniPhotoPositionsError = ExtractPositionsError;

export const extractMiniPhotoPositions = async (
  input: Uint8Array,
  options: ExtractMiniPhotoPositionsOptions = {},
): Promise<Result<ExtractedMiniPhotoPositions, ExtractMiniPhotoPositionsError>> => {
  const decoded = await decodePixelImage(input);
  return decoded.err ? decoded : extractMiniPhotoPositionsFromPixels(decoded.value, options);
};

export const extractMiniPhotoPositionsFromPixels = (
  image: PixelImage,
  options: ExtractMiniPhotoPositionsOptions = {},
): Result<ExtractedMiniPhotoPositions, ExtractMiniPhotoPositionsError> =>
  extractPositionsFromPixels(image, miniPhotoExtractionProfile, completeCatalogLayout, options);

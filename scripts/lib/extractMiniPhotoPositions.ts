import type { Result } from "~/utils/result";
import { decodePixelImage } from "./imageRegionExtraction/decodeImage";
import { extractPositionsFromPixels } from "./imageRegionExtraction/extractPositionsFromPixels";
import type {
  ExtractedPositions,
  ExtractPositionsError,
  ExtractPositionsOptions,
  PixelImage,
} from "./imageRegionExtraction/types";
import { completeCatalogLayout } from "./miniPhotoExtraction/catalogCorrection";
import { miniPhotoExtractionProfile } from "./miniPhotoExtraction/profile";

export type { NormalizeMode, PixelImage } from "./imageRegionExtraction/types";

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

import type { Result } from "~/utils/result";
import { decodePixelImage } from "./imageRegionExtraction/decodeImage";
import { extractPositionsFromPixels } from "./imageRegionExtraction/extractPositionsFromPixels";
import type {
  ExtractedPositions,
  ExtractPositionsError,
  ExtractPositionsOptions,
  PixelImage,
  PositionPostProcessor,
} from "./imageRegionExtraction/types";
import { photoExtractionProfile } from "./photoExtraction/profile";

export type { NormalizeMode, PixelImage } from "./imageRegionExtraction/types";

export type ExtractPhotoPositionsOptions = ExtractPositionsOptions;
export type ExtractedPhotoPositions = ExtractedPositions;
export type ExtractPhotoPositionsError = ExtractPositionsError;

const preserveDetectedLayout: PositionPostProcessor = (rects) => rects;

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
  extractPositionsFromPixels(image, photoExtractionProfile, preserveDetectedLayout, options);

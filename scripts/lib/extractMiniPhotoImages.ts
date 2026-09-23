import type { Result } from "~/utils/result.ts";
import { extractMiniPhotoPositions } from "./extractMiniPhotoPositions.ts";
import {
  extractImages,
  type ExtractedImages,
  type ExtractImagesError,
} from "./imageRegionExtraction/extractImages.ts";

export type ExtractedMiniPhotoImages = ExtractedImages;
export type ExtractMiniPhotoImagesError = ExtractImagesError;

export const extractMiniPhotoImages = async (
  inputPath: string,
): Promise<Result<ExtractedMiniPhotoImages, ExtractMiniPhotoImagesError>> =>
  extractImages(inputPath, extractMiniPhotoPositions);

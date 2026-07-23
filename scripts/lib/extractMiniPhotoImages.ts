import type { Result } from "~/utils/result";
import { extractMiniPhotoPositions } from "./extractMiniPhotoPositions";
import {
  extractImages,
  type ExtractedImages,
  type ExtractImagesError,
} from "./imageRegionExtraction/extractImages";

export type ExtractedMiniPhotoImages = ExtractedImages;
export type ExtractMiniPhotoImagesError = ExtractImagesError;

export const extractMiniPhotoImages = async (
  inputPath: string,
): Promise<Result<ExtractedMiniPhotoImages, ExtractMiniPhotoImagesError>> =>
  extractImages(inputPath, extractMiniPhotoPositions);

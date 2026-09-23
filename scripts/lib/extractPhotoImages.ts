import type { Result } from "~/utils/result.ts";
import { extractPhotoPositions } from "./extractPhotoPositions.ts";
import {
  extractImages,
  type ExtractedImages,
  type ExtractImagesError,
} from "./imageRegionExtraction/extractImages.ts";

export type ExtractedPhotoImages = ExtractedImages;
export type ExtractPhotoImagesError = ExtractImagesError;

export const extractPhotoImages = async (
  inputPath: string,
): Promise<Result<ExtractedPhotoImages, ExtractPhotoImagesError>> =>
  extractImages(inputPath, extractPhotoPositions);

import type { Result } from "~/utils/result";
import { extractPhotoPositions } from "./extractPhotoPositions";
import {
  extractImages,
  type ExtractedImages,
  type ExtractImagesError,
} from "./imageRegionExtraction/extractImages";

export type ExtractedPhotoImages = ExtractedImages;
export type ExtractPhotoImagesError = ExtractImagesError;

export const extractPhotoImages = async (
  inputPath: string,
): Promise<Result<ExtractedPhotoImages, ExtractPhotoImagesError>> =>
  extractImages(inputPath, extractPhotoPositions);

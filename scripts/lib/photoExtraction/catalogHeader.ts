import {
  createForegroundMask,
  estimateBackgroundColor,
  findProjectionRuns,
} from "../imageRegionExtraction/foregroundDetection";
import type { PixelImage } from "../imageRegionExtraction/types";

const FOREGROUND_THRESHOLDS = [20, 45, 100];
const MINIMUM_ROW_SUPPORT_RATIO = 0.02;
const MINIMUM_RUN_HEIGHT_RATIO = 0.03;

export const hasCatalogHeader = (
  image: PixelImage,
  firstCardY: number,
  cardHeight: number,
): boolean => {
  if (firstCardY <= 0) return false;

  const background = estimateBackgroundColor(image);
  const minimumRowSupport = Math.max(3, Math.round(image.width * MINIMUM_ROW_SUPPORT_RATIO));
  const minimumRunHeight = Math.max(2, Math.round(cardHeight * MINIMUM_RUN_HEIGHT_RATIO));
  return FOREGROUND_THRESHOLDS.some((threshold) => {
    const mask = createForegroundMask(image, background, threshold);
    const projection = Array.from({ length: firstCardY }, (_, y) => {
      let support = 0;
      for (let x = 0; x < image.width; x += 1) support += mask[y * image.width + x] ?? 0;
      return support;
    });
    return findProjectionRuns(projection, minimumRowSupport, minimumRunHeight).length > 0;
  });
};
